import { EduButton, EduIf, notification } from '@edulastic/common'
import {
  assignmentPolicyOptions,
  roleuser,
  test as testConst,
  testTypes as testTypesConstants,
  assignmentSettingSections as sectionContants,
} from '@edulastic/constants'
import { themeColor } from '@edulastic/colors'
import { IconAssignment, IconTrash } from '@edulastic/icons'
import { Spin, Select, Icon, Tooltip } from 'antd'
import { get, isEmpty, keyBy, omit, pick } from 'lodash'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import * as Sentry from '@sentry/browser'
import { segmentApi } from '@edulastic/api'
import { AUDIO_RESPONSE } from '@edulastic/constants/const/questionType'
import { testContentVisibility } from '@edulastic/constants/const/test'
import { receiveClassListAction } from '../../../Classes/ducks'
import {
  getPlaylistSelector,
  receivePlaylistByIdAction,
} from '../../../PlaylistPage/ducks'
import {
  fetchGroupMembersAction,
  resetStudentAction,
  getActiveStudentsSelector,
} from '../../../sharedDucks/groups'
import ListHeader from '../../../src/components/common/ListHeader'
import {
  getUserOrgId,
  getUserRole,
  isFreeAdminSelector,
  isSAWithoutSchoolsSelector,
  getUserId,
  getUserFeatures,
} from '../../../src/selectors/user'
import {
  getSearchTermsFilterSelector,
  loadAssignmentsAction,
  saveAssignmentAction,
} from '../../../TestPage/components/Assign/ducks'
import {
  getDefaultTestSettingsAction,
  getTestSelector,
  getTestsLoadingSelector,
  getPenaltyOnUsingHintsSelector,
  receiveTestByIdAction,
  getCurrentSettingsIdSelector,
  fetchTestSettingsListAction,
  saveTestSettingsAction,
  getTestSettingsListSelector,
  setCurrentTestSettingsIdAction,
  getTestDefaultSettingsSelector,
  deleteTestSettingRequestAction,
  updateTestSettingRequestAction,
  getIsOverrideFreezeSelector,
  setTestSettingsListAction,
  getQuestionTypesInTestSelector,
  getIsAudioResponseQuestionEnabled,
} from '../../../TestPage/ducks'
import {
  clearAssignmentSettingsAction,
  fetchAssignmentsAction,
  getAssignmentsSelector,
  getClassListSelector,
  getTestEntitySelector,
  updateAssingnmentSettingsAction,
} from '../../duck'
import SimpleOptions from '../SimpleOptions/SimpleOptions'
import CommonStudentConfirmation from './ConfirmationModal'
import MultipleAssignConfirmation from './MultipleAssignConfirmation'
import {
  Anchor,
  AnchorLink,
  Container,
  FullFlexContainer,
  PaginationInfo,
  SavedSettingsContainer,
  DeleteIconContainer,
} from './styled'
import {
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
} from '../../../../student/Login/ducks'
import SaveSettingsModal from './SaveSettingsModal'
import DeleteTestSettingsModal from './DeleteSettingsConfirmationModal'
import UpdateTestSettingsModal from './UpdateTestSettingModal'
import { fetchCustomKeypadAction } from '../../../../assessment/components/KeyPadOptions/ducks'
import slice from '../../../CurriculumSequence/components/ManageContentBlock/ducks'
import QueryBuilder from '../../../AdvanceSearch/QueryBuilder'
import { SpinnerContainer } from '../../../src/MainStyle'
import { isAdvancedSearchLoadingSelector } from '../../../AdvanceSearch/ducks'

const { ASSESSMENT } = testTypesConstants.TEST_TYPES_VALUES_MAP
const {
  evalTypeLabels,
  TEST_SETTINGS_SAVE_LIMIT,
  testSettingsOptions,
  docBasedSettingsOptions,
  ATTEMPT_WINDOW_TYPE,
} = testConst

const parentMenu = {
  assignments: { title: 'Assignments', to: 'assignments' },
  playlistLibrary: { title: 'Playlist Library', to: 'playlists' },
  myPlaylist: { title: 'My playlist', to: 'myPlaylist' },
  testLibrary: { title: 'Test Library', to: 'tests' },
}

