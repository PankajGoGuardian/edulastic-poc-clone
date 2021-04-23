import { EduButton, notification } from '@edulastic/common'
import {
  assignmentPolicyOptions,
  roleuser,
  test as testConst,
  assignmentSettingSections as sectionContants,
} from '@edulastic/constants'
import { themeColor } from '@edulastic/colors'
import { IconAssignment, IconTrash } from '@edulastic/icons'
import { Spin, Select, Icon } from 'antd'
import { get, isEmpty, keyBy, omit, pick } from 'lodash'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
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
  getUserId,
  getUserFeatures,
} from '../../../src/selectors/user'
import {
  loadAssignmentsAction,
  saveAssignmentAction,
} from '../../../TestPage/components/Assign/ducks'
import {
  getDefaultTestSettingsAction,
  getTestSelector,
  getTestsLoadingSelector,
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
import { toggleFreeAdminSubscriptionModalAction } from '../../../../student/Login/ducks'
import SaveSettingsModal from './SaveSettingsModal'
import DeleteTestSettingsModal from './DeleteSettingsConfirmationModal'
import UpdateTestSettingsModal from './UpdateTestSettingModal'
import { fetchCustomKeypadAction } from '../../../../assessment/components/KeyPadOptions/ducks'

const { ASSESSMENT, COMMON } = testConst.type
const { evalTypeLabels } = testConst

const parentMenu = {
  assignments: { title: 'Assignments', to: 'assignments' },
  playlistLibrary: { title: 'Playlist Library', to: 'playlists' },
  myPlaylist: { title: 'My playlist', to: 'myPlaylist' },
  testLibrary: { title: 'Test Library', to: 'tests' },
}

const testSettingsOptions = [
  'partialScore',
  'timer',
  'testType',
  'hasInstruction',
  'instruction',
  'releaseScore',
  'scoringType',
  'penalty',
  'markAsDone',
  'calcType',
  'timedAssignment',
  'pauseAllowed',
  'maxAttempts',
  'maxAnswerChecks',
  'safeBrowser',
  'shuffleQuestions',
  'shuffleAnswers',
  'sebPassword',
  'blockNavigationToAnsweredQuestions',
  'restrictNavigationOut',
  'restrictNavigationOutAttemptsThreshold',
  'blockSaveAndContinue',
  'passwordPolicy',
  'assignmentPassword',
  'passwordExpireIn',
  'answerOnPaper',
  'playerSkinType',
  'standardGradingScale',
  'performanceBand',
  'showMagnifier',
  'enableScratchpad',
  'autoRedirect',
  'autoRedirectSettings',
  'keypad',
]

const docBasedSettingsOptions = [
  'partialScore',
  'timer',
  'testType',
  'hasInstruction',
  'instruction',
  'releaseScore',
  'scoringType',
  'penalty',
  'markAsDone',
  'calcType',
  'timedAssignment',
  'pauseAllowed',
  'maxAttempts',
  'safeBrowser',
  'sebPassword',
  'restrictNavigationOut',
  'restrictNavigationOutAttemptsThreshold',
  'blockSaveAndContinue',
  'passwordPolicy',
  'assignmentPassword',
  'passwordExpireIn',
  'answerOnPaper',
  'standardGradingScale',
  'performanceBand',
  'autoRedirect',
  'autoRedirectSettings',
]

const TEST_SETTINGS_SAVE_LIMIT = 20

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
      toggleFreeAdminSubscriptionModal,
      history,
      fetchTestSettingsList,
      userId,
      userFeatures: { premium },
      fetchUserCustomKeypads,
      setCurrentTestSettingsId,
    } = this.props

    if (isFreeAdmin) {
      history.push('/author/reports')
      return toggleFreeAdminSubscriptionModal()
    }

    resetStudents()

    const { testId } = match.params
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
    })

    if (premium) {
      fetchUserCustomKeypads()
      fetchTestSettingsList({
        orgId: userId,
        orgType: roleuser.ORG_TYPE.USER,
      })
      setCurrentTestSettingsId('')
    }

    const isAdmin =
      userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN

    if (isPlaylist) {
      fetchPlaylistById(match.params.playlistId)
      getDefaultTestSettings()
      this.updateAssignmentNew({
        startDate: moment(),
        endDate: moment().add('days', 7),
        dueDate: moment().add('days', 7),
        playlistId: match.params.playlistId,
        playlistModuleId: match.params.moduleId,
        testId: match.params.testId,
        openPolicy: isAdmin
          ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
          : assignmentSettings.openPolicy ||
            assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE,
        closePolicy: isAdmin
          ? assignmentPolicyOptions.POLICY_CLOSE_MANUALLY_BY_ADMIN
          : assignmentSettings.closePolicy ||
            assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE,
        testType: isAdmin ? COMMON : ASSESSMENT,
        playerSkinType: testSettings.playerSkinType,
      })
    } else {
      const premiumSettings = premium
        ? {
            restrictNavigationOut: testSettings.restrictNavigationOut,
            restrictNavigationOutAttemptsThreshold:
              testSettings.restrictNavigationOutAttemptsThreshold,
            blockSaveAndContinue: testSettings.blockSaveAndContinue,
          }
        : {}
      this.updateAssignmentNew({
        testType: isAdmin ? COMMON : ASSESSMENT,
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
      fetchTestByID(testId, null, null, true, match.params.playlistId)
    } else if (testId) {
      fetchTestByID(testId)
    }
  }

  componentWillUnmount() {
    const { clearAssignmentSettings, setAssignments } = this.props
    clearAssignmentSettings()
    setAssignments([])
  }

  componentDidUpdate(prevProps) {
    const {
      testSettings: { playerSkinType },
    } = this.props
    const {
      testSettings: { playerSkinType: prevPlayerSkinType },
    } = prevProps
    // the initial playerSkinType in reducer is edulastic,
    // but after fetching the test it can be other type like testlet
    // So need to update the assignmentSettings here
    if (playerSkinType !== prevPlayerSkinType) {
      this.updateAssignmentNew({ playerSkinType })
    }
  }

  handleAssign = () => {
    const {
      saveAssignment,
      isAssigning,
      assignmentSettings: assignment,
    } = this.props
    let updatedAssignment = { ...assignment }
    const { changeDateSelection, selectedDateOption } = this.state
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
      if (isValid) saveAssignment(updatedAssignment)
    }
  }

  SwitchView = (checked) => {
    this.setState({ isAdvancedView: checked })
  }

  renderHeaderButton = () => {
    const { isAssigning } = this.props
    return (
      <EduButton
        isBlue
        data-cy="assignButton"
        onClick={this.handleAssign}
        disabled={isAssigning}
      >
        ASSIGN
      </EduButton>
    )
  }

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
      if (value === '') {
        newSettings = {
          ...pick(testSettings, testSettingsOptions),
          ...testDefaultSettings,
          autoRedirect: !!testDefaultSettings.autoRedirect,
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
      setCurrentTestSettingsId(value)
      updateAssignmentSettings(newSettings)
    }
  }

  toggleSaveSettingsModal = (value) => {
    this.setState({ showSaveSettingsModal: value })
  }

  validateSettings = (entity) => {
    let isValid = true
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
    if (
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

  render() {
    const {
      isAdvancedView,
      selectedDateOption,
      activeTab,
      showSaveSettingsModal,
      showDeleteSettingModal,
      settingDetails,
      showUpdateSettingModal,
    } = this.state
    const { assignmentSettings: assignment, isTestLoading, match } = this.props
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
    } = this.props
    const { title, _id } = isPlaylist ? playlist : testItem
    const exactMenu = parentMenu[location?.state?.from || from]
    if (exactMenu?.to === 'myPlaylist') {
      exactMenu.to = `playlists/playlist/${_id}/use-this`
    }

    const moduleId = match.params.moduleId
    const _module = playlist.modules?.find((m) => m?._id === moduleId)
    const moduleTitle = _module?.title || ''
    const isTestSettingSaveLimitReached =
      testSettingsList.length >= TEST_SETTINGS_SAVE_LIMIT

    return (
      <div>
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
            {/* TODO there are some scenarios we have both simple and advance view which is yet be decided */}
            {premium && (
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
                              settingDetails: { _id: t._id, title: t.title },
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
            )}
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
      currentSettingsId: getCurrentSettingsIdSelector(state),
      userId: getUserId(state),
      testSettingsList: getTestSettingsListSelector(state),
      testDefaultSettings: getTestDefaultSettingsSelector(state),
      userFeatures: getUserFeatures(state),
      isFreezeSettingsOn: getIsOverrideFreezeSelector(state),
      totalItems: state?.tests?.entity?.isDocBased
        ? state?.tests?.entity?.summary?.totalQuestions
        : state?.tests?.entity?.summary?.totalItems,
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
      toggleFreeAdminSubscriptionModal: toggleFreeAdminSubscriptionModalAction,
      fetchTestSettingsList: fetchTestSettingsListAction,
      saveTestSettings: saveTestSettingsAction,
      setCurrentTestSettingsId: setCurrentTestSettingsIdAction,
      deleteTestSettingRequest: deleteTestSettingRequestAction,
      updateTestSettingRequest: updateTestSettingRequestAction,
      fetchUserCustomKeypads: fetchCustomKeypadAction,
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
