import { notification } from '@edulastic/common'
import {
  assignmentPolicyOptions,
  assignmentSettingSections as sectionContants,
  roleuser,
  test as testConst,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { STUDENT_ATTEMPT_TIME_WINDOW } from '@edulastic/constants/const/common'
import { Spin, Tabs } from 'antd'
import produce from 'immer'
import { curry, get, isBoolean, keyBy, pick } from 'lodash'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { DEFAULT_TEST_TYPES_BY_USER_ROLES } from '@edulastic/constants/const/testTypes'
import { multiFind } from '../../../../common/utils/main'
import {
  getAvailableTestTypesForUser,
  getProfileKey,
} from '../../../../common/utils/testTypeUtils'
import { isFeatureAccessible } from '../../../../features/components/FeaturesSwitch'
import { getUserFeatures } from '../../../../student/Login/ducks'
import { getRecommendedResources } from '../../../CurriculumSequence/components/ManageContentBlock/ducks'
import { setEmbeddedVideoPreviewModal as setEmbeddedVideoPreviewModalAction } from '../../../CurriculumSequence/ducks'
import { setShowClassCreationModalAction } from '../../../Dashboard/ducks'
import { setCreateClassTypeDetailsAction } from '../../../ManageClass/ducks'
import { SpinnerContainer } from '../../../src/MainStyle'
import {
  getCollectionsSelector,
  getUserRole,
  allowReferenceMaterialSelector,
  getIsAiEvaulationDistrictSelector,
  getUserId,
} from '../../../src/selectors/user'
import selectsData from '../../../TestPage/components/common/selectsData'
import {
  canSchoolAdminUseDistrictCommonSelector,
  getDisableAnswerOnPaperSelector,
  getIsOverrideFreezeSelector,
  getReleaseScorePremiumSelector,
  togglePenaltyOnUsingHintsAction,
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
      features?.assessmentSuperPowersReleaseScorePremium ||
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
      group,
      fetchStudents,
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
    if (group?.length === 1) {
      this.onChange('class', [group[0]._id])
      fetchStudents({ classId: group[0]._id })
    }
  }

  componentDidUpdate(prevProps) {
    const {
      group,
      fetchStudents,
      assignment,
      testSettings,
      userRole,
      features,
      freezeSettings,
      canSchoolAdminUseDistrictCommon,
    } = this.props
    const { testType = testSettings.testType } = assignment
    // no class available yet in assign module flow initial render
    if (group?.length === 1 && prevProps.group?.length === 0) {
      this.onChange('class', [group[0]._id])
      fetchStudents({ classId: group[0]._id })
    }

    // If the user is allowed to edit the test type, check if they have the permission
    // to assign test type added originally by the test author.
    // If don't, change the test type to the highest permitted type.
    if (
      !freezeSettings &&
      testType &&
      userRole &&
      testTypesConstants.TEST_TYPES.COMMON.includes(testType)
    ) {
      const availableTestTypes = getAvailableTestTypesForUser({
        isPremium: features?.premium,
        role: userRole,
        canSchoolAdminUseDistrictCommon,
      })

      if (!availableTestTypes[testType]) {
        this.onChange('testType', DEFAULT_TEST_TYPES_BY_USER_ROLES[userRole])
      }
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

  onTabChange = (value) => {
    const { freezeSettings, handleTabChange } = this.props
    if (freezeSettings && value !== sectionContants.CLASS_GROUP_SECTION) {
      notification({ type: 'warn', messageKey: 'overrrideSettingsRestricted' })
    }
    handleTabChange(value)
  }

  onChange = (field, value) => {
    const {
      onClassFieldChange,
      group,
      updateOptions,
      isReleaseScorePremium,
      userRole,
      features: { free, premium },
      defaultTestTypeProfiles,
      performanceBands,
      standardsProficiencies,
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
        restrictNavigationOut: null,
        restrictNavigationOutAttemptsThreshold: 0,
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
            testTypesConstants.TEST_TYPES.ASSESSMENT.includes(value) ||
            testTypesConstants.TEST_TYPES.COMMON.includes(value)
          ) {
            state.releaseScore =
              testTypesConstants.TEST_TYPES.ASSESSMENT.includes(value) &&
              isReleaseScorePremium
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
          state.performanceBand = pick(
            multiFind(
              performanceBands,
              [
                {
                  _id:
                    defaultTestTypeProfiles.performanceBand[
                      getProfileKey(value)
                    ],
                },
              ],
              state.performanceBand
            ),
            ['_id', 'name']
          )
          state.standardGradingScale = pick(
            multiFind(
              standardsProficiencies,
              [
                {
                  _id:
                    defaultTestTypeProfiles.standardProficiency[
                      getProfileKey(value)
                    ],
                },
              ],
              state.standardGradingScale
            ),
            ['_id', 'name']
          )
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
        case STUDENT_ATTEMPT_TIME_WINDOW: {
          state.attemptWindow = value
          break
        }
        // no default
      }

      // Settings OverrideSettings method has similar condition
      if (field === 'scoringType') {
        state.penalty = value === evalTypeLabels.PARTIAL_CREDIT
      }
      if (
        field === 'showHintsToStudents' &&
        value === false &&
        state.penaltyOnUsingHints > 0
      ) {
        state.penaltyOnUsingHints = 0
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
      selectedStandardsCount,
      showAssignModuleContent,
      recommendedResources,
      setEmbeddedVideoPreviewModal,
      history,
      isVideoResourcePreviewModal,
      selectedResourcesAction,
      orgCollections,
      isAssigning,
      isPlaylist,
      allowReferenceMaterial,
      setShowClassCreationModal,
      setCreateClassTypeDetails,
      togglePenaltyOnUsingHints,
      setShowAdvanceSearchModal,
      isAiEvaulationDistrict,
      districtTestSettings,
      userId,
    } = this.props

    const { collections } = testSettings
    const { canUseImmersiveReader = false } = features

    const sparkMathId = orgCollections?.find(
      (x) => x.name.toLowerCase() === 'spark math'
    )?._id

    const isTestHasSparkMathCollection = collections?.some(
      (x) => x._id === sparkMathId
    )
    const resourceIds = history.location?.state?.resourceIds || []
    const showRecommendedResources =
      (history.location?.state?.isSparkMathCollection ||
        isTestHasSparkMathCollection) &&
      !isAssignRecommendations

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

    const createClassHandler = () => {
      setShowClassCreationModal(true)
      setCreateClassTypeDetails({
        type: 'class',
        testTitle: testSettings?.title,
        testRedirectUrl: match?.url,
      })
    }

    return (
      <OptionConationer isAdvancedView={isAdvancedView} ref={this.containerRef}>
        {isAssigning && (
          <SpinnerContainer>
            <Spin />
          </SpinnerContainer>
        )}
        <Tabs activeKey={activeTab} onChange={this.onTabChange}>
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
                  recommendedResources={recommendedResources}
                  setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                  resourceIds={resourceIds}
                  isVideoResourcePreviewModal={isVideoResourcePreviewModal}
                  showRecommendedResources={showRecommendedResources}
                  selectedResourcesAction={selectedResourcesAction}
                  isPlaylist={isPlaylist}
                  setShowAdvanceSearchModal={setShowAdvanceSearchModal}
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
                  createClassHandler={createClassHandler}
                  isPremiumUser={features?.premium}
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
                overRideSettings={this.overRideSettings}
                match={match}
                totalItems={totalItems}
                userRole={userRole}
                actionOnFeatureInaccessible={actionOnFeatureInaccessible}
                featuresAvailable={featuresAvailable}
                tootltipWidth={tootltipWidth}
                showAssignModuleContent={showAssignModuleContent}
                allowReferenceMaterial={allowReferenceMaterial}
                allowToUseShowHintsToStudents={features?.showHintsToStudents}
                togglePenaltyOnUsingHints={togglePenaltyOnUsingHints}
                isAiEvaulationDistrict={isAiEvaulationDistrict}
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
                canUseImmersiveReader={canUseImmersiveReader}
                districtTestSettings={districtTestSettings}
                userId={userId}
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
  selectedResourcesAction: PropTypes.func,
}

SimpleOptions.defaultProps = {
  group: [],
  students: [],
  fetchStudents: () => false,
  isRecommendingStandards: false,
  setEmbeddedVideoPreviewModal: () => {},
  selectedResourcesAction: () => {},
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      userRole: getUserRole(state),
      userId: getUserId(state),
      features: getUserFeatures(state),
      isReleaseScorePremium: getReleaseScorePremiumSelector(state),
      freezeSettings: getIsOverrideFreezeSelector(state),
      disableAnswerOnPaper: getDisableAnswerOnPaperSelector(state),
      recommendedResources: getRecommendedResources(state),
      allowReferenceMaterial: allowReferenceMaterialSelector(state),
      orgCollections: getCollectionsSelector(state),
      isVideoResourcePreviewModal:
        state.curriculumSequence?.isVideoResourcePreviewModal,
      totalItems: state?.tests?.entity?.isDocBased
        ? state?.tests?.entity?.summary?.totalQuestions
        : state?.tests?.entity?.summary?.totalItems,
      defaultTestTypeProfiles: get(state, 'tests.defaultTestTypeProfiles', {}),
      performanceBands: get(state, 'performanceBandReducer.profiles', []),
      standardsProficiencies: get(
        state,
        'standardsProficiencyReducer.data',
        []
      ),
      isAiEvaulationDistrict: getIsAiEvaulationDistrictSelector(state),
      canSchoolAdminUseDistrictCommon: canSchoolAdminUseDistrictCommonSelector(
        state
      ),
    }),
    {
      setEmbeddedVideoPreviewModal: setEmbeddedVideoPreviewModalAction,
      selectedResourcesAction: getSelectedResourcesAction,
      setShowClassCreationModal: setShowClassCreationModalAction,
      setCreateClassTypeDetails: setCreateClassTypeDetailsAction,
      togglePenaltyOnUsingHints: togglePenaltyOnUsingHintsAction,
    }
  )
)

export default enhance(SimpleOptions)
