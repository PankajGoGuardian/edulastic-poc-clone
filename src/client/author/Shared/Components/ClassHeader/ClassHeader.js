import {
  HeaderTabs,
  MainHeader,
  EduButton,
  notification,
  withWindowSizes,
} from '@edulastic/common'
import { StyledTabs } from '@edulastic/common/src/components/HeaderTabs'
import {
  HeaderMidContainer,
  TitleWrapper,
} from '@edulastic/common/src/components/MainHeader'
import {
  assignmentPolicyOptions,
  test as testContants,
  testActivityStatus,
  testActivity as testActivityConstants,
} from '@edulastic/constants'
import {
  IconBookMarkButton,
  IconDeskTopMonitor,
  IconNotes,
  IconSettings,
  IconStar,
} from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown, Tooltip, message } from 'antd'
import { get, capitalize } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { smallDesktopWidth, themeLightGrayBgColor } from '@edulastic/colors'
import * as TokenStorage from '@edulastic/api/src/utils/Storage'
import { assignmentApi } from '@edulastic/api'
import ConfirmationModal from '../../../../common/components/ConfirmationModal'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import { DeleteAssignmentModal } from '../../../Assignments/components/DeleteAssignmentModal/deleteAssignmentModal'
import ReleaseScoreSettingsModal from '../../../Assignments/components/ReleaseScoreSettingsModal/ReleaseScoreSettingsModal'
import { StudentReportCardMenuModal } from '../../../StudentsReportCard/components/studentReportCardMenuModal'
import {
  classListSelector,
  getCanCloseAssignmentSelector,
  getCanOpenAssignmentSelector,
  getHasRandomQuestionselector,
  getMarkAsDoneEnableSelector,
  getPasswordPolicySelector,
  getViewPasswordSelector,
  inProgressStudentsSelector,
  isItemVisibiltySelector,
  notStartedStudentsSelector,
  showPasswordButonSelector,
  showScoreSelector,
  getIsShowUnAssignSelector,
  testActivtyLoadingSelector,
} from '../../../ClassBoard/ducks'
import { toggleDeleteAssignmentModalAction } from '../../../sharedDucks/assignments'
import {
  googleSyncAssignmentAction,
  toggleReleaseScoreSettingsAction,
  toggleStudentReportCardSettingsAction,
  googleSyncAssignmentGradesAction,
  schoologySyncAssignmentGradesAction,
  schoologySyncAssignmentAction,
  cleverSyncAssignmentGradesAction,
} from '../../../src/actions/assignments'
import {
  canvasSyncAssignmentAction,
  canvasSyncGradesAction,
  closeAssignmentAction,
  markAsDoneAction,
  openAssignmentAction,
  receiveTestActivitydAction,
  releaseScoreAction,
  togglePauseAssignmentAction,
  toggleViewPasswordAction,
} from '../../../src/actions/classBoard'
import WithDisableMessage from '../../../src/components/common/ToggleDisable'
import { gradebookUnSelectAllAction } from '../../../src/reducers/gradeBook'
import {
  getAssignmentSyncInProgress,
  getSchoologyAssignmentSyncInProgress,
  getToggleReleaseGradeStateSelector,
  getToggleStudentReportCardStateSelector,
  getShareWithGCInProgress,
} from '../../../src/selectors/assignments'
import {
  getGroupList,
  getCanvasAllowedInstitutionPoliciesSelector,
  getUserRole,
} from '../../../src/selectors/user'
import { getIsProxiedByEAAccountSelector } from '../../../../student/Login/ducks'

import {
  CaretUp,
  ClassDropMenu,
  DownArrow,
  DropMenu,
  MenuItems,
  OpenCloseWrapper,
  RightSideButtonWrapper,
  StudentStatusDetails,
  StyledDiv,
  StyledParaFirst,
  StyledParaSecond,
  StyledPopconfirm,
} from './styled'
import ViewPasswordModal from './ViewPasswordModal'
import { allowedSettingPageToDisplay } from './utils/transformers'
import { slice } from '../../../LCBAssignmentSettings/ducks'
import PremiumPopover from '../../../../features/components/PremiumPopover'

const {
  POLICY_CLOSE_MANUALLY_BY_ADMIN,
  POLICY_CLOSE_MANUALLY_IN_CLASS,
} = assignmentPolicyOptions
const {
  gradingStatus,
  authorAssignmentConstants: { assignmentStatus: assignmentStatusConstants },
} = testActivityConstants

