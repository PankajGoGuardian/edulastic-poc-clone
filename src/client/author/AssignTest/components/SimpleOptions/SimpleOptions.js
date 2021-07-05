import { notification } from '@edulastic/common'
import {
  assignmentPolicyOptions,
  assignmentSettingSections as sectionContants,
  roleuser,
  test as testConst,
} from '@edulastic/constants'
import { Tabs } from 'antd'
import produce from 'immer'
import { curry, get, isBoolean, keyBy } from 'lodash'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { isFeatureAccessible } from '../../../../features/components/FeaturesSwitch'
import { getUserFeatures } from '../../../../student/Login/ducks'
import { getRecommendedResources } from '../../../CurriculumSequence/components/ManageContentBlock/ducks'
import { setEmbeddedVideoPreviewModal as setEmbeddedVideoPreviewModalAction } from '../../../CurriculumSequence/ducks'
import { getUserRole } from '../../../src/selectors/user'
import selectsData from '../../../TestPage/components/common/selectsData'
import {
  getDisableAnswerOnPaperSelector,
  getIsOverrideFreezeSelector,
  getReleaseScorePremiumSelector,
} from '../../../TestPage/ducks'
import { getSelectedResourcesAction } from '../../duck'
import { getListOfActiveStudents } from '../../utils'
import AdvancedOptons from '../AdvancedOptons/AdvancedOptons'
import AntiCheatingGroupContainer from '../Container/AntiCheatingGroupContainer'
import AutoRedirectGroupContainer from '../Container/AutoRedirectGroupContainer'
import ClassGroupContainer from '../Container/ClassGroupContainer'
import DollarPremiumSymbol from '../Container/DollarPremiumSymbol'
import MiscellaneousGroupContainer from '../Container/MiscellaneousGroupContainer'
import { TabContentContainer } from '../Container/styled'
import TestBehaviorGroupContainer from '../Container/TestBehaviorGroupContainer'
import { OptionConationer } from './styled'

const { TabPane } = Tabs

export const releaseGradeKeys = [
  'DONT_RELEASE',
  'SCORE_ONLY',
  'WITH_RESPONSE',
  'WITH_ANSWERS',
]
export const nonPremiumReleaseGradeKeys = ['DONT_RELEASE', 'WITH_ANSWERS']
const completionTypeKeys = ['AUTOMATICALLY', 'MANUALLY']

