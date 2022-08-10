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
import Alignments from './PlaylistContentFilterModal/Alignments'

const defaultAlignmentValues = {
  standards: [],
  grades: [],
  domains: [],
  subject: '',
  curriculumId: '',
  curriculum: '',
}

export const triggerParent = (el) => el.parentNode

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
  alignment,
  setAlignment,
  setSelectedStandards = () => {},
  isVerticalView,
  curriculum: defaultCurriculum = '',
  selectedStandards = [],
}) => {
  const [showModal, setShowModal] = useState(false)

  const defaultAlignment = {
    ...defaultAlignmentValues,
    curriculum: defaultCurriculum,
  }

  const { elo: curriculumStandardsELO = [], tlo: curriculumStandardsTLO = [] } =
    curriculumStandards || {}

  const handleEditAlignment = (standardSet) => {
    const oldAlignment = alignment || defaultAlignment

    setAlignment({
      ...oldAlignment,
      ...standardSet,
    })
  }

  const {
    subject = '',
    curriculumId,
    curriculum = defaultCurriculum,
    grades = [],
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
    const _curriculumId = parseInt(event.key, 10)
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

  const clearFilters = () => {
    setAlignment({})
    setSelectedStandards([])
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

    setSelectedStandards(newStandards)
    handleEditAlignment({
      standards: newStandards,
    })
  }

  useEffect(() => {
    if (curriculums.length === 0) {
      getCurriculums()
    }
  }, [])

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
    setSelectedStandards(newStandards)
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

    setSelectedStandards(data.eloStandards)
    setShowModal(false)
  }

  return (
    <Row style={{ width: '100%' }}>
      {!isVerticalView && <FieldLabel>Standards (optional)</FieldLabel>}
      <Row gutter={24}>
        {isVerticalView ? (
          <Col md={24}>
            <Alignments
              selectsData={selectsData}
              subject={subject}
              curriculum={curriculum}
              formattedCuriculums={formattedCuriculums}
              grades={grades}
              t={t}
              setGrades={setGrades}
              setSubject={setSubject}
              handleChangeStandard={handleChangeStandard}
              clearFilters={clearFilters}
            />
          </Col>
        ) : (
          <Col md={12}>
            <CustomTreeSelect
              data-cy="subjectStandardSet"
              title={`${curriculum}${curriculum && grades.length ? ' - ' : ''}${
                grades.length ? 'Grade - ' : ''
              }${grades.length ? grades : ''}`}
            >
              <Alignments
                selectsData={selectsData}
                subject={subject}
                curriculum={curriculum}
                formattedCuriculums={formattedCuriculums}
                grades={grades}
                t={t}
                setGrades={setGrades}
                setSubject={setSubject}
                handleChangeStandard={handleChangeStandard}
              />
            </CustomTreeSelect>
          </Col>
        )}
        <StyledCol className={isVerticalView && 'col-view'} md={12}>
          <div data-cy="searchStandardSelectItem">
            {isVerticalView && <FieldLabel>Standards</FieldLabel>}
            <SelectInputStyled
              defaultValue={selectedStandards}
              data-cy="searchStandardSelect"
              mode="multiple"
              style={{ margin: 'auto', display: 'block' }}
              placeholder={t('component.options.selectResourceStandards')}
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
          <IconWrapper className="expand-icon">
            <IconExpandBox onClick={handleShowBrowseModal} />
          </IconWrapper>
        </StyledCol>

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
          defaultSubject={subject}
          defaultGrades={grades}
          defaultStandards={standards}
          defaultStandard={{ curriculum, id: curriculumId }}
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
          isPlaylistView
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
        props.alignment || defaultAlignmentValues
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
export const StyledCol = styled(Col)`
  &.col-view {
    width: 100%;
    margin-top: 15px;
    position: relative;
    .expand-icon {
      top: 33px;
    }
  }
`