const classViewRoutesByActiveTabName = {
  classboard: 'classboard',
  expressgrader: 'expressgrader',
  standard_report: 'standardsBasedReport',
  settings: 'lcb/settings',
}
class ClassHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      isPauseModalVisible: false,
      isCloseModalVisible: false,
      modalInputVal: '',
      condition: true, // Whether meet the condition, if not show popconfirm.
      actionsVisible: false,
      premiumPopup: null,
    }
    this.inputRef = React.createRef()
  }

  switchClass(classId) {
    if (!classId) return
    const {
      loadTestActivity,
      match,
      studentUnselectAll,
      resetView,
      active,
      loadAssignment,
    } = this.props
    const { assignmentId } = match.params
    if (match.params.classId === classId) return
    if (active === 'classboard') {
      resetView('Both')
    }
    if (active === 'settings') {
      loadAssignment({ assignmentId, classId })
    } else {
      loadTestActivity(assignmentId, classId)
    }
    studentUnselectAll()
  }

  changeCondition = (value) => {
    this.setState({ condition: value })
  }

  confirm = () => {
    this.setState({ visible: false })
    notification({ type: 'success', messageKey: 'nextStep' })
  }

  cancel = () => {
    this.setState({ visible: false })
    notification({ messageKey: 'ClickOnCancel' })
  }

  handleVisibleChange = (visible) => {
    if (!visible) {
      this.setState({ visible })
      return
    }
    const { condition } = this.state
    // Determining condition before show the popconfirm.
    if (condition) {
      this.confirm() // next step
    } else {
      this.setState({ visible }) // show the popconfirm
    }
  }

  handleReleaseScore = (releaseScore) => {
    const {
      match,
      setReleaseScore,
      toggleReleaseGradePopUp,
      additionalData: { testId },
    } = this.props
    const { classId, assignmentId } = match.params
    setReleaseScore(assignmentId, classId, releaseScore, testId)
    toggleReleaseGradePopUp(false)
  }

  handleMarkAsDone = () => {
    const {
      setMarkAsDone,
      match,
      additionalData: { testId },
    } = this.props
    const { classId, assignmentId } = match.params
    setMarkAsDone(assignmentId, classId, testId)
  }

  handleOpenAssignment = () => {
    const { openAssignment, match, additionalData } = this.props
    const { classId, assignmentId } = match.params
    openAssignment(assignmentId, classId, additionalData.testId)
  }

  handleCloseAssignment = () => {
    const {
      closeAssignment,
      match,
      additionalData: { testId },
    } = this.props
    const { classId, assignmentId } = match.params
    closeAssignment(assignmentId, classId, testId)
    this.toggleCloseModal(false)
  }

  handlePauseAssignment(value) {
    const {
      togglePauseAssignment,
      match,
      additionalData: { testName, testId },
    } = this.props
    const { classId, assignmentId } = match.params
    togglePauseAssignment({
      value,
      assignmentId,
      classId,
      name: testName,
      testId,
    })
    this.togglePauseModal(false)
  }

  togglePauseModal = (value) => {
    this.setState({ isPauseModalVisible: value, modalInputVal: '' })
  }

  toggleCloseModal = (value) => {
    if (value === true) {
      const {
        additionalData: { testId },
        closeAssignment,
        testActivity,
        isActivityLoading,
        match,
      } = this.props
      if (isActivityLoading) return
      const { SUBMITTED, ABSENT } = testActivityStatus
      const isAllDone = testActivity.every(
        ({ UTASTATUS }) => UTASTATUS === SUBMITTED || UTASTATUS === ABSENT
      )
      if (isAllDone) {
        const { classId, assignmentId } = match.params
        closeAssignment(assignmentId, classId, testId)
        return
      }
    }
    this.setState({ isCloseModalVisible: value, modalInputVal: '' })
  }

  handleValidateInput = (e) => {
    this.setState({ modalInputVal: e.target.value })
  }

  handleTogglePasswordModal = () => {
    const { passwordPolicy, toggleViewPassword, assignmentStatus } = this.props
    if (
      assignmentStatus === 'NOT OPEN' &&
      passwordPolicy ===
        testContants.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
    ) {
      notification({ messageKey: 'assignmentShouldBeOpenToSeePassword' })
      return
    }
    toggleViewPassword()
  }

  onStudentReportCardsClick = () => {
    const { testActivity, toggleStudentReportCardPopUp } = this.props
    const isAnyBodyGraded = testActivity.some(
      (item) =>
        item.UTASTATUS === testActivityStatus.SUBMITTED &&
        item.graded === gradingStatus.GRADED
    )
    if (isAnyBodyGraded) {
      toggleStudentReportCardPopUp(true)
    } else {
      notification({ messageKey: 'noStudentIsGradedToGenerateReportCard' })
    }
  }

  handleAssignmentGradesSync = (data) => {
    const { googleSyncAssignmentGrades, additionalData } = this.props
    if (
      additionalData.releaseScore ===
      testContants.releaseGradeTypes.DONT_RELEASE
    ) {
      return notification({
        msg:
          'Please update release score policy to sync grades to Google Classroom',
      })
    }
    googleSyncAssignmentGrades(data)
  }

  handleSchoologyAssignmentGradesSync = (data) => {
    const { schoologySyncAssignmentGrades, additionalData } = this.props
    if (
      additionalData.releaseScore ===
      testContants.releaseGradeTypes.DONT_RELEASE
    ) {
      return notification({
        msg:
          'Please update release score policy to sync grades to Schoology Classroom',
      })
    }
    schoologySyncAssignmentGrades(data)
  }

  handleCleverAssignmentGradesSync = (data) => {
    const { cleverSyncAssignmentGrades, additionalData } = this.props
    if (
      additionalData.releaseScore ===
      testContants.releaseGradeTypes.DONT_RELEASE
    ) {
      return notification({
        msg: 'Please update release score policy to sync grades to clever',
      })
    }
    cleverSyncAssignmentGrades(data)
  }

  componentDidMount() {
    // if redirect is happening for LCB and user did action schoology sync
    const atlasShareOriginUrl =
      TokenStorage.getFromLocalStorage('atlasShareOriginUrl') || ''
    const schoologySync = localStorage.getItem('schoologyShare')
    if (
      atlasShareOriginUrl &&
      atlasShareOriginUrl.indexOf('classboard') > -1 &&
      schoologySync
    ) {
      const fragments = atlasShareOriginUrl.split('/')
      const assignmentId = fragments[3]
      const classSectionId = fragments[4]
      const {
        schoologySyncAssignmentGrades,
        schoologySyncAssignment,
      } = this.props
      if (schoologySync === 'grades') {
        schoologySyncAssignmentGrades({
          assignmentId,
          groupId: classSectionId,
        })
      } else if (schoologySync === 'assignment') {
        schoologySyncAssignment({
          assignmentIds: [assignmentId],
          groupId: classSectionId,
        })
      }
      localStorage.removeItem('atlasShareOriginUrl')
      localStorage.removeItem('schoologyShare')
    }
  }

  generateBubbleSheet = (assignmentId, groupId) => {
    const hideLoading = message.loading('Generating...', 0)

    assignmentApi
      .getBubbleSheet({ assignmentId, groupId })
      .then((r) => {
        hideLoading()
        if (r.data?.result?.hasNonMcq) {
          notification({
            type: 'warn',
            msg: `Please note Non multiple choice questions will have to be manually graded.`,
            exact: true,
            duration: null,
          })
        }
        if (r.data?.result?.Location) {
          window.open(r.data?.result?.Location, '_blank').focus()
        }
      })
      .catch((err) => {
        hideLoading()
        const errorReason = err?.response?.data?.message || ''
        notification({
          type: 'error',
          msg: `Generating Bubble sheet failed. ${errorReason}`,
          exact: true,
        })
      })
  }

  componentDidUpdate() {
    const { premiumPopup } = this.state
    try {
      if (premiumPopup && !document.body.contains(premiumPopup)) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          premiumPopup: null,
        })
      }
    } catch {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        premiumPopup: null,
      })
    }
  }

  showPremiumPopup = (element) => {
    this.setState({
      premiumPopup: element,
    })
  }

  render() {
    const {
      t,
      active,
      additionalData = {},
      assignmentStatus,
      enableMarkAsDone,
      canClose,
      canOpen,
      isShowReleaseSettingsPopup,
      toggleReleaseGradePopUp,
      toggleDeleteAssignmentModal,
      notStartedStudents,
      inProgressStudents,
      isItemsVisible,
      classesList,
      match,
      showPasswordButton,
      isViewPassword,
      hasRandomQuestions,
      orgClasses = [],
      districtPolicy,
      canvasSyncGrades,
      googleSyncAssignment,
      syncWithGoogleClassroomInProgress,
      shareWithGCInProgress,
      isShowStudentReportCardSettingPopup,
      toggleStudentReportCardPopUp,
      userId,
      isDemoPlaygroundUser,
      windowWidth,
      canvasAllowedInstitutions,
      isCliUser,
      isShowUnAssign,
      canvasSyncAssignment,
      studentsUTAData,
      schoologySyncAssignment,
      syncWithSchoologyClassroomInProgress,
      isProxiedByEAAccount,
    } = this.props
    const {
      visible,
      isPauseModalVisible,
      isCloseModalVisible,
      modalInputVal = '',
      actionsVisible,
      premiumPopup,
    } = this.state
    const forceActionsVisible = !!premiumPopup
    const {
      endDate,
      startDate,
      releaseScore,
      isPaused = false,
      open,
      closed,
      canCloseClass = [],
      dueDate,
      assignedBy = {},
      answerOnPaper,
      classId: _classId,
    } = additionalData
    const dueOn = dueDate || endDate
    const dueOnDate = Number.isNaN(dueOn)
      ? new Date(dueOn)
      : new Date(parseInt(dueOn, 10))
    const { assignmentId, classId } = match.params
    const canPause =
      (startDate || open) &&
      !closed &&
      (endDate > Date.now() || !endDate) &&
      canCloseClass.includes(classId)
    const assignmentStatusForDisplay =
      assignmentStatus === 'NOT OPEN' && startDate && startDate < moment()
        ? 'IN PROGRESS'
        : closed
        ? 'DONE'
        : assignmentStatus
    const {
      canvasCode,
      canvasCourseSectionCode,
      googleId: groupGoogleId,
      atlasId: groupAtlasId,
      atlasProviderName = '',
    } = orgClasses.find(({ _id }) => _id === classId) || {}
    const showSyncGradesWithCanvasOption =
      !isDemoPlaygroundUser &&
      canvasCode &&
      canvasCourseSectionCode &&
      canvasAllowedInstitutions.length

    // hiding seeting tab if assignment assigned by either DA/SA
    const showSettingTab = allowedSettingPageToDisplay(assignedBy, userId)

    const isSmallDesktop = windowWidth <= parseInt(smallDesktopWidth, 10)
    const loading = _classId !== classId

    const showGoogleGradeSyncOption =
      !isDemoPlaygroundUser &&
      groupGoogleId &&
      assignmentStatusForDisplay !== assignmentStatusConstants.NOT_OPEN &&
      studentsUTAData.some(
        (uta) =>
          uta.graded === gradingStatus.GRADED ||
          uta.UTASTATUS === testActivityStatus.SUBMITTED
      )

    const showSchoologyGradeSyncOption =
      !isDemoPlaygroundUser &&
      groupAtlasId &&
      (atlasProviderName.toLocaleUpperCase() === 'SCHOOLOGY' ||
        (['CANVAS', 'CLEVER'].includes(atlasProviderName.toLocaleUpperCase()) &&
          districtPolicy?.providerNameToShareResourceViaEdlink)) &&
      assignmentStatusForDisplay !== assignmentStatusConstants.NOT_OPEN &&
      studentsUTAData.some(
        (uta) =>
          uta.graded === gradingStatus.GRADED ||
          uta.UTASTATUS === testActivityStatus.SUBMITTED
      )

    const showCleverGradeSyncOption =
      !isDemoPlaygroundUser &&
      districtPolicy?.cleverGradeSyncEnabled &&
      assignmentStatusForDisplay !== assignmentStatusConstants.NOT_OPEN &&
      studentsUTAData.some(
        (uta) =>
          uta.graded === gradingStatus.GRADED ||
          uta.UTASTATUS === testActivityStatus.SUBMITTED
      )

    const isAssignmentDone = assignmentStatus.toLowerCase() === 'done'

    const renderOpenClose = (
      <OpenCloseWrapper>
        {canOpen ? (
          <EduButton
            isBlue
            isGhost
            data-cy="openButton"
            onClick={this.handleOpenAssignment}
          >
            OPEN
          </EduButton>
        ) : (
          (isPaused || (assignmentStatusForDisplay !== 'DONE' && canPause)) && (
            <EduButton
              isBlue
              isGhost
              data-cy="openPauseButton"
              onClick={() =>
                isPaused
                  ? this.handlePauseAssignment(!isPaused)
                  : this.togglePauseModal(true)
              }
            >
              {isPaused ? 'RESUME' : 'PAUSE'}
            </EduButton>
          )
        )}
        {canClose ? (
          <EduButton
            isBlue
            isGhost
            data-cy="closeButton"
            onClick={() =>
              answerOnPaper
                ? this.handleCloseAssignment()
                : this.toggleCloseModal(true)
            }
          >
            CLOSE
          </EduButton>
        ) : (
          ''
        )}
      </OpenCloseWrapper>
    )

    const scanBubbleSheetMenuItem = ({ isAccessible }) => {
      const tooltipTitle = hasRandomQuestions
        ? t('common.randomItemsBubbleScanDisableMessage')
        : canOpen
        ? 'OPEN Assignment to Scan Responses'
        : isPaused
        ? 'RESUME Assignment to Scan Responses'
        : null
      const isMenuItemActive =
        !canOpen && !isPaused && canClose && isAccessible && !hasRandomQuestions
      const menuText = (
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Scan Bubble Sheet&nbsp;&nbsp; {isAccessible || <IconStar />}
        </span>
      )
      const menuItemContent = isMenuItemActive ? (
        <Link
          to={{
            pathname: '/uploadAnswerSheets',
            search: `?assignmentId=${assignmentId}&groupId=${classId}`,
          }}
          target="_blank"
        >
          {menuText}
        </Link>
      ) : (
        menuText
      )
      return (
        <MenuItems
          data-cy="upload-bubble-sheet"
          key="upload-bubble-sheet"
          onClick={() =>
            hasRandomQuestions
              ? notification({
                  msg: t('common.randomItemsBubbleScanDisableMessage'),
                })
              : null
          }
          disabled={!isMenuItemActive}
          style={!isAccessible ? { cursor: 'pointer' } : {}}
        >
          <Tooltip
            title={!isMenuItemActive ? tooltipTitle : null}
            placement="left"
          >
            {menuItemContent}
          </Tooltip>
        </MenuItems>
      )
    }

    const actionsMenu = (
      <DropMenu style={{ display: 'flex', flexDirection: 'column' }}>
        <CaretUp className="fa fa-caret-up" />
        {isSmallDesktop && <MenuItems key="key3">{renderOpenClose}</MenuItems>}
        <FeaturesSwitch
          inputFeatures="assessmentSuperPowersMarkAsDone"
          actionOnInaccessible="hidden"
          groupId={classId}
        >
          <MenuItems
            data-cy="markAsDone"
            key="key1"
            onClick={this.handleMarkAsDone}
            disabled={
              !enableMarkAsDone || assignmentStatus.toLowerCase() === 'done'
            }
          >
            Mark as Done
          </MenuItems>
        </FeaturesSwitch>
        <MenuItems
          data-cy="releaseScore"
          key="key2"
          onClick={() => toggleReleaseGradePopUp(true)}
        >
          Release Score
        </MenuItems>
        <FeaturesSwitch
          inputFeatures="enableOmrSheets"
          actionOnInaccessible={(e) =>
            this.showPremiumPopup(e.currentTarget || e.target)
          }
          groupId={classId}
          style={
            (isAccessible) => (isAccessible ? {} : { order: 99 }) // order should be >= no. of list items to put it at last
          }
        >
          {({ isAccessible }) => (
            <MenuItems
              data-cy="download-bubble-sheet"
              key="download-bubble-sheet"
              onClick={(e) =>
                !isAccessible
                  ? this.showPremiumPopup(e.domEvent.target)
                  : hasRandomQuestions
                  ? notification({
                      msg: t('common.randomItemsBubbleScanDisableMessage'),
                    })
                  : this.generateBubbleSheet(assignmentId, classId)
              }
              disabled={
                !!isAssignmentDone || !isAccessible || hasRandomQuestions
              }
              style={!isAccessible ? { cursor: 'pointer' } : {}}
            >
              <Tooltip
                title={
                  hasRandomQuestions
                    ? t('common.randomItemsBubbleScanDisableMessage')
                    : isAssignmentDone
                    ? 'Assignment is not open'
                    : null
                }
                placement="right"
              >
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  Generate Bubble Sheet&nbsp;&nbsp;
                  {isAccessible || <IconStar />}
                </span>
              </Tooltip>
            </MenuItems>
          )}
        </FeaturesSwitch>
        <FeaturesSwitch
          inputFeatures="enableOmrSheets"
          actionOnInaccessible={(e) =>
            this.showPremiumPopup(e.currentTarget || e.target)
          }
          groupId={classId}
          style={
            (isAccessible) => (isAccessible ? {} : { order: 99 }) // order should be >= no. of list items to put it at last
          }
        >
          {scanBubbleSheetMenuItem}
        </FeaturesSwitch>
        <PremiumPopover
          target={premiumPopup}
          onClose={() => this.setState({ premiumPopup: null })}
          descriptionType="bubble"
        />
        {isShowUnAssign && (
          <MenuItems
            data-cy="unAssign"
            key="key4"
            onClick={() => toggleDeleteAssignmentModal(true)}
          >
            Unassign ALL Students
          </MenuItems>
        )}
        {showPasswordButton && (
          <MenuItems
            data-cy="viewPassword"
            key="key5"
            onClick={this.handleTogglePasswordModal}
          >
            View Password
          </MenuItems>
        )}
        {showSyncGradesWithCanvasOption &&
          assignmentStatusForDisplay !== 'NOT OPEN' && (
            <MenuItems
              data-cy="shareOnCanvas"
              key="key6"
              onClick={() =>
                canvasSyncAssignment({ assignmentId, groupId: classId })
              }
            >
              Share on Canvas
            </MenuItems>
          )}
        {showSyncGradesWithCanvasOption &&
          assignmentStatusForDisplay !== 'NOT OPEN' && (
            <MenuItems
              data-cy="canvasGradeSync"
              key="key7"
              onClick={() =>
                canvasSyncGrades({ assignmentId, groupId: classId })
              }
            >
              Canvas Grade Sync
            </MenuItems>
          )}
        {showGoogleGradeSyncOption && (
          <MenuItems
            key="key8"
            onClick={() =>
              this.handleAssignmentGradesSync({
                assignmentId,
                groupId: classId,
              })
            }
          >
            Sync Grades to Google Classroom
          </MenuItems>
        )}
        {!isDemoPlaygroundUser && groupGoogleId && (
          <MenuItems
            key="key9"
            onClick={() =>
              googleSyncAssignment({
                assignmentIds: [assignmentId],
                groupId: classId,
              })
            }
            disabled={
              syncWithGoogleClassroomInProgress || shareWithGCInProgress
            }
          >
            <Tooltip
              title={
                shareWithGCInProgress
                  ? 'Syncing Assignment with Google Classroom'
                  : null
              }
              placement="right"
              color={themeLightGrayBgColor}
            >
              Sync with Google Classroom
            </Tooltip>
          </MenuItems>
        )}
        {showSchoologyGradeSyncOption && (
          <MenuItems
            data-cy="schoologySyncGrades"
            key="key10"
            onClick={() =>
              this.handleSchoologyAssignmentGradesSync({
                assignmentId,
                groupId: classId,
                atlasProviderName: capitalize(atlasProviderName),
              })
            }
          >
            Sync Grades to {capitalize(atlasProviderName)} Classroom
          </MenuItems>
        )}
        {!isDemoPlaygroundUser &&
          groupAtlasId &&
          (atlasProviderName.toLocaleUpperCase() === 'SCHOOLOGY' ||
            (['CANVAS', 'CLEVER'].includes(
              atlasProviderName.toLocaleUpperCase()
            ) &&
              districtPolicy?.providerNameToShareResourceViaEdlink)) && (
            <MenuItems
              data-cy="schoologySyncAssignment"
              key="key11"
              onClick={() =>
                schoologySyncAssignment({
                  assignmentIds: [assignmentId],
                  groupId: classId,
                  atlasProviderName: capitalize(atlasProviderName),
                })
              }
              disabled={syncWithSchoologyClassroomInProgress}
            >
              Sync with {capitalize(atlasProviderName)} Classroom
            </MenuItems>
          )}
        {showCleverGradeSyncOption && (
          <MenuItems
            key="key12"
            onClick={() =>
              this.handleCleverAssignmentGradesSync({
                assignmentId,
                groupId: classId,
              })
            }
          >
            Sync Grades to Clever
          </MenuItems>
        )}
        <FeaturesSwitch
          inputFeatures="LCBstudentReportCard"
          key="LCBstudentReportCard"
          actionOnInaccessible="hidden"
          groupId={classId}
        >
          <MenuItems
            disabled={isProxiedByEAAccount}
            title={
              isProxiedByEAAccount
                ? 'Bulk action disabled for EA proxy accounts.'
                : ''
            }
            data-cy="studentReportCard"
            onClick={this.onStudentReportCardsClick}
          >
            Student Report Cards
          </MenuItems>
        </FeaturesSwitch>
      </DropMenu>
    )

    const classListMenu = (
      <ClassDropMenu selectedKeys={classId}>
        {classesList.map((item) => (
          <MenuItems key={item._id} onClick={() => this.switchClass(item._id)}>
            <Link
              to={`/author/${classViewRoutesByActiveTabName[active]}/${assignmentId}/${item._id}`}
            >
              {item.name}
            </Link>
          </MenuItems>
        ))}
      </ClassDropMenu>
    )

    let closeDateTooltipText = `This test is set to be closed automatically on ${moment(
      dueOnDate
    ).format('MMM DD, YYYY')}`

    if (dueDate && endDate) {
      closeDateTooltipText = `This test is due on ${moment(dueOnDate).format(
        'MMM DD, YYYY'
      )}. Late submissions are allowed till ${moment(endDate).format(
        'MMM DD, YYYY'
      )}`
    } else if (additionalData.closePolicy === POLICY_CLOSE_MANUALLY_BY_ADMIN) {
      closeDateTooltipText = 'This test is set to be closed manually by admin'
    } else if (additionalData.closePolicy === POLICY_CLOSE_MANUALLY_IN_CLASS) {
      closeDateTooltipText = 'This test is set to be closed manually by teacher'
    }

    return (
      <MainHeader hideSideMenu={isCliUser}>
        <TitleWrapper titleMinWidth="unset" titleMaxWidth="22rem">
          {loading ? (
            'loading...'
          ) : (
            <div>
              {classesList.length > 1 ? (
                <Dropdown
                  overlay={classListMenu}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  placement="bottomLeft"
                >
                  <div style={{ position: 'relative' }}>
                    <StyledParaFirst
                      data-cy="CurrentClassName"
                      title={additionalData.className}
                    >
                      {additionalData.className}
                    </StyledParaFirst>
                    <DownArrow type="down" />
                  </div>
                </Dropdown>
              ) : (
                <div style={{ position: 'relative' }}>
                  <StyledParaFirst
                    data-cy="CurrentClassName"
                    title={additionalData.className}
                  >
                    {additionalData.className}
                  </StyledParaFirst>
                </div>
              )}
              <StyledParaSecond data-cy="assignmentStatusForDisplay">
                {assignmentStatusForDisplay}
                {isPaused && assignmentStatusForDisplay !== 'DONE'
                  ? ' (PAUSED)'
                  : ''}
                {!isCliUser && (
                  <Tooltip placement="bottom" title={closeDateTooltipText}>
                    <div>
                      {dueDate || endDate
                        ? `(Due on ${moment(dueOnDate).format('MMM DD, YYYY')})`
                        : '(Close Manually)'}
                    </div>
                  </Tooltip>
                )}
              </StyledParaSecond>
            </div>
          )}
        </TitleWrapper>
        {!isCliUser && (
          <>
            <HeaderMidContainer>
              <StyledTabs>
                <HeaderTabs
                  to={`/author/classboard/${assignmentId}/${classId}`}
                  dataCy="LiveClassBoard"
                  isActive={active === 'classboard'}
                  icon={<IconDeskTopMonitor left={0} />}
                  linkLabel={t('common.liveClassBoard')}
                />
                <FeaturesSwitch
                  inputFeatures="expressGrader"
                  actionOnInaccessible="hidden"
                  groupId={classId}
                >
                  <WithDisableMessage
                    disabled={hasRandomQuestions || !isItemsVisible}
                    errMessage={
                      hasRandomQuestions
                        ? t('common.randomItemsDisableMessage')
                        : t('common.testHidden')
                    }
                  >
                    <HeaderTabs
                      to={`/author/expressgrader/${assignmentId}/${classId}`}
                      disabled={!isItemsVisible || hasRandomQuestions}
                      dataCy="Expressgrader"
                      isActive={active === 'expressgrader'}
                      icon={<IconBookMarkButton left={0} />}
                      linkLabel={t('common.expressGrader')}
                    />
                  </WithDisableMessage>
                </FeaturesSwitch>

                <WithDisableMessage
                  disabled={!isItemsVisible}
                  errMessage={t('common.testHidden')}
                >
                  <HeaderTabs
                    to={`/author/standardsBasedReport/${assignmentId}/${classId}`}
                    disabled={!isItemsVisible}
                    dataCy="StandardsBasedReport"
                    isActive={active === 'standard_report'}
                    icon={<IconNotes left={0} />}
                    linkLabel={t('common.standardBasedReports')}
                  />
                </WithDisableMessage>
                {showSettingTab && (
                  <HeaderTabs
                    to={`/author/lcb/settings/${assignmentId}/${classId}`}
                    dataCy="LCBAssignmentSettings"
                    isActive={active === 'settings'}
                    icon={<IconSettings left={0} />}
                    linkLabel={t('common.settings')}
                  />
                )}
              </StyledTabs>
            </HeaderMidContainer>
            <RightSideButtonWrapper>
              {!isSmallDesktop && renderOpenClose}
              <Dropdown
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                overlay={actionsMenu}
                placement="bottomRight"
                visible={forceActionsVisible || actionsVisible}
                onVisibleChange={(v) => this.setState({ actionsVisible: v })}
              >
                <EduButton isBlue data-cy="headerDropDown" IconBtn>
                  <FontAwesomeIcon icon={faEllipsisV} />
                </EduButton>
              </Dropdown>
              <StyledDiv>
                <StyledPopconfirm
                  visible={visible}
                  onVisibleChange={this.handleVisibleChange}
                  onConfirm={this.confirm}
                  onCancel={this.cancel}
                  okText="Yes"
                  cancelText="No"
                />
                {isShowReleaseSettingsPopup && (
                  <ReleaseScoreSettingsModal
                    showReleaseGradeSettings={isShowReleaseSettingsPopup}
                    onCloseReleaseScoreSettings={() =>
                      toggleReleaseGradePopUp(false)
                    }
                    updateReleaseScoreSettings={this.handleReleaseScore}
                    releaseScore={releaseScore}
                  />
                )}
                <DeleteAssignmentModal
                  testName={additionalData?.testName}
                  testId={additionalData?.testId}
                  assignmentId={assignmentId}
                  classId={classId}
                  lcb
                />
                {isShowStudentReportCardSettingPopup && (
                  <StudentReportCardMenuModal
                    title="Student Report Card"
                    visible={isShowStudentReportCardSettingPopup}
                    onCancel={() => toggleStudentReportCardPopUp(false)}
                    groupId={classId}
                    assignmentId={assignmentId}
                  />
                )}
                {/* Needed this check as password modal has a timer hook which should not load until all password details are loaded */}
                {isViewPassword && <ViewPasswordModal />}
                <ConfirmationModal
                  title="Pause Assignment"
                  show={isPauseModalVisible}
                  onOk={() => this.handlePauseAssignment(!isPaused)}
                  onCancel={() => this.togglePauseModal(false)}
                  inputVal="PAUSE"
                  placeHolder="Type the action"
                  onInputChange={this.handleValidateInput}
                  expectedVal="PAUSE"
                  showConfirmationText
                  hideUndoneText
                  hideConfirmation
                  bodyText={
                    <div>
                      Are you sure you want to pause assignment for{' '}
                      {additionalData.className} ? Once paused, no student would
                      be able to answer the assignment unless you resume it.
                    </div>
                  }
                  okText="Yes, Pause"
                  cancelText="No, Cancel"
                />
                <ConfirmationModal
                  title="Close"
                  show={isCloseModalVisible}
                  onOk={this.handleCloseAssignment}
                  onCancel={() => this.toggleCloseModal(false)}
                  inputVal={modalInputVal}
                  placeHolder="Type the action"
                  onInputChange={this.handleValidateInput}
                  expectedVal="CLOSE"
                  bodyText={
                    <div>
                      <StudentStatusDetails>
                        {notStartedStudents.length ? (
                          <p style={{ marginRight: '10px' }}>
                            {notStartedStudents.length} student(s) have not yet
                            started
                          </p>
                        ) : (
                          ''
                        )}
                        {inProgressStudents.length ? (
                          <p>
                            {inProgressStudents.length} student(s) have not yet
                            submitted
                          </p>
                        ) : (
                          ''
                        )}
                      </StudentStatusDetails>
                      <p>
                        Are you sure you want to close ? Once closed, no student
                        would be able to answer the assessment
                      </p>
                    </div>
                  }
                  okText="Yes, Close"
                  showConfirmationText
                  hideUndoneText
                />
              </StyledDiv>
            </RightSideButtonWrapper>
          </>
        )}
      </MainHeader>
    )
  }
}