class AssignTest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isAdvancedView: props.userRole !== 'teacher',
      selectedDateOption: false,
      activeTab: '1',
      showSaveSettingsModal: false,
      showDeleteSettingModal: false,
      showUpdateSettingModal: false,
      settingDetails: null,
      showAdvanceSearchModal: false,
    }
  }

  componentDidMount() {
    const {
      fetchTestByID,
      loadClassList,
      fetchAssignments,
      assignments,
      match,
      userOrgId,
      isPlaylist,
      fetchPlaylistById,
      userRole,
      resetStudents,
      assignmentSettings = {},
      testSettings,
      getDefaultTestSettings,
      isFreeAdmin,
      isSAWithoutSchools,
      emailVerified,
      verificationTS,
      isDefaultDA,
      toggleAdminAlertModal,
      toggleVerifyEmailModal,
      history,
      fetchTestSettingsList,
      userId,
      userFeatures: { premium },
      fetchUserCustomKeypads,
      location,
      addRecommendedResourcesAction,
      setAssignments,
    } = this.props

    if (isSAWithoutSchools) {
      history.push('/author/tests')
      return toggleAdminAlertModal()
    }
    if (isFreeAdmin) {
      history.push('/author/reports')
      return toggleAdminAlertModal()
    }
    if (!emailVerified && verificationTS && !isDefaultDA) {
      const existingVerificationTS = new Date(verificationTS)
      const expiryDate = new Date(
        existingVerificationTS.setDate(existingVerificationTS.getDate() + 14)
      ).getTime()
      if (expiryDate < Date.now()) {
        history.push(userRole === 'teacher' ? '/' : '/author/items')
        return toggleVerifyEmailModal(true)
      }
    }
    resetStudents()

    const { testId } = match.params
    setAssignments([])
    loadClassList({
      districtId: userOrgId,
      search: {
        institutionIds: [],
        subjects: [],
        grades: [],
        active: [1],
      },
      page: 1,
      limit: 4000,
      includes: [
        'name',
        'studentCount',
        'subject',
        'grades',
        'termId',
        'type',
        'tags',
        'description',
        'owners',
        'primaryTeacherId',
        'parent',
        'institutionId',
      ],
    })

    if (premium) {
      fetchUserCustomKeypads()
      fetchTestSettingsList({
        orgId: userId,
        orgType: roleuser.ORG_TYPE.USER,
      })
    }

    const isAdmin =
      userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN

    if (isPlaylist) {
      // todo: We need to handle defaulting other settings in a better way
      const additionalSettings = {}
      // is admin assigning playlist module ?
      if (isAdmin && !match.params.testId) {
        additionalSettings.allowTeacherRedirect = true
      }
      fetchPlaylistById(match.params.playlistId)
      getDefaultTestSettings()
      this.updateAssignmentNew({
        startDate: moment(),
        endDate: moment().add('days', 7),
        playlistId: match.params.playlistId,
        playlistModuleId: match.params.moduleId,
        testVersionId: location?.state?.testVersionId,
        testId: match.params.testId,
        openPolicy: isAdmin
          ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
          : assignmentSettings.openPolicy ||
            assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE,
        closePolicy: isAdmin
          ? assignmentPolicyOptions.POLICY_CLOSE_MANUALLY_BY_ADMIN
          : assignmentSettings.closePolicy ||
            assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE,
        testType: isAdmin
          ? testTypesConstants.DEFAULT_ADMIN_TEST_TYPE_MAP[userRole]
          : ASSESSMENT,
        playerSkinType: testSettings.playerSkinType,
        attemptWindow: {
          type: ATTEMPT_WINDOW_TYPE.DEFAULT,
        },
        ...additionalSettings,
      })
      if (isEmpty(assignments) && testId) {
        fetchAssignments(testId)
      }
    } else {
      const premiumSettings = premium
        ? {
            restrictNavigationOut: testSettings.restrictNavigationOut,
            restrictNavigationOutAttemptsThreshold:
              testSettings.restrictNavigationOutAttemptsThreshold,
            blockSaveAndContinue: testSettings.blockSaveAndContinue,
            attemptWindow: {
              type: ATTEMPT_WINDOW_TYPE.DEFAULT,
            },
          }
        : {}
      this.updateAssignmentNew({
        testType: isAdmin
          ? testTypesConstants.DEFAULT_ADMIN_TEST_TYPE_MAP[userRole]
          : ASSESSMENT,
        openPolicy: isAdmin
          ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
          : assignmentSettings.openPolicy,
        playerSkinType: testSettings.playerSkinType,
        ...premiumSettings,
      })
      if (isEmpty(assignments) && testId) {
        fetchAssignments(testId)
      }
    }
    if (testId && isPlaylist) {
      fetchTestByID(testId, null, null, true, match.params.playlistId, {
        assigningNew: true,
      })
    } else if (testId) {
      fetchTestByID(testId, undefined, undefined, undefined, undefined, {
        assigningNew: true,
      })
    }

    const resourceIds = history.location?.state?.resourceIds || []
    if (testId && resourceIds) {
      addRecommendedResourcesAction({
        testId,
        resourceIds,
      })
    }
  }

  componentWillUnmount() {
    const {
      clearAssignmentSettings,
      setAssignments,
      setTestSettingsList,
    } = this.props
    clearAssignmentSettings()
    setAssignments([])
    setTestSettingsList([])
  }

  componentDidUpdate(prevProps) {
    const {
      testSettings: { playerSkinType, settingId },
      testSettingsList = [],
      userFeatures: { premium },
      setCurrentTestSettingsId,
    } = this.props
    const {
      testSettings: {
        playerSkinType: prevPlayerSkinType,
        settingId: prevSettingId,
      },
      testSettingsList: prevTestSettingsList,
    } = prevProps
    // the initial playerSkinType in reducer is edulastic,
    // but after fetching the test it can be other type like testlet
    // So need to update the assignmentSettings here
    if (playerSkinType !== prevPlayerSkinType) {
      this.updateAssignmentNew({ playerSkinType })
    }
    const isSettingsListFetchedNow =
      !prevTestSettingsList?.length && testSettingsList?.length

    if (
      premium &&
      (settingId != prevSettingId || isSettingsListFetchedNow) &&
      (testSettingsList?.some((t) => t._id === settingId) || !settingId)
    ) {
      setCurrentTestSettingsId(settingId || '')
    }
  }

  validateTimedAssignment = () => {
    const { assignmentSettings } = this.props
    const { allowedTime, timedAssignment } = assignmentSettings
    if (timedAssignment && allowedTime === 0) {
      notification({ messageKey: 'timedAssigmentTimeCanNotBeZero' })
      return false
    }
    return true
  }

  handleAssign = () => {
    const {
      saveAssignment,
      isAssigning,
      assignmentSettings: assignment,
      location,
      questionTypesInTest,
      enableAudioResponseQuestion,
      isPlaylist,
    } = this.props

    const isPlaylistModule = isPlaylist && !assignment?.testId
    if (!isPlaylistModule) {
      const containsAudioResponseTypeQuestion = questionTypesInTest.includes(
        AUDIO_RESPONSE
      )
      const audioResponseQuestionDisabledByDA = !enableAudioResponseQuestion
      const cannotAssignAudioResponseQuestion = [
        containsAudioResponseTypeQuestion,
        audioResponseQuestionDisabledByDA,
      ].every((o) => !!o)

      if (cannotAssignAudioResponseQuestion) {
        notification({ messageKey: 'testContainsAudioResponseTypeQuestion' })
        return
      }
    }
    const source = location?.state?.assessmentAssignedFrom
    const assessmentTestCategory = location?.state?.assessmentTestCategory

    let updatedAssignment = { ...assignment }
    const { changeDateSelection, selectedDateOption } = this.state
    if (!this.validateTimedAssignment()) return
    if (isAssigning) return
    if (isEmpty(assignment.class)) {
      notification({ messageKey: 'selectClass' })
      this.handleTabChange(sectionContants.CLASS_GROUP_SECTION)
    } else if (assignment.endDate < Date.now()) {
      notification({ messageKey: 'endDate' })
      this.handleTabChange(sectionContants.CLASS_GROUP_SECTION)
    } else if (changeDateSelection && assignment.dueDate > assignment.endDate) {
      notification({ messageKey: 'dueDateShouldNotBeGreaterThanEndDate' })
      this.handleTabChange(sectionContants.CLASS_GROUP_SECTION)
    } else {
      if (!selectedDateOption) {
        updatedAssignment = omit(updatedAssignment, ['dueDate'])
      }

      const isValid = this.validateSettings(updatedAssignment)
      if (isValid) {
        if (source) {
          segmentApi.genericEventTrack('AssessmentAssigned', {
            source,
            assessmentTestCategory,
          })
        }
        saveAssignment(updatedAssignment)
      }
    }
  }

  SwitchView = (checked) => {
    this.setState({ isAdvancedView: checked })
  }

  renderHeaderButton = (isAssigning, isAssignButtonDisabled) => (
    <Tooltip
      title={isAssignButtonDisabled ? 'Please select atleast 1 class.' : ''}
      placement="bottom"
    >
      <span>
        <EduButton
          isBlue
          data-cy="assignButton"
          onClick={this.handleAssign}
          loading={isAssigning}
          disabled={isAssignButtonDisabled}
        >
          {isAssigning ? 'ASSIGNING...' : 'ASSIGN'}
        </EduButton>
      </span>
    </Tooltip>
  )

  onClassFieldChange = (value, group) => {
    const { assignmentSettings: assignment } = this.props
    const groupById = keyBy(group, '_id')
    const previousGroupData = keyBy(assignment.class, '_id')
    const classData = value.map((_id) => {
      if (previousGroupData[_id]) {
        return previousGroupData[_id]
      }
      let canvasData = null
      if (get(groupById, `${_id}.canvasCode`, '')) {
        canvasData = {
          canvasCode: get(groupById, `${_id}.canvasCode`, ''),
          canvasCourseSectionCode: get(
            groupById,
            `${_id}.canvasCourseSectionCode`,
            ''
          ),
        }
      }
      return {
        _id,
        name: get(groupById, `${_id}.name`, ''),
        assignedCount: get(groupById, `${_id}.studentCount`, 0),
        grade: get(groupById, `${_id}.grades`, ''),
        subject: get(groupById, `${_id}.subject`, ''),
        ...(canvasData ? { canvasData } : {}),
      }
    })

    let termId = ''
    if (value?.length) {
      const [initialClassId] = value
      termId = groupById[initialClassId]?.termId
      if (!termId) {
        // Missing termId notify
        Sentry.captureException(
          new Error('[Assignments] missing termId in assigned assignment.')
        )
        Sentry.withScope((scope) => {
          scope.setExtra('groupDetails', { group, value })
        })
      }
    }
    return {
      classData,
      termId,
    }
  }

  updateAssignmentNew = (newSettings) => {
    const { updateAssignmentSettings } = this.props
    updateAssignmentSettings(newSettings)
  }

  changeDateSelection = (e) => {
    const { value } = e.target
    this.setState({ selectedDateOption: value }, () => {
      const { assignmentSettings: assignment } = this.props
      let dueDate = ''
      if (value) {
        dueDate = assignment.endDate
      }
      this.updateAssignmentNew({
        ...assignment,
        dueDate,
      })
    })
  }

  handleTabChange = (key) => {
    this.setState({ activeTab: key })
  }

  handleSettingsSelection = (value) => {
    const {
      setCurrentTestSettingsId,
      updateAssignmentSettings,
      testSettingsList,
      assignmentSettings,
      testDefaultSettings,
      testSettings,
      currentSettingsId,
      isFreezeSettingsOn,
      totalItems,
      userRole,
    } = this.props
    if (value === 'save-settings-option') {
      if (currentSettingsId === '')
        this.setState({ showSaveSettingsModal: true })
      else {
        const { _id, title } =
          testSettingsList.find((t) => t._id === currentSettingsId) || {}
        this.setState({
          showUpdateSettingModal: true,
          settingDetails: {
            _id,
            title,
          },
        })
      }
    } else {
      let newSettings = {}
      const [
        commonAssessment,
        schoolCommonAssessment,
      ] = testTypesConstants.TEST_TYPES.COMMON
      if (value === '') {
        newSettings = {
          ...pick(testSettings, testSettingsOptions),
          ...testDefaultSettings,
          autoRedirect: !!testDefaultSettings.autoRedirect,
          testContentVisibility:
            testDefaultSettings.testContentVisibility ||
            testContentVisibility.ALWAYS,
        }
      } else {
        if (isFreezeSettingsOn) {
          return notification({
            msg:
              'Test has freeze settings on, you cannot apply other saved settings.',
          })
        }
        const selectedSetting = testSettingsList.find((t) => t._id === value)
        newSettings = {
          ...assignmentSettings,
          ...pick(
            selectedSetting,
            testSettings.isDocBased
              ? docBasedSettingsOptions
              : testSettingsOptions
          ),
          autoRedirect: !!selectedSetting.autoRedirect,
        }
      }
      if (newSettings.timedAssignment && !newSettings.allowedTime) {
        newSettings.allowedTime = totalItems * 60 * 1000
      } else if (!newSettings.timedAssignment) {
        newSettings.allowedTime = 0
      }
      if (userRole === roleuser.TEACHER && newSettings.testContentVisibility) {
        delete newSettings.testContentVisibility
      }
      // Below if block is to sanitize any legacy settings template for School Admins
      if (
        userRole === roleuser.SCHOOL_ADMIN &&
        newSettings.testType === commonAssessment
      ) {
        newSettings.testType = schoolCommonAssessment
      }
      /**
       *  Test instruction are not available on assign page so avoid sending them in assignment settings from FE,
       *  BE handles setting instructions from test settings to assignment settings
       * */
      delete newSettings.hasInstruction
      delete newSettings.instruction
      delete newSettings.preventSectionNavigation

      setCurrentTestSettingsId(value)
      updateAssignmentSettings(newSettings)
    }
  }

  toggleSaveSettingsModal = (value) => {
    this.setState({ showSaveSettingsModal: value })
  }

  validateSettings = (entity) => {
    const { isEnabledRefMaterial, hasPenaltyOnUsingHints } = this.props
    const { showHintsToStudents = true, penaltyOnUsingHints = 0 } = entity
    let isValid = true
    if (
      ![
        evalTypeLabels.PARTIAL_CREDIT,
        evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT,
      ].includes(entity.scoringType)
    ) {
      entity.applyEBSR = false
    }
    if (entity.scoringType === evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT) {
      entity.scoringType = evalTypeLabels.PARTIAL_CREDIT
      entity.penalty = false
    }
    if (
      entity.passwordPolicy !==
      testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
    ) {
      delete entity.passwordExpireIn
    }
    if (
      entity.passwordPolicy &&
      entity.passwordPolicy !==
        testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC
    ) {
      delete entity.assignmentPassword
    }
    if (!entity.autoRedirect) {
      delete entity.autoRedirectSettings
    }
    if (!entity.safeBrowser) {
      delete entity.sebPassword
    }
    if (entity.safeBrowser && !entity.sebPassword) {
      notification({ msg: 'Please enter safe exam browser password' })
      isValid = false
    } else if (
      entity.passwordPolicy ===
        testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC &&
      (!entity.assignmentPassword ||
        (entity.assignmentPassword &&
          (entity?.assignmentPassword?.length < 6 ||
            entity?.assignmentPassword?.length > 25)))
    ) {
      notification({ messageKey: 'enterValidPassword' })
      this.handleTabChange(sectionContants.ANTI_CHEATING_SECTION)
      isValid = false
    } else if (entity.autoRedirect === true) {
      if (!entity.autoRedirectSettings.showPreviousAttempt) {
        this.handleTabChange(sectionContants.AUTO_REDIRECT_SECTION)
        notification({
          type: 'warn',
          msg: 'Please set the value for Show Previous Attempt',
        })
        isValid = false
      } else if (!entity.autoRedirectSettings.questionsDelivery) {
        this.handleTabChange(sectionContants.AUTO_REDIRECT_SECTION)
        notification({
          type: 'warn',
          msg: 'Please set the value for Question Delivery',
        })
        isValid = false
      } else if (!entity.autoRedirectSettings.scoreThreshold) {
        this.handleTabChange(sectionContants.AUTO_REDIRECT_SECTION)
        notification({
          type: 'warn',
          msg: 'Please set Score Threshold value',
        })
        isValid = false
      } else if (!entity.autoRedirectSettings.maxRedirects) {
        this.handleTabChange(sectionContants.AUTO_REDIRECT_SECTION)
        notification({
          type: 'warn',
          msg: 'Please set value of Max Attempts Allowed for auto redirect',
        })
        isValid = false
      }
    } else if (isEnabledRefMaterial && isEmpty(entity.referenceDocAttributes)) {
      this.handleTabChange(sectionContants.TEST_BEHAVIOR_SECTION)
      notification({
        type: 'warn',
        messageKey: 'uploadReferenceMaterial',
      })
      isValid = false
    } else if (
      showHintsToStudents &&
      hasPenaltyOnUsingHints &&
      (Number.isNaN(penaltyOnUsingHints) || !penaltyOnUsingHints > 0)
    ) {
      this.handleTabChange(sectionContants.TEST_BEHAVIOR_SECTION)
      notification({
        type: 'warn',
        messageKey: 'enterPenaltyOnHintsValue',
      })
      isValid = false
    }
    return isValid
  }

  getCurrentSettings = (title) => {
    const { testSettings, assignmentSettings, userId } = this.props
    const obj = pick(
      {
        ...testSettings,
        ...assignmentSettings,
      },
      testSettingsOptions
    )
    const settings = {
      ...obj,
      orgId: userId,
      orgType: roleuser.ORG_TYPE.USER,
      title,
    }
    const isValid = this.validateSettings(settings)
    if (isValid) return settings
    return false
  }

  handleSaveTestSetting = (settingName) => {
    const { saveTestSettings, isFreezeSettingsOn } = this.props
    const data = this.getCurrentSettings(settingName)
    if (data) saveTestSettings({ data, switchSetting: !isFreezeSettingsOn })
    this.toggleSaveSettingsModal(false)
  }

  handleDeleteSettings = (value) => {
    if (value) {
      const { deleteTestSettingRequest, currentSettingsId } = this.props
      const { settingDetails } = this.state
      deleteTestSettingRequest(settingDetails._id)
      if (settingDetails._id === currentSettingsId)
        this.handleSettingsSelection('')
    }
    this.setState({ showDeleteSettingModal: false })
  }

  handleUpdateSettings = (value) => {
    if (!value) {
      const { testSettingsList } = this.props
      this.setState({
        showUpdateSettingModal: false,
        showSaveSettingsModal:
          testSettingsList.length < TEST_SETTINGS_SAVE_LIMIT,
      })
    } else {
      const {
        updateTestSettingRequest,
        testSettingsList,
        currentSettingsId,
        assignmentSettings,
        userId,
      } = this.props
      const currentSetting =
        testSettingsList.find((t) => t._id === currentSettingsId) || {}
      const obj = pick(
        {
          ...currentSetting,
          ...assignmentSettings,
        },
        testSettingsOptions
      )
      const settings = {
        ...obj,
        orgId: userId,
        orgType: roleuser.ORG_TYPE.USER,
        title: currentSetting.title,
        testSettingId: currentSettingsId,
      }
      const isValid = this.validateSettings(settings)
      if (isValid) updateTestSettingRequest(settings)
      this.setState({
        showUpdateSettingModal: false,
      })
    }
  }

  handleMouseOver = (e) => {
    e.currentTarget.querySelector('.delete-setting-button').style.display =
      'flex'
  }

  handleMouseOut = (e) => {
    e.currentTarget.querySelector('.delete-setting-button').style.display =
      'none'
  }

  setShowAdvanceSearchModal = (value) => {
    this.setState({ showAdvanceSearchModal: value })
  }

  render() {
    const {
      isAdvancedView,
      selectedDateOption,
      activeTab,
      showSaveSettingsModal,
      showDeleteSettingModal,
      settingDetails,
      showUpdateSettingModal,
      showAdvanceSearchModal,
    } = this.state
    const {
      assignmentSettings: assignment,
      isTestLoading,
      match,
      isAssigning,
    } = this.props
    const {
      classList,
      fetchStudents,
      students,
      testSettings,
      testItem,
      isPlaylist,
      playlist,
      from,
      location,
      defaultTestProfiles = {},
      currentSettingsId,
      testSettingsList,
      userFeatures: { premium },
      isAdvancedSearchLoading,
    } = this.props
    const { title, _id } = isPlaylist ? playlist : testItem
    const exactMenu = parentMenu[location?.state?.from || from]
      ? { ...parentMenu[location?.state?.from || from] }
      : {}
    if (parentMenu[location?.state?.from || from]?.to === 'myPlaylist') {
      exactMenu.to = _id
        ? `playlists/playlist/${_id}/use-this`
        : location?.state?.toUrl
    }

    const moduleId = match.params.moduleId
    const _module = playlist.modules?.find((m) => m?._id === moduleId)
    const moduleTitle = _module?.title || ''
    const isTestSettingSaveLimitReached =
      testSettingsList.length >= TEST_SETTINGS_SAVE_LIMIT

    return (
      <div>
        <EduIf condition={isAdvancedSearchLoading}>
          <SpinnerContainer>
            <Spin />
          </SpinnerContainer>
        </EduIf>
        <CommonStudentConfirmation assignment={assignment} />
        <MultipleAssignConfirmation
          assignment={assignment}
          isPlaylist={isPlaylist}
          moduleTitle={moduleTitle}
        />
        {showSaveSettingsModal && (
          <SaveSettingsModal
            visible={showSaveSettingsModal}
            toggleModal={this.toggleSaveSettingsModal}
            handleSave={this.handleSaveTestSetting}
          />
        )}

        <DeleteTestSettingsModal
          visible={showDeleteSettingModal}
          settingDetails={settingDetails}
          handleResponse={this.handleDeleteSettings}
        />

        <UpdateTestSettingsModal
          visible={showUpdateSettingModal}
          settingDetails={settingDetails}
          handleResponse={this.handleUpdateSettings}
          disableSaveNew={isTestSettingSaveLimitReached}
          closeModal={() => {
            this.setState({ showUpdateSettingModal: false })
          }}
        />

        <ListHeader
          title={`Assign ${moduleTitle || title || ''}`}
          midTitle="Assignment Settings"
          titleIcon={IconAssignment}
          btnTitle="ASSIGN"
          renderButton={this.renderHeaderButton}
          isLoadingButtonState={isAssigning}
          isAssignButtonDisabled={isEmpty(assignment.class)}
        />

        <Container>
          <FullFlexContainer justifyContent="space-between" alignItems="center">
            <PaginationInfo>
              &lt;{' '}
              <AnchorLink to={`/author/${exactMenu?.to}`}>
                {exactMenu?.title}
              </AnchorLink>
              {!isTestLoading && (
                <>
                  &nbsp;/&nbsp;
                  <AnchorLink
                    to={`/author/${
                      isPlaylist ? 'playlists' : 'tests'
                    }/${_id}#review`}
                  >
                    {title}
                  </AnchorLink>
                </>
              )}
              &nbsp;/&nbsp;
              <Anchor>Assign</Anchor>
            </PaginationInfo>
            <EduIf condition={showAdvanceSearchModal}>
              <QueryBuilder
                showAdvanceSearch={showAdvanceSearchModal}
                setShowAdvanceSearchModal={this.setShowAdvanceSearchModal}
              />
            </EduIf>
            {/* TODO there are some scenarios we have both simple and advance view which is yet be decided */}
            <EduIf condition={premium}>
              <SavedSettingsContainer>
                <div>SAVED SETTINGS</div>
                <Select
                  value={currentSettingsId}
                  getPopupContainer={(node) => node.parentNode}
                  onChange={this.handleSettingsSelection}
                  optionLabelProp="label"
                  data-cy="select-save-test-settings"
                >
                  <Select.Option key="1" value="" label="DEFAULT TEST SETTINGS">
                    DEFAULT TEST SETTINGS
                  </Select.Option>
                  {testSettingsList.map((t) => (
                    <Select.Option key={t._id} value={t._id} label={t.title}>
                      <span
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}
                        onFocus={() => {}}
                        onBlur={() => {}}
                      >
                        {t.title}{' '}
                        <DeleteIconContainer
                          className="delete-setting-button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            this.setState({
                              showDeleteSettingModal: true,
                              settingDetails: {
                                _id: t._id,
                                title: t.title,
                              },
                            })
                          }}
                          title="Remove Setting"
                        >
                          <IconTrash color={themeColor} />
                        </DeleteIconContainer>
                      </span>
                    </Select.Option>
                  ))}
                  <Select.Option
                    key="2"
                    value="save-settings-option"
                    label="SAVE CURRENT SETTING"
                    disabled={
                      isTestSettingSaveLimitReached && !currentSettingsId
                    }
                    title={
                      isTestSettingSaveLimitReached && !currentSettingsId
                        ? 'Maximum limit reached. Please delete existing one to add new.'
                        : ''
                    }
                    className="save-settings-option"
                  >
                    <span>
                      <Icon type="save" theme="filled" />
                      SAVE CURRENT SETTING
                    </span>
                  </Select.Option>
                </Select>
              </SavedSettingsContainer>
            </EduIf>
          </FullFlexContainer>
          {isTestLoading ? (
            <div style={{ height: '70vh' }}>
              <Spin />
            </div>
          ) : (
            <SimpleOptions
              group={classList}
              students={students}
              assignment={assignment}
              fetchStudents={fetchStudents}
              testSettings={testSettings}
              updateOptions={this.updateAssignmentNew}
              onClassFieldChange={this.onClassFieldChange}
              changeDateSelection={this.changeDateSelection}
              selectedDateOption={selectedDateOption}
              isAssignRecommendations={false}
              match={match}
              isAdvancedView={isAdvancedView}
              defaultTestProfiles={defaultTestProfiles}
              activeTab={activeTab}
              handleTabChange={this.handleTabChange}
              showAssignModuleContent={
                match?.params?.playlistId && !match?.params?.testId
              }
              isAssigning={isAssigning}
              isPlaylist={isPlaylist}
              setShowAdvanceSearchModal={this.setShowAdvanceSearchModal}
            />
          )}
        </Container>
      </div>
    )
  }
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      classList: getClassListSelector(state),
      assignments: getAssignmentsSelector(state),
      students: getActiveStudentsSelector(state),
      testSettings: getTestEntitySelector(state),
      userOrgId: getUserOrgId(state),
      playlist: getPlaylistSelector(state),
      testItem: getTestSelector(state),
      userRole: getUserRole(state),
      isAssigning: state.authorTestAssignments.isAssigning,
      assignmentSettings: state.assignmentSettings,
      isTestLoading: getTestsLoadingSelector(state),
      isFreeAdmin: isFreeAdminSelector(state),
      emailVerified: getEmailVerified(state),
      verificationTS: getVerificationTS(state),
      isDefaultDA: isDefaultDASelector(state),
      isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
      currentSettingsId: getCurrentSettingsIdSelector(state),
      userId: getUserId(state),
      testSettingsList: getTestSettingsListSelector(state),
      testDefaultSettings: getTestDefaultSettingsSelector(state),
      userFeatures: getUserFeatures(state),
      isFreezeSettingsOn: getIsOverrideFreezeSelector(state),
      totalItems: state?.tests?.entity?.isDocBased
        ? state?.tests?.entity?.summary?.totalQuestions
        : state?.tests?.entity?.summary?.totalItems,
      searchTerms: getSearchTermsFilterSelector(state),
      hasPenaltyOnUsingHints: getPenaltyOnUsingHintsSelector(state),
      isAdvancedSearchLoading: isAdvancedSearchLoadingSelector(state),
      questionTypesInTest: getQuestionTypesInTestSelector(state),
      enableAudioResponseQuestion: getIsAudioResponseQuestionEnabled(state),
    }),
    {
      loadClassList: receiveClassListAction,
      fetchStudents: fetchGroupMembersAction,
      fetchAssignments: fetchAssignmentsAction,
      setAssignments: loadAssignmentsAction,
      saveAssignment: saveAssignmentAction,
      fetchPlaylistById: receivePlaylistByIdAction,
      fetchTestByID: receiveTestByIdAction,
      getDefaultTestSettings: getDefaultTestSettingsAction,
      resetStudents: resetStudentAction,
      updateAssignmentSettings: updateAssingnmentSettingsAction,
      clearAssignmentSettings: clearAssignmentSettingsAction,
      toggleAdminAlertModal: toggleAdminAlertModalAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
      fetchTestSettingsList: fetchTestSettingsListAction,
      saveTestSettings: saveTestSettingsAction,
      setCurrentTestSettingsId: setCurrentTestSettingsIdAction,
      deleteTestSettingRequest: deleteTestSettingRequestAction,
      updateTestSettingRequest: updateTestSettingRequestAction,
      fetchUserCustomKeypads: fetchCustomKeypadAction,
      addRecommendedResourcesAction:
        slice.actions?.fetchRecommendedResourcesAction,
      setTestSettingsList: setTestSettingsListAction,
    }
  )
)
export default enhance(AssignTest)

AssignTest.propTypes = {
  match: PropTypes.object.isRequired,
  fetchStudents: PropTypes.func.isRequired,
  fetchAssignments: PropTypes.func.isRequired,
  classList: PropTypes.array.isRequired,
  students: PropTypes.array.isRequired,
  testSettings: PropTypes.object.isRequired,
  assignments: PropTypes.array.isRequired,
  saveAssignment: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
  testItem: PropTypes.object.isRequired,
  fetchTestByID: PropTypes.func.isRequired,
}
