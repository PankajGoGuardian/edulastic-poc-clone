import {
  removeFromLocalStorage,
  storeInLocalStorage,
} from '@edulastic/api/src/utils/Storage'
import { themeColor } from '@edulastic/colors'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { IconExpandBox } from '@edulastic/icons'
import { Col, Row, Select } from 'antd'
import { get, pick } from 'lodash'
import React, { useEffect, useState } from 'react'
import { withNamespaces } from 'react-i18next'
import connect from 'react-redux/lib/connect/connect'
import { compose } from 'redux'
import styled from 'styled-components'
import CustomTreeSelect from '../../../assessment/containers/QuestionMetadata/CustomTreeSelect'
import RecentStandardsList from '../../../assessment/containers/QuestionMetadata/RecentStandardsList'
import StandardsModal from '../../../assessment/containers/QuestionMetadata/StandardsModal'
import { ItemBody } from '../../../assessment/containers/QuestionMetadata/styled/ItemBody'
import {
  updateDefaultGradesAction,
  updateDefaultSubjectAction,
} from '../../../student/Login/ducks'
import { setDefaultInterests } from '../../dataUtils'
import {
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction,
  updateDefaultCurriculumAction,
} from '../../src/actions/dictionaries'
import {
  getCurriculumsListSelector,
  getFormattedCurriculumsSelector,
  getRecentStandardsListSelector,
  getStandardsListSelector,
  standardsSelector,
} from '../../src/selectors/dictionaries'
import { selectsData } from '../../TestPage/components/common'

const defaultAlignment = {
  standards: [],
  grades: [],
  domains: [],
  subject: '',
  curriculumId: '',
  curriculum: '',
}

const triggerParent = (el) => el.parentNode