const { releaseGradeLabels, evalTypeLabels } = testConst
class SimpleOptions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _releaseGradeKeys: nonPremiumReleaseGradeKeys,
    }
    this.containerRef = React.createRef()
  }

  static getDerivedStateFromProps(nextProps) {
    const { features, testSettings } = nextProps
    const { grades, subjects } = testSettings || {}
    if (
      features.assessmentSuperPowersReleaseScorePremium ||
      (grades &&
        subjects &&
        isFeatureAccessible({
          features,
          inputFeatures: 'assessmentSuperPowersReleaseScorePremium',
          gradeSubject: { grades, subjects },
        }))
    ) {
      return {
        _releaseGradeKeys: releaseGradeKeys,
      }
    }
    return {
      _releaseGradeKeys: nonPremiumReleaseGradeKeys,
    }
  }

  componentDidMount() {
    const {
      features: { free, premium },
      testSettings = {},
      assignment,
    } = this.props
    if (free && !premium) {
      this.onChange('releaseScore', releaseGradeLabels.WITH_ANSWERS)
    }
    const {
      scoringType: _scoringType,
      penalty: _penalty,
      safeBrowser,
      applyEBSR,
    } = testSettings
    const { scoringType = _scoringType, penalty = _penalty } = assignment
    if (safeBrowser === true) {
      this.overRideSettings('safeBrowser', true)
    }
    if (scoringType === evalTypeLabels.PARTIAL_CREDIT && !penalty)
      this.overRideSettings(
        'scoringType',
        evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT
      )
    if (
      [
        evalTypeLabels.PARTIAL_CREDIT,
        evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT,
      ].includes(scoringType) &&
      isBoolean(applyEBSR)
    ) {
      this.overRideSettings('applyEBSR', applyEBSR)
    }
  }

  toggleSettings = () => {
    const { freezeSettings } = this.props
    const { showSettings } = this.state
    if (freezeSettings && !showSettings) {
      notification({ type: 'warn', messageKey: 'overrrideSettingsRestricted' })
    }
    this.setState({ showSettings: !showSettings })
  }

  onChange = (field, value) => {
    const {
      onClassFieldChange,
      group,
      updateOptions,
      isReleaseScorePremium,
      userRole,
      features: { free, premium },
    } = this.props
    let { assignment } = this.props
    if (field === 'class') {
      const { classData, termId } = onClassFieldChange(value, group)
      const nextAssignment = produce(assignment, (state) => {
        state.class = classData
        state.termId = termId
      })
      updateOptions(nextAssignment)
      return
    }
    if (field === 'endDate' || field === 'dueDate') {
      const { startDate } = assignment
      if (value === null) {
        value = moment(startDate).add('days', 7)
      }
    }

    if (
      field === 'restrictNavigationOut' &&
      value === 'warn-and-report-after-n-alerts'
    ) {
      assignment = { ...assignment, restrictNavigationOutAttemptsThreshold: 5 }
    }

    if (field === 'safeBrowser' && value === true) {
      assignment = {
        ...assignment,
        restrictNavigationOut: undefined,
      }
    }
    if (field === 'applyEBSR') {
      assignment = {
        ...assignment,
        applyEBSR: isBoolean(value) ? value : false,
      }
    }

    const nextAssignment = produce(assignment, (state) => {
      switch (field) {
        case 'startDate': {
          const { endDate } = assignment
          if (value === null) {
            value = moment()
          }
          const diff = value.diff(endDate)
          if (diff > 0) {
            state.endDate = moment(value).add('days', 7)
          }
          break
        }
        case 'testType': {
          if (
            value === testConst.type.ASSESSMENT ||
            value === testConst.type.COMMON
          ) {
            state.releaseScore =
              value === testConst.type.ASSESSMENT && isReleaseScorePremium
                ? releaseGradeLabels.WITH_RESPONSE
                : releaseGradeLabels.DONT_RELEASE
            if (free && !premium) {
              state.releaseScore = releaseGradeLabels.WITH_ANSWERS
            }
            state.maxAttempts = 1
            state.maxAnswerChecks = 0
          } else {
            state.releaseScore = releaseGradeLabels.WITH_ANSWERS
            state.maxAttempts = 1
            state.maxAnswerChecks = 3
          }
          break
        }
        case 'passwordPolicy': {
          if (
            value === testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
          ) {
            state.openPolicy =
              userRole === roleuser.DISTRICT_ADMIN ||
              userRole === roleuser.SCHOOL_ADMIN
                ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
                : assignmentPolicyOptions.POLICY_OPEN_MANUALLY_IN_CLASS
            state.passwordExpireIn = 15 * 60
          } else {
            state.openPolicy =
              userRole === roleuser.DISTRICT_ADMIN ||
              userRole === roleuser.SCHOOL_ADMIN
                ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
                : assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE
          }
          break
        }
        // no default
      }

      // Settings OverrideSettings method has similar condition
      if (field === 'scoringType') {
        state.penalty = value === evalTypeLabels.PARTIAL_CREDIT
      }
      if (typeof value === 'undefined') {
        state[field] = null
      } else {
        state[field] = value
      }
    })
    updateOptions(nextAssignment)
  }

  updateStudents = (selected) => {
    const { group, assignment, updateOptions } = this.props
    const [groupId, studentId] = selected.split(`_`)
    const groupById = keyBy(group, '_id')
    const classData = assignment.class.map((item) => {
      const { _id } = item
      if (_id !== groupId) return item
      return {
        _id,
        name: get(groupById, `${_id}.name`, ''),
        assignedCount: get(item, 'students.length', 0) + 1,
        students: [...get(item, 'students', []), studentId],
        grade: get(groupById, `${_id}.grades`, ''),
        subject: get(groupById, `${_id}.subject`, ''),
      }
    })
    const nextAssignment = produce(assignment, (state) => {
      state.class = classData
    })
    updateOptions(nextAssignment)
  }

  selectAllStudents = () => {
    const { group, assignment, updateOptions, students } = this.props
    const studentsByGroupId = {}
    for (const student of students) {
      if (!studentsByGroupId[student.groupId]) {
        studentsByGroupId[student.groupId] = [student._id]
      } else {
        studentsByGroupId[student.groupId].push(student._id)
      }
    }
    const groupById = keyBy(group, '_id')
    const classData = assignment.class.map((item) => {
      const { _id } = item
      return {
        _id,
        name: get(groupById, `${_id}.name`, ''),
        assignedCount: studentsByGroupId[_id]?.length || 0,
        students: studentsByGroupId[_id] || [],
        grade: get(groupById, `${_id}.grades`, ''),
        subject: get(groupById, `${_id}.subject`, ''),
      }
    })
    const nextAssignment = produce(assignment, (state) => {
      state.class = classData
    })
    updateOptions(nextAssignment)
  }

  unselectAllStudents = () => {
    const { assignment, updateOptions, group } = this.props
    const groupById = keyBy(group, '_id')
    const nextAssignment = produce(assignment, (state) => {
      state.class = assignment.class.map((item) => {
        delete item.students
        return {
          ...item,
          assignedCount: groupById[item._id].studentCount,
        }
      })
    })
    updateOptions(nextAssignment)
  }

  // Always expected student Id and class Id
  handleRemoveStudents = (selected) => {
    const { assignment, group, updateOptions } = this.props
    const [groupId, studentId] = selected.split(`_`)
    const nextAssignment = produce(assignment, (state) => {
      state.class = assignment.class.map((item) => {
        if (item._id === groupId) {
          let assignedCount = item.assignedCount - 1
          if (assignedCount === 0) {
            assignedCount = keyBy(group, '_id')[groupId].studentCount
          }
          const newItem = {
            ...item,
            students: (item.students || []).filter(
              (student) => student !== studentId
            ),
            assignedCount,
          }
          if (assignedCount === 0) {
            delete newItem.students
          }
          return newItem
        }
        return item
      })
    })
    updateOptions(nextAssignment)
  }

  overRideSettings = (key, value) => {
    const { disableAnswerOnPaper, assignmentSettings } = this.props
    if ((key === 'maxAnswerChecks' || key === 'maxAttempts') && value < 0)
      value = 0
    if (key === 'answerOnPaper' && value && disableAnswerOnPaper) {
      return notification({
        messageKey: 'answerOnPaperNotSupportedForThisTest',
      })
    }

    const newSettings = {}

    // SimpleOptions onChange method has similar condition
    if (key === 'scoringType') {
      const penalty = value === evalTypeLabels.PARTIAL_CREDIT
      if (
        ![
          evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT,
          evalTypeLabels.PARTIAL_CREDIT,
        ].includes(value)
      ) {
        newSettings.applyEBSR = false
      }
      newSettings.penalty = penalty
    }

    const newSettingsState = {
      ...assignmentSettings,
      ...newSettings,
      [key]: value,
    }

    if (key === 'safeBrowser' && value === false) {
      delete newSettingsState.sebPassword
    }
    if (key === 'assignmentPassword') {
      // passwordValidationStatus(value)
    }
    this.onChange(key, value)
  }

  render() {
    const { _releaseGradeKeys } = this.state
    const {
      group,
      fetchStudents,
      students,
      testSettings = {},
      assignment,
      updateOptions,
      userRole,
      changeDateSelection,
      selectedDateOption,
      freezeSettings,
      features,
      isAssignRecommendations,
      isRecommendingStandards,
      match,
      totalItems: _totalItems,
      disableAnswerOnPaper,
      isAdvancedView,
      defaultTestProfiles,
      onClassFieldChange,
      activeTab,
      handleTabChange,
      selectedStandardsCount,
      showAssignModuleContent,
      recommendedResources,
      setEmbeddedVideoPreviewModal,
      history,
      isVideoResourcePreviewModal,
      selectedResourcesAction,
    } = this.props

    const resourceIds = history.location?.state?.resourceIds || []
    const showRecommendedResources =
      history.location?.state?.assignedFrom === 'playlistAssignTest' ||
      history.location?.state?.isSparkMathCollection

    const totalItems = isAssignRecommendations
      ? (assignment.questionPerStandard || 1) * selectedStandardsCount
      : _totalItems

    const changeField = curry(this.onChange)
    let { openPolicy } = selectsData
    let { closePolicy } = selectsData
    if (
      userRole === roleuser.DISTRICT_ADMIN ||
      userRole === roleuser.SCHOOL_ADMIN
    ) {
      openPolicy = selectsData.openPolicyForAdmin
      closePolicy = selectsData.closePolicyForAdmin
    }
    // premium flag will be true when atleast one class with premium grade/subject. So until premium is true dont show premium settings in assignments page
    const gradeSubject = {
      grades: [],
      subjects: [],
    }
    const classIds = get(assignment, 'class', []).map((item) => item._id)
    const studentOfSelectedClass = getListOfActiveStudents(students, classIds)
    const showOpenDueAndCloseDate =
      !isAssignRecommendations && features.assignTestEnableOpenDueAndCloseDate
    const questionPerStandardOptions = [...Array(8)].map((_, i) => ({
      val: i + 1,
      label: i + 1,
    }))

    const actionOnFeatureInaccessible = 'disabled'

    const featuresAvailable = {}
    Object.keys(features).forEach((featureKey) => {
      const isAccessible = isFeatureAccessible({
        features,
        inputFeatures: featureKey,
        gradeSubject,
      })
      if (isAccessible) {
        featuresAvailable[featureKey] = true
      } else {
        featuresAvailable[featureKey] = false
      }
    })

    let tootltipWidth
    if (this?.containerRef?.current?.offsetWidth) {
      tootltipWidth = this?.containerRef?.current?.offsetWidth * 0.2 || 0
    }

    return (
      <OptionConationer isAdvancedView={isAdvancedView} ref={this.containerRef}>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="CLASS/GROUP" key={sectionContants.CLASS_GROUP_SECTION}>
            {isAdvancedView ? (
              <TabContentContainer width="100%">
                <AdvancedOptons
                  assignment={assignment}
                  updateOptions={updateOptions}
                  testSettings={testSettings}
                  onClassFieldChange={onClassFieldChange}
                  defaultTestProfiles={defaultTestProfiles}
                  isAssignRecommendations={false}
                />
              </TabContentContainer>
            ) : (
              <TabContentContainer>
                <ClassGroupContainer
                  changeField={changeField}
                  fetchStudents={fetchStudents}
                  classIds={classIds}
                  group={group}
                  studentOfSelectedClass={studentOfSelectedClass}
                  updateStudents={this.updateStudents}
                  selectAllStudents={this.selectAllStudents}
                  unselectAllStudents={this.unselectAllStudents}
                  handleRemoveStudents={this.handleRemoveStudents}
                  assignment={assignment}
                  isAssignRecommendations={isAssignRecommendations}
                  changeDateSelection={changeDateSelection}
                  selectedDateOption={selectedDateOption}
                  showOpenDueAndCloseDate={showOpenDueAndCloseDate}
                  userRole={userRole}
                  openPolicy={openPolicy}
                  closePolicy={closePolicy}
                  testSettings={testSettings}
                  freezeSettings={freezeSettings}
                  isRecommendingStandards={isRecommendingStandards}
                  questionPerStandardOptions={questionPerStandardOptions}
                  tootltipWidth={tootltipWidth}
                  recommendedResources={recommendedResources}
                  setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                  resourceIds={resourceIds}
                  isVideoResourcePreviewModal={isVideoResourcePreviewModal}
                  showRecommendedResources={showRecommendedResources}
                  selectedResourcesAction={selectedResourcesAction}
                />
              </TabContentContainer>
            )}
          </TabPane>
          <TabPane
            tab="TEST BEHAVIOR"
            key={sectionContants.TEST_BEHAVIOR_SECTION}
          >
            <TabContentContainer>
              <TestBehaviorGroupContainer
                assignmentSettings={assignment}
                changeField={changeField}
                testSettings={testSettings}
                gradeSubject={gradeSubject}
                _releaseGradeKeys={_releaseGradeKeys}
                isDocBased={testSettings.isDocBased}
                freezeSettings={freezeSettings}
                completionTypeKeys={completionTypeKeys}
                premium={features?.premium}
                calculatorProvider={features?.calculatorProvider}
                overRideSettings={this.overRideSettings}
                match={match}
                totalItems={totalItems}
                userRole={userRole}
                actionOnFeatureInaccessible={actionOnFeatureInaccessible}
                featuresAvailable={featuresAvailable}
                tootltipWidth={tootltipWidth}
                showAssignModuleContent={showAssignModuleContent}
              />
            </TabContentContainer>
          </TabPane>
          <TabPane
            tab={
              <span>
                ANTI-CHEATING
                <DollarPremiumSymbol premium={features?.premium} />
              </span>
            }
            key={sectionContants.ANTI_CHEATING_SECTION}
          >
            <TabContentContainer>
              <AntiCheatingGroupContainer
                assignmentSettings={assignment}
                changeField={changeField}
                testSettings={testSettings}
                gradeSubject={gradeSubject}
                isDocBased={testSettings.isDocBased}
                freezeSettings={freezeSettings}
                overRideSettings={this.overRideSettings}
                actionOnFeatureInaccessible={actionOnFeatureInaccessible}
                featuresAvailable={featuresAvailable}
                tootltipWidth={tootltipWidth}
              />
            </TabContentContainer>
          </TabPane>
          <TabPane
            tab={
              <span>
                AUTO REDIRECT SETTINGS
                <DollarPremiumSymbol premium={features?.premium} />
              </span>
            }
            key={sectionContants.AUTO_REDIRECT_SECTION}
          >
            <TabContentContainer>
              <AutoRedirectGroupContainer
                assignmentSettings={assignment}
                gradeSubject={gradeSubject}
                freezeSettings={freezeSettings}
                updateAssignmentSettings={updateOptions}
                actionOnFeatureInaccessible={actionOnFeatureInaccessible}
                featuresAvailable={featuresAvailable}
                tootltipWidth={tootltipWidth}
                testSettings={testSettings}
                overRideSettings={this.overRideSettings}
                isDocBased={testSettings.isDocBased}
              />
            </TabContentContainer>
          </TabPane>
          <TabPane
            tab={
              <span>
                MISCELLANEOUS
                <DollarPremiumSymbol premium={features?.premium} />
              </span>
            }
            key={sectionContants.MISCELLANEOUS_SECTION}
          >
            <TabContentContainer>
              <MiscellaneousGroupContainer
                assignmentSettings={assignment}
                changeField={changeField}
                testSettings={testSettings}
                gradeSubject={gradeSubject}
                isDocBased={testSettings.isDocBased}
                freezeSettings={freezeSettings}
                premium={features?.premium}
                overRideSettings={this.overRideSettings}
                userRole={userRole}
                disableAnswerOnPaper={disableAnswerOnPaper}
                actionOnFeatureInaccessible={actionOnFeatureInaccessible}
                featuresAvailable={featuresAvailable}
                tootltipWidth={tootltipWidth}
              />
            </TabContentContainer>
          </TabPane>
        </Tabs>
      </OptionConationer>
    )
  }
}

