import {
  removeFromLocalStorage,
  storeInLocalStorage,
} from '@edulastic/api/src/utils/Storage'
import {
  FieldLabel,
  SelectInputStyled,
  EduButton,
  EduIf,
} from '@edulastic/common'
import { Col, Row, Select } from 'antd'
import { get, pick as _pick } from 'lodash'
import PropTypes from 'prop-types'
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { IconExpandBox } from '@edulastic/icons'
import { dictionaries } from '@edulastic/constants'
import {
  getDefaultInterests,
  setDefaultInterests,
} from '../../../author/dataUtils'
import { updateDefaultCurriculumAction } from '../../../author/src/actions/dictionaries'
import {
  getFormattedCurriculumsSelector,
  getRecentStandardsListSelector,
} from '../../../author/src/selectors/dictionaries'
import {
  getDefaultGradesSelector,
  getDefaultSubjectSelector,
  getInterestedGradesSelector,
  getUserDefaultGradesSelector,
  getUserDefaultSubjectSelector,
} from '../../../author/src/selectors/user'
import selectsData from '../../../author/TestPage/components/common/selectsData'
import {
  updateDefaultGradesAction,
  updateDefaultSubjectAction,
} from '../../../student/Login/ducks'
import { alignmentStandardsFromUIToMongo } from '../../utils/helpers'
import CustomTreeSelect from './CustomTreeSelect'
import RecentStandardsList from './RecentStandardsList'
import StandardsModal from './StandardsModal'
import { IconWrapper } from './styled/BrowseButton'
import { ItemBody } from './styled/ItemBody'
import { StyledDiv } from './styled/ELOList'
import { StyledRequired } from '../../../author/Reports/subPages/dataWarehouseReports/GoalsAndInterventions/common/components/Form/styled-components'
import { standardsFields } from '../../../author/AssessmentPage/VideoQuiz/constants'
import {
  getTestEntityGradesSelector,
  getTestEntitySubjectsSelector,
} from '../../../author/TestPage/ducks'