ClassHeader.propTypes = {
  t: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
  assignmentId: PropTypes.string.isRequired,
  classId: PropTypes.string.isRequired,
  additionalData: PropTypes.object.isRequired,
  setReleaseScore: PropTypes.func.isRequired,
}

const enhance = compose(
  withNamespaces('classBoard'),
  withRouter,
  withWindowSizes,
  connect(
    (state) => ({
      releaseScore: showScoreSelector(state),
      enableMarkAsDone: getMarkAsDoneEnableSelector(state),
      canClose: getCanCloseAssignmentSelector(state),
      canOpen: getCanOpenAssignmentSelector(state),
      assignmentStatus: get(
        state,
        ['author_classboard_testActivity', 'data', 'status'],
        ''
      ),
      studentsUTAData: get(
        state,
        ['author_classboard_testActivity', 'entities'],
        []
      ),
      isShowReleaseSettingsPopup: getToggleReleaseGradeStateSelector(state),
      notStartedStudents: notStartedStudentsSelector(state),
      inProgressStudents: inProgressStudentsSelector(state),
      isItemsVisible: isItemVisibiltySelector(state),
      classesList: classListSelector(state),
      passwordPolicy: getPasswordPolicySelector(state),
      showPasswordButton: showPasswordButonSelector(state),
      isViewPassword: getViewPasswordSelector(state),
      hasRandomQuestions: getHasRandomQuestionselector(state),
      orgClasses: getGroupList(state),
      isProxiedByEAAccount: getIsProxiedByEAAccountSelector(state),
      districtPolicy: get(state, 'user.user.orgData.policies.district'),
      canvasAllowedInstitutions: getCanvasAllowedInstitutionPoliciesSelector(
        state
      ),
      syncWithGoogleClassroomInProgress: getAssignmentSyncInProgress(state),
      shareWithGCInProgress: getShareWithGCInProgress(state),
      isShowStudentReportCardSettingPopup: getToggleStudentReportCardStateSelector(
        state
      ),
      userId: state?.user?.user?._id,
      isDemoPlaygroundUser: state?.user?.user?.isPlayground,
      isShowUnAssign: getIsShowUnAssignSelector(state),
      isActivityLoading: testActivtyLoadingSelector(state),
      syncWithSchoologyClassroomInProgress: getSchoologyAssignmentSyncInProgress(
        state
      ),
      userRole: getUserRole(state),
    }),
    {
      loadTestActivity: receiveTestActivitydAction,
      setReleaseScore: releaseScoreAction,
      togglePauseAssignment: togglePauseAssignmentAction,
      setMarkAsDone: markAsDoneAction,
      openAssignment: openAssignmentAction,
      closeAssignment: closeAssignmentAction,
      toggleReleaseGradePopUp: toggleReleaseScoreSettingsAction,
      studentUnselectAll: gradebookUnSelectAllAction,
      toggleDeleteAssignmentModal: toggleDeleteAssignmentModalAction,
      toggleViewPassword: toggleViewPasswordAction,
      canvasSyncGrades: canvasSyncGradesAction,
      googleSyncAssignment: googleSyncAssignmentAction,
      googleSyncAssignmentGrades: googleSyncAssignmentGradesAction,
      cleverSyncAssignmentGrades: cleverSyncAssignmentGradesAction,
      toggleStudentReportCardPopUp: toggleStudentReportCardSettingsAction,
      canvasSyncAssignment: canvasSyncAssignmentAction,
      schoologySyncAssignment: schoologySyncAssignmentAction,
      schoologySyncAssignmentGrades: schoologySyncAssignmentGradesAction,
      loadAssignment: slice.actions.loadAssignment,
    }
  )
)

export default enhance(ClassHeader)