SimpleOptions.propTypes = {
  assignment: PropTypes.object.isRequired,
  testSettings: PropTypes.object.isRequired,
  updateOptions: PropTypes.func.isRequired,
  isAssignRecommendations: PropTypes.bool.isRequired,
  isRecommendingStandards: PropTypes.bool,
  group: PropTypes.array,
  students: PropTypes.array,
  fetchStudents: PropTypes.func,
  setEmbeddedVideoPreviewModal: PropTypes.func,
}

SimpleOptions.defaultProps = {
  group: [],
  students: [],
  fetchStudents: () => false,
  isRecommendingStandards: false,
  setEmbeddedVideoPreviewModal: () => {},
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      userRole: getUserRole(state),
      features: getUserFeatures(state),
      isReleaseScorePremium: getReleaseScorePremiumSelector(state),
      freezeSettings: getIsOverrideFreezeSelector(state),
      disableAnswerOnPaper: getDisableAnswerOnPaperSelector(state),
      recommendedResources: getRecommendedResources(state),
      isVideoResourcePreviewModal:
        state.curriculumSequence?.isVideoResourcePreviewModal,
      totalItems: state?.tests?.entity?.isDocBased
        ? state?.tests?.entity?.summary?.totalQuestions
        : state?.tests?.entity?.summary?.totalItems,
    }),
    {
      setEmbeddedVideoPreviewModal: setEmbeddedVideoPreviewModalAction,
      selectedResourcesAction: getSelectedResourcesAction,
    }
  )
)

export default enhance(SimpleOptions)