const AlignmentRow = ({
  t,
  curriculums,
  getCurriculumStandards,
  curriculumStandardsELO,
  alignment,
  alignmentIndex,
  qId,
  handleUpdateQuestionAlignment,
  curriculumStandardsLoading,
  editAlignment,
  createUniqGradeAndSubjects,
  formattedCuriculums,
  defaultGrades,
  interestedGrades,
  updateDefaultCurriculum,
  defaultSubject,
  defaultCurriculumId,
  defaultCurriculumName,
  updateDefaultGrades,
  updateDefaultSubject,
  interestedCurriculums,
  recentStandardsList = [],
  isDocBased = false,
  authorQuestionStatus = false,
  showIconBrowserBtn = false,
  hideLabel = false,
  standardsRequiredFields = [],
  testSelectedSubjects = [],
  testSelectedGrades = [],
  considerCustomAlignmentDataSettingPriority = false,
  userDefaultSubject,
  userDefaultGrades,
}) => {
  const {
    subject = 'Mathematics',
    curriculumId = 212,
    curriculum = 'Math - Common Core',
    grades = ['7'],
    standards = [],
  } = alignment

  const userUpdate = useRef(authorQuestionStatus)

  // cleanup (on componentwillunmount)
  useEffect(
    () => () => {
      userUpdate.current = false
    },
    []
  )

  const [showModal, setShowModal] = useState(false)
  const setSubject = (val) => {
    userUpdate.current = true
    updateDefaultSubject(val)
    storeInLocalStorage('defaultSubject', val)
    removeFromLocalStorage('defaultCurriculumId')
    removeFromLocalStorage('defaultCurriculumName')
    updateDefaultCurriculum({
      defaultCurriculumId: '',
      defaultCurriculumName: '',
    })
    editAlignment(alignmentIndex, { subject: val, curriculum: '' })
    setDefaultInterests({ subject: val })
  }

  const setGrades = (val) => {
    userUpdate.current = true
    updateDefaultGrades(val)
    storeInLocalStorage('defaultGrades', val)
    editAlignment(alignmentIndex, { grades: val })
    setDefaultInterests({ grades: val })
  }

  const handleChangeStandard = (_curriculum, event) => {
    userUpdate.current = true
    const _curriculumId = parseInt(event.key, 10)
    storeInLocalStorage('defaultCurriculumId', _curriculumId)
    storeInLocalStorage('defaultCurriculumName', _curriculum)
    updateDefaultCurriculum({
      defaultCurriculumId: _curriculumId,
      defaultCurriculumName: _curriculum,
    })
    editAlignment(alignmentIndex, {
      curriculumId: _curriculumId,
      curriculum: _curriculum,
    })
    setDefaultInterests({ curriculumId: _curriculumId })
  }

  const standardsArr = standards.map((el) => el.identifier)

  const handleSearchStandard = (searchStr) => {
    getCurriculumStandards({ id: curriculumId, grades, searchStr })
  }

  const handleAddStandard = (newStandard) => {
    userUpdate.current = true

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
    const standardsGrades = newStandards.flatMap((standard) => standard.grades)
    createUniqGradeAndSubjects([...grades, ...standardsGrades], subject)
    editAlignment(alignmentIndex, {
      standards: newStandards,
    })
  }

  const handleStandardSelect = (chosenStandardsArr, option) => {
    userUpdate.current = true
    const newStandard = _pick(option.props.obj, [
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
    editAlignment(alignmentIndex, { standards: newStandards })
  }

  const handleApply = (data) => {
    const gradesFromElo = data.eloStandards.flatMap((elo) => elo.grades)
    let { subject: _subject } = data
    if (!_subject) {
      const curriculumFromStandard = data.standard.id
        ? formattedCuriculums.find((c) => c.value === data.standard.id) || {}
        : {}
      _subject = curriculumFromStandard?.subject
    }
    createUniqGradeAndSubjects([...data.grades, ...gradesFromElo], subject)
    editAlignment(alignmentIndex, {
      subject: data.subject,
      curriculum: data.standard.curriculum,
      curriculumId: data.standard.id,
      grades: data.grades,
      standards: data.eloStandards,
    })

    setShowModal(false)
  }

  const handleStandardFocus = () => {
    getCurriculumStandards({ id: curriculumId, grades, searchStr: '' })
  }

  const handleShowBrowseModal = () => {
    setShowModal(true)
  }

  useEffect(() => {
    handleUpdateQuestionAlignment(
      alignmentIndex,
      {
        curriculum,
        curriculumId,
        subject,
        grades,
        domains: alignmentStandardsFromUIToMongo([...standards]),
      },
      userUpdate.current
    )
  }, [alignment])

  useEffect(() => {
    const { curriculumId: alCurriculumId } = alignment
    // TODO use getPreviouslyUsedOrDefaultInterestsSelector from src/client/author/src/selectors/user.js
    const defaultInterests = getDefaultInterests()
    /**
     * EV-16395: The test subjects field data was migrated and fixed. Thus updating below line to get subjects
     */
    const _subject = defaultInterests?.subject || ''

    const _defaultSubject = defaultSubject?.length
      ? defaultSubject
      : userDefaultSubject?.length
      ? userDefaultSubject
      : ''
    const _defaultGrades = defaultGrades?.length
      ? defaultGrades
      : userDefaultGrades?.length
      ? userDefaultGrades
      : null

    if (!alCurriculumId && considerCustomAlignmentDataSettingPriority) {
      const testSubject = testSelectedSubjects?.length
        ? testSelectedSubjects[0]
        : ''
      const testGrades = testSelectedGrades?.length ? testSelectedGrades : null

      editAlignment(alignmentIndex, {
        subject: testSubject || _defaultSubject || _subject || '',
        grades:
          testGrades ||
          _defaultGrades ||
          (defaultInterests.grades?.length ? defaultInterests.grades : []) ||
          [],
        curriculum:
          curriculums.find(
            (item) => item._id === parseInt(defaultInterests.curriculumId, 10)
          )?.curriculum || '',
        curriculumId: parseInt(defaultInterests.curriculumId, 10) || '',
      })

      return
    }

    if (!alCurriculumId) {
      if (
        defaultInterests.subject ||
        defaultInterests.grades?.length ||
        defaultInterests.curriculumId
      ) {
        editAlignment(alignmentIndex, {
          subject: _subject,
          curriculum:
            curriculums.find(
              (item) => item._id === parseInt(defaultInterests.curriculumId, 10)
            )?.curriculum || '',
          curriculumId: parseInt(defaultInterests.curriculumId, 10) || '',
          grades: defaultInterests.grades?.length
            ? defaultInterests.grades
            : [],
        })
      } else if (_defaultSubject && defaultCurriculumId) {
        editAlignment(alignmentIndex, {
          subject: _defaultSubject,
          curriculum: defaultCurriculumName,
          curriculumId: defaultCurriculumId,
          grades: _defaultGrades || interestedGrades || [],
        })
      } else if (interestedCurriculums && interestedCurriculums.length > 0) {
        editAlignment(alignmentIndex, {
          subject: interestedCurriculums[0].subject,
          curriculum: interestedCurriculums[0].name,
          curriculumId: interestedCurriculums[0]._id,
          grades: _defaultGrades || interestedGrades || [],
        })
      } else {
        editAlignment(alignmentIndex, {
          subject: 'Mathematics',
          curriculumId: 212,
          curriculum: 'Math - Common Core',
          grades: ['7'],
          standards: [],
        })
      }
    }
  }, [qId])
  const showMoreButtonEnabled =
    !curriculumStandardsLoading &&
    curriculumStandardsELO &&
    curriculumStandardsELO.length >= dictionaries.STANDARD_DROPDOWN_LIMIT_1000

  const showStandardsRequiredLabel = standardsRequiredFields?.length > 0
  return (
    <>
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
          getCurriculumStandards={getCurriculumStandards}
          curriculumStandardsLoading={curriculumStandardsLoading}
          editAlignment={editAlignment}
          alignmentIndex={alignmentIndex}
        />
      )}
      <Row>
        <EduIf condition={!hideLabel}>
          <FieldLabel>
            {`Standards ${showStandardsRequiredLabel ? `` : `(optional)`}`}
            <EduIf condition={showStandardsRequiredLabel}>
              <StyledRequired>*</StyledRequired>
            </EduIf>
          </FieldLabel>
        </EduIf>

        <Row gutter={24}>
          <Col md={showIconBrowserBtn ? 12 : 10}>
            <CustomTreeSelect
              bg={!showIconBrowserBtn && 'white'}
              data-cy="subjectStandardSet"
              title={`${curriculum}${curriculum && grades.length ? ' - ' : ''}${
                grades.length ? 'Grade - ' : ''
              }${grades.length ? grades : ''}`}
            >
              <>
                <ItemBody data-cy="subjectItem">
                  <FieldLabel>
                    {t('component.options.subject')}
                    <EduIf
                      condition={standardsRequiredFields.includes(
                        standardsFields.SUBJECT
                      )}
                    >
                      <StyledRequired>*</StyledRequired>
                    </EduIf>
                  </FieldLabel>
                  <SelectInputStyled
                    data-cy="subjectSelect"
                    value={subject}
                    getPopupContainer={(trigger) => trigger.parentNode}
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
                  <FieldLabel>
                    {t('component.options.standardSet')}
                    <EduIf
                      condition={standardsRequiredFields.includes(
                        standardsFields.STANDARD_SET
                      )}
                    >
                      <StyledRequired>*</StyledRequired>
                    </EduIf>
                  </FieldLabel>
                  <SelectInputStyled
                    data-cy="standardSetSelect"
                    showSearch
                    filterOption
                    value={curriculum}
                    dropdownClassName="custom-antd-select"
                    getPopupContainer={(trigger) => trigger.parentNode}
                    onChange={handleChangeStandard}
                  >
                    {formattedCuriculums.map(({ value, text, disabled }) => (
                      <Select.Option
                        key={value}
                        value={text}
                        disabled={disabled}
                      >
                        {text}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </ItemBody>
                <ItemBody data-cy="gradeItem">
                  <FieldLabel>
                    {t('component.options.grade')}
                    <EduIf
                      condition={standardsRequiredFields.includes(
                        standardsFields.GRADES
                      )}
                    >
                      <StyledRequired>*</StyledRequired>
                    </EduIf>
                  </FieldLabel>
                  <SelectInputStyled
                    data-cy="gradeSelect"
                    mode="multiple"
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    value={grades}
                    onChange={setGrades}
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
          <Col md={showIconBrowserBtn ? 12 : 10}>
            <div data-cy="searchStandardSelectItem">
              <SelectInputStyled
                bg={!showIconBrowserBtn && 'white'}
                data-cy="searchStandardSelect"
                mode="multiple"
                style={{ margin: 'auto', display: 'block' }}
                placeholder={t('component.options.searchStandards')}
                filterOption={false}
                value={standardsArr}
                optionLabelProp="title"
                getPopupContainer={(trigger) => trigger.parentNode}
                onFocus={handleStandardFocus}
                onSearch={handleSearchStandard}
                onSelect={handleStandardSelect}
                onDeselect={handleStandardDeselect}
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
                {showMoreButtonEnabled && (
                  <Select.Option
                    title="Show More"
                    value="show"
                    style={{ display: 'block', cursor: 'pointer' }}
                    disabled
                  >
                    <StyledDiv onClick={handleShowBrowseModal}>
                      <span>Show More</span>
                    </StyledDiv>
                  </Select.Option>
                )}
              </SelectInputStyled>
            </div>
            {recentStandardsList &&
              recentStandardsList.length > 0 &&
              !isDocBased && (
                <RecentStandardsList
                  recentStandardsList={recentStandardsList}
                  standardsArr={standardsArr}
                  handleAddStandard={handleAddStandard}
                />
              )}
          </Col>

          {showIconBrowserBtn ? (
            <IconWrapper data-cy="standardBrowseButton">
              <IconExpandBox onClick={handleShowBrowseModal} />
            </IconWrapper>
          ) : (
            <Col md={4}>
              <div>
                <EduButton
                  width="100%"
                  height="40px"
                  isGhost
                  onClick={handleShowBrowseModal}
                >
                  {t('component.options.browse')}
                </EduButton>
              </div>
            </Col>
          )}
        </Row>
        {recentStandardsList && recentStandardsList.length > 0 && isDocBased && (
          <Col xs={24}>
            <RecentStandardsList
              isDocBased
              recentStandardsList={recentStandardsList}
              standardsArr={standardsArr}
              handleAddStandard={handleAddStandard}
            />
          </Col>
        )}
      </Row>
    </>
  )
}

AlignmentRow.propTypes = {
  t: PropTypes.func.isRequired,
  getCurriculumStandards: PropTypes.func.isRequired,
  curriculums: PropTypes.array.isRequired,
  curriculumStandardsELO: PropTypes.array.isRequired,
  alignment: PropTypes.object.isRequired,
  editAlignment: PropTypes.func.isRequired,
  standardsRequiredFields: PropTypes.array,
  testSelectedSubjects: PropTypes.array,
  testSelectedGrades: PropTypes.array,
  considerCustomAlignmentDataSettingPriority: PropTypes.bool,
  userDefaultSubject: PropTypes.array,
  userDefaultGrades: PropTypes.array,
}

AlignmentRow.defaultProps = {
  standardsRequiredFields: [],
  testSelectedSubjects: [],
  testSelectedGrades: [],
  considerCustomAlignmentDataSettingPriority: false,
  userDefaultSubject: [],
  userDefaultGrades: [],
}

export default connect(
  (state, props) => ({
    defaultCurriculumId: get(state, 'dictionaries.defaultCurriculumId'),
    defaultCurriculumName: get(state, 'dictionaries.defaultCurriculumName'),
    formattedCuriculums: getFormattedCurriculumsSelector(
      state,
      props.alignment
    ),
    defaultGrades: getDefaultGradesSelector(state),
    interestedGrades: getInterestedGradesSelector(state),
    defaultSubject: getDefaultSubjectSelector(state),
    userDefaultSubject: getUserDefaultSubjectSelector(state),
    userDefaultGrades: getUserDefaultGradesSelector(state),
    recentStandardsList: getRecentStandardsListSelector(state),
    testSelectedSubjects: getTestEntitySubjectsSelector(state),
    testSelectedGrades: getTestEntityGradesSelector(state),
  }),
  {
    updateDefaultCurriculum: updateDefaultCurriculumAction,
    updateDefaultSubject: updateDefaultSubjectAction,
    updateDefaultGrades: updateDefaultGradesAction,
  }
)(AlignmentRow)