const ResourcesAlignment = ({
  curriculums,
  getCurriculums,
  curriculumStandards,
  getCurriculumStandards,
  t,
  formattedCuriculums = [],
  curriculumStandardsLoading,
  recentStandardsList = [],
  updateDefaultCurriculum,
  updateDefaultSubject,
  updateDefaultGrades,
}) => {
  const [alignment, setAlignment] = useState({})
  const [showModal, setShowModal] = useState(false)

  const { elo: curriculumStandardsELO = [], tlo: curriculumStandardsTLO = [] } =
    curriculumStandards || {}

  useEffect(() => {
    if (curriculums.length === 0) {
      getCurriculums()
    }
  }, [])

  const handleEditAlignment = (standardSet) => {
    const oldAlignment = alignment || defaultAlignment

    setAlignment({
      ...oldAlignment,
      ...standardSet,
    })
  }

  const {
    subject = 'Mathematics',
    curriculumId = 212,
    curriculum = 'Math - Common Core',
    grades = ['7'],
    standards = [],
  } = alignment || defaultAlignment

  const setSubject = (val) => {
    updateDefaultSubject(val)
    storeInLocalStorage('defaultSubject', val)
    removeFromLocalStorage('defaultCurriculumId')
    removeFromLocalStorage('defaultCurriculumName')
    updateDefaultCurriculum({
      defaultCurriculumId: '',
      defaultCurriculumName: '',
    })
    handleEditAlignment({ subject: val, curriculum: '' })
    setDefaultInterests({ subject: val })
  }

  const setGrades = (val) => {
    updateDefaultGrades(val)
    storeInLocalStorage('defaultGrades', val)
    handleEditAlignment({ grades: val })
    setDefaultInterests({ grades: val })
  }

  const handleChangeStandard = (_curriculum, event) => {
    const _curriculumId = event.key
    storeInLocalStorage('defaultCurriculumId', _curriculumId)
    storeInLocalStorage('defaultCurriculumName', _curriculum)
    updateDefaultCurriculum({
      defaultCurriculumId: _curriculumId,
      defaultCurriculumName: _curriculum,
    })
    handleEditAlignment({
      curriculumId: _curriculumId,
      curriculum: _curriculum,
    })
    setDefaultInterests({ curriculumId: _curriculumId })
  }

  const standardsArr = standards.map((el) => el.identifier)

  const handleAddStandard = (newStandard) => {
    let newStandards = standards.some(
      (standard) => standard._id === newStandard._id
    )
    if (newStandards) {
      newStandards = standards.filter(
        (standard) => standard._id !== newStandard._id
      )
    } else {
      newStandards = [...standards, newStandard]
    }
    handleEditAlignment({
      standards: newStandards,
    })
  }

  const handleStandardFocus = () => {
    getCurriculumStandards(curriculumId, grades, '')
  }

  const handleShowBrowseModal = () => {
    handleStandardFocus()
    setShowModal(true)
  }

  const handleSearchStandard = (searchStr) => {
    getCurriculumStandards(curriculumId, grades, searchStr)
  }

  const handleStandardSelect = (_, option) => {
    const newStandard = pick(option.props.obj, [
      '_id',
      'level',
      'grades',
      'identifier',
      'tloIdentifier',
      'tloId',
      'tloDescription',
      'eloId',
      'subEloId',
      'description',
      'curriculumId',
    ])

    handleAddStandard(newStandard)
  }

  const handleStandardDeselect = (removedElement) => {
    const newStandards = standards.filter(
      (el) => el.identifier !== removedElement
    )
    handleEditAlignment({ standards: newStandards })
  }

  const handleApply = (data) => {
    let { subject: _subject } = data
    if (!_subject) {
      const curriculumFromStandard = data.standard.id
        ? formattedCuriculums.find((c) => c.value === data.standard.id) || {}
        : {}
      _subject = curriculumFromStandard?.subject
    }
    handleEditAlignment({
      subject: data.subject,
      curriculum: data.standard.curriculum,
      curriculumId: data.standard.id,
      grades: data.grades,
      standards: data.eloStandards,
    })

    setShowModal(false)
  }

  return (
    <Row style={{ width: '100%' }}>
      <FieldLabel>Standards (optional)</FieldLabel>
      <Row gutter={24}>
        <Col md={12}>
          <CustomTreeSelect
            data-cy="subjectStandardSet"
            title={`${curriculum}${curriculum && grades.length ? ' - ' : ''}${
              grades.length ? 'Grade - ' : ''
            }${grades.length ? grades : ''}`}
          >
            <>
              <ItemBody data-cy="subjectItem">
                <FieldLabel>{t('component.options.subject')}</FieldLabel>
                <SelectInputStyled
                  getPopupContainer={triggerParent}
                  data-cy="subjectSelect"
                  value={subject}
                  onChange={setSubject}
                >
                  {selectsData.allSubjects.map(({ text, value }) =>
                    value ? (
                      <Select.Option key={value} value={value}>
                        {text}
                      </Select.Option>
                    ) : (
                      ''
                    )
                  )}
                </SelectInputStyled>
              </ItemBody>
              <ItemBody data-cy="standardItem">
                <FieldLabel>{t('component.options.standardSet')}</FieldLabel>
                <SelectInputStyled
                  data-cy="standardSetSelect"
                  showSearch
                  filterOption
                  value={curriculum}
                  onChange={handleChangeStandard}
                  getPopupContainer={triggerParent}
                >
                  {formattedCuriculums.map(({ value, text, disabled }) => (
                    <Select.Option key={value} value={text} disabled={disabled}>
                      {text}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              </ItemBody>
              <ItemBody data-cy="gradeItem">
                <FieldLabel>{t('component.options.grade')}</FieldLabel>
                <SelectInputStyled
                  data-cy="gradeSelect"
                  mode="multiple"
                  showSearch
                  value={grades}
                  onChange={setGrades}
                  getPopupContainer={triggerParent}
                >
                  {selectsData.allGrades.map(({ text, value }) => (
                    <Select.Option key={text} value={value}>
                      {text}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              </ItemBody>
            </>
          </CustomTreeSelect>
        </Col>
        <Col md={12}>
          <div data-cy="searchStandardSelectItem">
            <SelectInputStyled
              data-cy="searchStandardSelect"
              mode="multiple"
              style={{ margin: 'auto', display: 'block' }}
              placeholder={t('component.options.searchStandards')}
              filterOption={false}
              value={standardsArr}
              optionLabelProp="title"
              onFocus={handleStandardFocus}
              onSearch={handleSearchStandard}
              onSelect={handleStandardSelect}
              onDeselect={handleStandardDeselect}
              getPopupContainer={triggerParent}
            >
              {!curriculumStandardsLoading &&
                curriculumStandardsELO &&
                curriculumStandardsELO.length > 0 &&
                curriculumStandardsELO.map((el) => (
                  <Select.Option
                    title={el.identifier}
                    key={el._id}
                    value={el.identifier}
                    obj={el}
                    style={{ whiteSpace: 'normal' }}
                  >
                    <div>
                      <div>
                        <b>{el.identifier}</b>
                      </div>
                      <div
                        className="selected-item-desctiption"
                        dangerouslySetInnerHTML={{ __html: el.description }}
                      />
                    </div>
                  </Select.Option>
                ))}
            </SelectInputStyled>
          </div>
        </Col>

        <IconWrapper>
          <IconExpandBox onClick={handleShowBrowseModal} />
        </IconWrapper>
        {recentStandardsList && recentStandardsList.length > 0 && (
          <Col xs={24}>
            <RecentStandardsList
              recentStandardsList={recentStandardsList}
              standardsArr={standardsArr}
              handleAddStandard={handleAddStandard}
            />
          </Col>
        )}
      </Row>
      {showModal && (
        <StandardsModal
          t={t}
          subject={subject}
          grades={grades}
          standards={standards}
          standard={{ curriculum, id: curriculumId }}
          visible={showModal}
          curriculums={curriculums}
          onApply={handleApply}
          setSubject={setSubject}
          onCancel={() => setShowModal(false)}
          curriculumStandardsELO={curriculumStandardsELO}
          curriculumStandardsTLO={curriculumStandardsTLO}
          getCurriculumStandards={getCurriculumStandards}
          curriculumStandardsLoading={curriculumStandardsLoading}
          editAlignment={handleEditAlignment}
          alignmentIndex={0}
        />
      )}
    </Row>
  )
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state, props) => ({
      curriculums: getCurriculumsListSelector(state),
      curriculumStandardsLoading: standardsSelector(state).loading,
      curriculumStandards: getStandardsListSelector(state),
      defaultCurriculumId: get(state, 'dictionaries.defaultCurriculumId'),
      defaultCurriculumName: get(state, 'dictionaries.defaultCurriculumName'),
      formattedCuriculums: getFormattedCurriculumsSelector(
        state,
        props.alignment || defaultAlignment
      ),
      recentStandardsList: getRecentStandardsListSelector(state),
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      updateDefaultCurriculum: updateDefaultCurriculumAction,
      updateDefaultSubject: updateDefaultSubjectAction,
      updateDefaultGrades: updateDefaultGradesAction,
    }
  )
)

export default enhance(ResourcesAlignment)

export const IconWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 10px;
  z-index: 1;
  color: ${themeColor};
  cursor: pointer;
`
