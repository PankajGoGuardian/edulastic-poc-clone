import {
  black,
  lightFadedBlack,
  green,
  lightGreen4,
  red,
} from '@edulastic/colors'
import {
  MainContentWrapper,
  CheckboxLabel,
  notification,
  LCBScrollContext,
  BackTop,
  EduIf,
} from '@edulastic/common'
import {
  IconAddStudents,
  IconDownload,
  IconInfo,
  IconMarkAsAbsent,
  IconMarkAsSubmitted,
  IconMoreHorizontal,
  IconPause,
  IconPlay,
  IconPrint,
  IconRedirect,
  IconRemove,
} from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import {
  testActivityStatus,
  testTypes as testTypesConstants,
  roleuser,
} from '@edulastic/constants'
import {
  Dropdown,
  Select,
  notification as antNotification,
  Tooltip,
} from 'antd'
import { get, isEmpty, keyBy, last, round, sortBy, uniqBy } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import CustomNotificationBar from '@edulastic/common/src/components/CustomNotificationBar/CustomNotificationBar'
import { segmentApi } from '@edulastic/api'
import ConfirmationModal from '../../../../common/components/ConfirmationModal'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import QuestionContainer from '../../../QuestionView'
import ClassBreadBrumb from '../../../Shared/Components/ClassBreadCrumb'
import ClassHeader from '../../../Shared/Components/ClassHeader/ClassHeader'
import { GenSelect } from '../../../Shared/Components/ClassSelect/ClassSelect'
import PresentationToggleSwitch from '../../../Shared/Components/PresentationToggleSwitch'
import StudentSelect from '../../../Shared/Components/StudentSelect/StudentSelect'
// actions
import {
  canvasSyncAssignmentAction,
  downloadGradesResponseAction,
  getAllTestActivitiesForStudentAction,
  markAbsentAction,
  markAsDoneAction,
  markSubmittedAction,
  togglePauseStudentsAction,
  receiveStudentResponseAction,
  receiveTestActivitydAction,
  releaseScoreAction,
  removeStudentAction,
  setCurrentTestActivityIdAction,
} from '../../../src/actions/classBoard'
import { actions } from '../../../Reports/subPages/dataWarehouseReports/GoalsAndInterventions/ducks/actionReducers'
import WithDisableMessage from '../../../src/components/common/ToggleDisable'
import PrintTestModal from '../../../src/components/common/PrintTestModal'
import { InfoMessage } from '../../../../common/styled'
import {
  gradebookSelectStudentAction,
  gradebookSetSelectedAction,
  gradebookUnSelectAllAction,
  gradebookUnSelectStudentAction,
  setShowCanvasShareAction,
} from '../../../src/reducers/gradeBook'
import StudentContainer from '../../../StudentView'
// ducks
import {
  getAdditionalDataSelector,
  getAllTestActivitiesForStudentSelector,
  getAssignmentStatusSelector,
  getClassResponseSelector,
  getCurrentTestActivityIdSelector,
  getDisableMarkAsSubmittedSelector,
  getGradeBookSelector,
  getHasRandomQuestionselector,
  getSortedTestActivitySelector,
  getStudentResponseSelector,
  getTestQuestionActivitiesSelector,
  isItemVisibiltySelector,
  removedStudentsSelector,
  showScoreSelector,
  stateStudentResponseSelector,
  testActivtyLoadingSelector,
  getActiveAssignedStudents,
  getDisableMarkAsAbsentSelector,
  getLCBStudentsList,
  getEnrollmentStatus,
  getFirstQuestionEntitiesSelector,
  actionInProgressSelector,
  getAllStudentsList,
  getStudentsPrevSubmittedUtasSelector,
  getIsDocBasedTestSelector,
  getAttemptWindowSelector,
  getIsItemContentHiddenSelector,
} from '../../ducks'
import AddStudentsPopup from '../AddStudentsPopup'
import BarGraph from '../BarGraph/BarGraph'
import DisneyCardContainer from '../DisneyCardContainer/DisneyCardContainer'
import HooksContainer from '../HooksContainer/HooksContainer'
import Graph from '../ProgressGraph/ProgressGraph'
import RedirectPopup from '../RedirectPopUp'
// components
import Score from '../Score/Score'
// styled wrappers
import {
  BothButton,
  ButtonIconWrap,
  ClassBoardFeats,
  DropMenu,
  GraphContainer,
  GraphWrapper,
  InfoWrapper,
  MenuItems,
  QuestionButton,
  RedirectButton,
  ScoreChangeWrapper,
  ScoreHeader,
  ScoreWrapper,
  StudentButton,
  StudentButtonDiv,
  StudentGrapContainer,
  StyledCard,
  StyledFlexContainer,
  StickyFlex,
  SwitchBox,
  FilterSelect,
  FilterSpan,
  TagWrapper,
  AssignTutoring,
} from './styled'
import {
  setShowAllStudentsAction,
  setPageNumberAction,
} from '../../../src/reducers/testActivity'
import {
  updateCliUserAction,
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
  getIsProxiedByEAAccountSelector,
} from '../../../../student/Login/ducks'
import { getSubmittedDate } from '../../utils'
import {
  invokeTutorMeSDKtoAssignTutor,
  openTutorMeBusinessPage,
} from '../../../TutorMe/helper'
import {
  isFreeAdminSelector,
  isSAWithoutSchoolsSelector,
  getUserId,
  getIsTutorMeEnabledSelector,
  getUserOrgId,
  getUserEmailSelector,
  getUserFullNameSelector,
} from '../../../src/selectors/user'
import { getRegradeModalStateSelector } from '../../../TestPage/ducks'
import RegradeModal from '../../../Regrade/RegradeModal'
import {
  studentIsEnrolled,
  studentIsUnEnrolled,
} from '../../../utils/userEnrollment'
import TutorDetailsPopup from '../../../TutorMe/TutorDetailsPopup'
import {
  getIsTutorMeVisibleToDistrictSelector,
  actions as tutorMeActions,
} from '../../../TutorMe/ducks'
import {
  getMastery,
  getPerfomancePercentage,
} from '../../../StandardsBasedReport/components/TableDisplay'

const { COMMON } = testTypesConstants.TEST_TYPES

const NotificationComponent = (props) => {
  notification(props)
  return null
}

function capitalizeIt(str) {
  if (str && typeof str === 'string') {
    str = str.toLowerCase().split(' ')
    for (let i = 0, x = str.length; i < x; i++) {
      if (str[i]) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1)
      }
    }
    return str.join(' ')
  }
  return str
}

function getStudentFilterCategory(x) {
  if (
    studentIsUnEnrolled({
      isEnrolled: x.isEnrolled,
      enrollmentStatus: x.enrollmentStatus,
      archived: x.archived,
    })
  ) {
    return 'NOT ENROLLED'
  }
  if (x.isAssigned === false) {
    return 'UNASSIGNED'
  }
  if (x.isPaused) {
    return 'PAUSED'
  }
  if (x.graded === 'GRADED') {
    return 'GRADED'
  }
  if (x.status?.toLowerCase() === 'submitted' && x.graded !== 'GRADED') {
    return 'SUBMITTED'
  }
  if (x.redirected && x.UTASTATUS === testActivityStatus.NOT_STARTED) {
    return 'REDIRECTED'
  }
  if (x.UTASTATUS === testActivityStatus.NOT_STARTED) {
    return 'NOT STARTED'
  }
  if (x.status?.toLowerCase() == 'inprogress') {
    return 'IN PROGRESS'
  }

  if (x.UTASTATUS === testActivityStatus.ABSENT) {
    return 'ABSENT'
  }

  return x.status.toUpperCase()
}

function filterStudentsByStatus(selectedStatus) {
  return (x) => {
    if (selectedStatus === 'ALL') {
      return true
    }
    if (
      selectedStatus === 'ALL ASSIGNED' &&
      !studentIsUnEnrolled({
        isEnrolled: x.isEnrolled,
        enrollmentStatus: x.enrollmentStatus,
        archived: x.archived,
      })
    ) {
      return x.isAssigned
    }
    return getStudentFilterCategory(x) === selectedStatus
  }
}

class ClassBoard extends Component {
  constructor(props) {
    super(props)
    this.changeStateTrue = this.changeStateTrue.bind(this)
    this.changeStateFalse = this.changeStateFalse.bind(this)
    this.onSelectAllChange = this.onSelectAllChange.bind(this)
    this.MainContentWrapperRef = React.createRef()
    let _selectedTab = 'Both'
    let questionId = null
    if (props.location.pathname.includes('question-activity')) {
      _selectedTab = 'questionView'
      const tempArr = props.location.pathname.split('/')
      questionId = tempArr[tempArr.length - 1]
    } else if (props.location.pathname.includes('test-activity')) {
      _selectedTab = 'Student'
    }

    this.state = {
      flag: true,
      selectedTab: _selectedTab,
      selectedQuestion: 0,
      selectedQid: questionId,
      itemId: null,
      nCountTrue: 0,
      redirectPopup: false,
      selectedStudentId: '',
      classId: '',
      showMarkAbsentPopup: false,
      showRemoveStudentsPopup: false,
      showAddStudentsPopup: false,
      showMarkSubmittedPopup: false,
      modalInputVal: '',
      selectedNotStartedStudents: [],
      showScoreImporvement: false,
      hasStickyHeader: false,
      toggleBackTopIcon: false,
      studentFilter: 'ALL ASSIGNED',
      showAssignedTutors: false,
      studentToAssignTutor: {
        studentName: '',
        studentId: '',
      },
    }
  }

  disneyCardsContainerRef = React.createRef()

  confirm = () => {
    notification({ type: 'success', messageKey: 'nextStep' })
  }

  cancel = () => {
    notification({ messageKey: 'ClickOnCancel' })
  }

  handleScroll = () => {
    const { hasStickyHeader } = this.state
    const elementTop =
      this.disneyCardsContainerRef.current?.getBoundingClientRect().top || 0
    if (elementTop < 100 && !hasStickyHeader) {
      this.setState({ hasStickyHeader: true })
    } else if (elementTop > 100 && hasStickyHeader) {
      this.setState({ hasStickyHeader: false })
    }
  }

  componentWillUnmount() {
    const { setShowCanvasShare } = this.props
    window.removeEventListener('scroll', this.handleScroll)
    setShowCanvasShare(false)
    antNotification.destroy()
  }

  componentDidMount() {
    const {
      loadTestActivity,
      match,
      studentUnselectAll,
      location,
      updateCliUser,
      isCliUser: cliUserUpdated,
      history,
      setShowAllStudents,
      emailVerified,
      verificationTS,
      isDefaultDA,
      isFreeAdmin,
      isSAWithoutSchools,
      toggleAdminAlertModal,
      toggleVerifyEmailModal,
      userRole,
      fetchInterventionsList,
      isTutorMeEnabled,
      isTutorMeVisibleToDistrict,
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
    const { selectedTab } = this.state
    const { assignmentId, classId } = match.params
    const { search, state } = location
    setShowAllStudents(true)
    loadTestActivity(assignmentId, classId, selectedTab === 'questionView')
    if (isTutorMeEnabled && isTutorMeVisibleToDistrict) {
      fetchInterventionsList({ type: 'tutorme', assignmentId, classId })
    }
    studentUnselectAll()
    window.addEventListener('scroll', this.handleScroll)
    const cliUser = new URLSearchParams(window.location.search).has('cliUser')
    if (cliUser) {
      updateCliUser(true)
    }
    if (cliUserUpdated && !cliUser) {
      history.push({
        search: search ? `${search}&cliUser=true` : `?cliUser=true`,
        state,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      additionalData = {},
      match,
      testActivity,
      getAllTestActivitiesForStudent,
    } = this.props

    const { assignmentId, classId } = match.params
    const filterCriteria = (activity) => activity?.testActivityId
    const { selectedStudentId } = this.state
    if (
      additionalData.testId !== prevState.testId ||
      !prevProps.testActivity.length
    ) {
      const firstStudentId = get(
        testActivity.filter((x) => !!filterCriteria(x)),
        [0, 'studentId'],
        false
      )
      if (firstStudentId)
        getAllTestActivitiesForStudent({
          studentId: selectedStudentId || firstStudentId,
          assignmentId,
          groupId: classId,
        })
    }
  }

  static getDerivedStateFromProps(props, state) {
    let newState = {}
    const {
      additionalData: { testId } = {},
      testActivity,
      allTestActivitiesForStudent,
      testItemsData,
      isContentHidden,
    } = props

    const { itemId, selectedQid } = state

    if (testId !== state.testId) {
      newState = { ...newState, testId }
    }

    if (
      state.selectedQid &&
      !state.itemId &&
      testActivity.length &&
      props.location.pathname.includes('question-activity')
    ) {
      // first load for question-activity page
      const submittedTestActivity = testActivity.find(
        (item) => item.UTASTATUS === testActivityStatus.SUBMITTED
      )
      let questions = []
      if (isContentHidden) {
        questions = submittedTestActivity.questionActivities.filter(
          (item) => !item.isItemContentHidden
        )
      } else {
        questions = submittedTestActivity.questionActivities
      }

      const questionIndex = questions.findIndex(
        (item) => item._id === state.selectedQid
      )
      const question = questions[questionIndex]
      const [firstQuestion] = questions
      if (question) {
        newState = {
          ...newState,
          itemId: question.testItemId,
          selectedQuestion: questionIndex,
        }
      } else if (firstQuestion) {
        newState = {
          ...newState,
          itemId: firstQuestion.testItemId,
          selectedQuestion: 0,
          selectedQid: firstQuestion._id,
        }
        notification({
          type: 'warn',
          messageKey: 'autoGradeRestricedByAdmin',
        })
      }
    }

    if (allTestActivitiesForStudent.length) {
      const tempArr = props.location.pathname.split('/')
      const currentTestActivityId = tempArr[tempArr.length - 1]
      const isFirstAttempt =
        currentTestActivityId === allTestActivitiesForStudent[0]._id
      if (isFirstAttempt) {
        newState = { ...newState, showScoreImporvement: false }
      } else {
        newState = { ...newState, showScoreImporvement: true }
      }
    }

    if (
      testActivity.length &&
      !state.selectedStudentId &&
      props.location.pathname.includes('test-activity')
    ) {
      // first load for test-activity page
      const tempArr = props.location.pathname.split('/')
      const testActivityId = tempArr[tempArr.length - 1]

      let student = testActivity.find(
        (item) => item.testActivityId === testActivityId
      )

      if (!student) {
        const currentUta = Object.values(
          state?.studentsPrevSubmittedUtas || {}
        ).find((uta) => uta._id === testActivityId)
        if (currentUta) {
          student = { studentId: currentUta.userId }
        }
      }

      if (student) {
        newState = {
          ...newState,
          selectedStudentId: student.studentId,
          selectedTab: 'Student',
        }
      }
    }

    if (state.classId !== props.match.params.classId) {
      newState = {
        ...newState,
        selectedStudentId: '',
        classId: props.match.params.classId,
      }
    }

    if (
      testItemsData.some((item) => item?.previousTestItemId === itemId) &&
      props.location.pathname.includes('question-activity')
    ) {
      const currentTestItem =
        testItemsData.find((item) => item?.previousTestItemId === itemId) || {}
      const currentQuestions = get(currentTestItem, ['data', 'questions'], [])
      const currentQid = currentQuestions?.find(
        (ques) => ques?.previousQuestionId === selectedQid
      )?.id
      if (currentTestItem?._id && currentQid) {
        newState = {
          ...newState,
          itemId: currentTestItem._id,
          selectedQid: currentQid,
        }
      }
    }

    if (Object.keys(newState).length) {
      return newState
    }
    return null
  }

  changeStateTrue() {
    this.setState({
      flag: true,
    })
  }

  changeStateFalse() {
    this.setState({
      flag: false,
    })
  }

  onSelectAllChange = (e) => {
    const { checked } = e.target
    const { testActivity } = this.props
    const { studentSelect, studentUnselectAll } = this.props
    const { studentFilter } = this.state
    const filteredStudentActivities = testActivity.filter(
      filterStudentsByStatus(studentFilter)
    )
    filteredStudentActivities.forEach((student) => {
      student.check = checked
    })
    this.setState({
      nCountTrue: checked ? filteredStudentActivities.length : 0,
    })
    if (checked) {
      const selectedAllstudents = filteredStudentActivities.map(
        (x) => x.studentId
      )
      studentSelect(selectedAllstudents)
    } else {
      studentUnselectAll()
    }
  }

  onShowUnEnrolled = () => {
    const { setShowAllStudents, isShowAllStudents } = this.props
    setShowAllStudents(!isShowAllStudents)
  }

  onSelectCardOne = (studentId) => {
    let { nCountTrue } = this.state
    const { studentSelect } = this.props
    this.setState({ nCountTrue: (nCountTrue += 1) })
    studentSelect(studentId)
  }

  onUnselectCardOne = (studentId) => {
    let { nCountTrue } = this.state
    const { studentUnselect } = this.props
    this.setState({ nCountTrue: (nCountTrue -= 1) })
    studentUnselect(studentId)
  }

  handleCreate = () => {
    const { history, match } = this.props
    history.push(`${match.url}/create`)
  }

  getTestActivityId = (data, student) =>
    (
      (!student
        ? data.find((item) => !!item.testActivityId)
        : data.find(
            (item) => !!item.testActivityId && item.studentId == student
          )) || {}
    ).testActivityId

  resetView = (view) => {
    this.setState({ selectedTab: view })
  }

  onTabChange = (e, name, selectedStudentId, testActivityId) => {
    const {
      setCurrentTestActivityId,
      match,
      history,
      loadTestActivity,
      setPageNumber,
    } = this.props
    const { assignmentId, classId } = match.params
    const { selectedStudentId: studentId } = this.state
    this.setState({
      selectedTab: name,
      selectedStudentId: selectedStudentId || studentId,
      hasStickyHeader: false,
    })
    setPageNumber(1)
    if (name === 'Both') {
      history.push(`/author/classboard/${assignmentId}/${classId}`)
      setCurrentTestActivityId('')
      loadTestActivity(assignmentId, classId, false)
    } else if (name === 'Student') {
      history.push(
        `/author/classboard/${assignmentId}/${classId}/test-activity/${testActivityId}`
      )
      setCurrentTestActivityId(testActivityId)
    }
  }

  getQuestions = () => {
    const { classResponse: { testItems = [] } = {} } = this.props
    let totalQuestions = []
    testItems.forEach(({ _id, data: { questions = [] } = {} }) =>
      questions.forEach((q) => {
        totalQuestions = [...totalQuestions, { ...q, itemId: _id }]
      })
    )
    return totalQuestions
  }

  handleRedirect = () => {
    const {
      selectedStudents,
      testActivity,
      enrollmentStatus,
      additionalData = {},
      assignmentStatus,
      removedStudents,
    } = this.props

    if (
      additionalData.isPaused &&
      assignmentStatus !== 'DONE' &&
      additionalData.endDate > Date.now()
    ) {
      return notification({
        type: 'info',
        messageKey: 'classPausedContinueWithRedirect',
      })
    }

    if (removedStudents.some((rs) => selectedStudents[rs])) {
      return notification({
        type: 'warn',
        messageKey: 'youCantRedirectRemoved',
      })
    }

    const notStartedStudents = testActivity.filter(
      (x) =>
        selectedStudents[x.studentId] &&
        (x.status === 'notStarted' ||
          x.status === 'inProgress' ||
          x.status === 'redirected')
    )

    if (notStartedStudents.length > 0) {
      notification({ type: 'warn', messageKey: 'youCanRedirectOnly' })
      return
    }
    const selectedStudentIds = Object.keys(selectedStudents)
    if (selectedStudentIds.some((item) => enrollmentStatus[item] === '0'))
      return notification({ type: 'warn', messageKey: 'youCantRedirect' })
    this.setState({ redirectPopup: true })
  }

  changeCardCheck = (isCheck, studentId) => {
    let nCountTrue = 0
    const { testActivity } = this.props
    testActivity.map((student) => {
      if (student.studentId === studentId) student.check = isCheck
      if (student.check) nCountTrue++
      return null
    })
    this.setState({
      nCountTrue,
    })
  }

  onClickBarGraph = (data) => {
    const { isItemsVisible, match, history } = this.props
    if (!isItemsVisible || data.hiddenAttempt) {
      return
    }
    const { assignmentId, classId } = match.params
    const questions = this.getQuestions()
    const index = questions.findIndex(
      (x) => x.itemId === data.itemId && x.id === data.qid
    )

    this.setState({
      selectedQuestion: index,
      selectedQid: data.qid,
      itemId: data.itemId,
      selectedTab: 'questionView',
    })
    history.push(
      `/author/classboard/${assignmentId}/${classId}/question-activity/${data.qid}`
    )
  }

  handleReleaseScore = () => {
    const { match, setReleaseScore, showScore, additionalData } = this.props
    const { assignmentId, classId } = match.params
    const { testId } = additionalData
    const isReleaseScore = !showScore
    setReleaseScore(assignmentId, classId, isReleaseScore, testId)
  }

  handleMarkAsDone = () => {
    const { setMarkAsDone, match } = this.props
    const { assignmentId, classId } = match.params
    setMarkAsDone(assignmentId, classId)
  }

  handleShowMarkAsSubmittedModal = () => {
    const { selectedStudents, testActivity, assignmentStatus } = this.props
    if (assignmentStatus.toLowerCase() === 'not open') {
      return notification({
        type: 'warn',
        messageKey: 'assignmentIsNotOpenedYet',
      })
    }

    const selectedStudentKeys = Object.keys(selectedStudents)
    if (!selectedStudentKeys.length) {
      return notification({ type: 'warn', messageKey: 'atleastOneStudent' })
    }
    const mapTestActivityByStudId = keyBy(testActivity, 'studentId')
    const inActiveStudentsSelected = (selectedStudentKeys || []).filter(
      (item) =>
        mapTestActivityByStudId?.[item]?.isAssigned === false ||
        mapTestActivityByStudId?.[item]?.isEnrolled === false
    )
    if (inActiveStudentsSelected.length) {
      return notification({
        type: 'warn',
        msg: `You can not mark removed or unerolled students as submit`,
      })
    }
    const selectedSubmittedStudents = (selectedStudentKeys || []).filter(
      (item) =>
        mapTestActivityByStudId?.[item]?.status === 'submitted' ||
        mapTestActivityByStudId?.[item]?.status === 'graded'
    )
    if (selectedSubmittedStudents.length) {
      return notification({
        type: 'warn',
        msg: `${selectedSubmittedStudents.length} student(s) that you selected have already submitted the assignment, you will not be allowed to submit again.`,
      })
    }

    this.setState({ showMarkSubmittedPopup: true, modalInputVal: '' })
  }

  handleShowMarkAsAbsentModal = () => {
    const {
      selectedStudents,
      testActivity,
      assignmentStatus,
      additionalData = {},
    } = this.props
    if (
      assignmentStatus.toLowerCase() === 'not open' &&
      additionalData.startDate > Date.now()
    ) {
      return notification({
        type: 'warn',
        messageKey: 'assignmentIsNotOpenedYet',
      })
    }

    const selectedStudentKeys = Object.keys(selectedStudents)
    if (!selectedStudentKeys.length) {
      return notification({
        type: 'warn',
        messageKey: 'atleastOneStudentToMarkAbsent',
      })
    }
    const mapTestActivityByStudId = keyBy(testActivity, 'studentId')
    const inActiveStudentsSelected = (selectedStudentKeys || []).filter(
      (item) =>
        mapTestActivityByStudId?.[item]?.isAssigned === false &&
        mapTestActivityByStudId?.[item]?.isEnrolled === true
    )
    if (inActiveStudentsSelected.length) {
      return notification({
        type: 'warn',
        msg: `You can not mark removed students as absent`,
      })
    }
    const selectedNotStartedStudents = (selectedStudentKeys || []).filter(
      (studentId) => {
        const { UTASTATUS } = mapTestActivityByStudId?.[studentId] || {}
        return UTASTATUS === testActivityStatus.NOT_STARTED
      }
    )
    if (selectedNotStartedStudents.length !== selectedStudentKeys.length) {
      const submittedStudents =
        selectedStudentKeys.length - selectedNotStartedStudents.length
      return notification({
        type: 'warn',
        msg: `${submittedStudents} student(s) that you selected have already started the assessment, you will not be allowed to mark as absent.`,
      })
    }
    this.setState({
      showMarkAbsentPopup: true,
      selectedNotStartedStudents,
      modalInputVal: '',
    })
  }

  handleShowRemoveStudentsModal = () => {
    const { selectedStudents, testActivity, assignmentStatus } = this.props

    if (assignmentStatus.toLowerCase() === 'done') {
      return notification({
        type: 'warn',
        msg: 'Cannot remove student(s) from a DONE assignment.',
      })
    }
    const selectedStudentKeys = Object.keys(selectedStudents)
    if (!selectedStudentKeys.length) {
      return notification({
        type: 'warn',
        messageKey: 'atleastOneStudentToRemove',
      })
    }
    const mapTestActivityByStudId = keyBy(testActivity, 'studentId')
    const isRemovedStudentsSelected = (selectedStudentKeys || []).some(
      (item) => mapTestActivityByStudId?.[item]?.isAssigned === false
    )
    if (isRemovedStudentsSelected) {
      return notification({
        type: 'warn',
        msg: 'Cannot remove unassigned students',
      })
    }

    const selectedStudentsEntity = testActivity.filter((item) =>
      selectedStudentKeys.includes(item.studentId)
    )
    const isAnyBodyInProgress = selectedStudentsEntity.some(
      (item) => item.UTASTATUS === testActivityStatus.START
    )
    if (isAnyBodyInProgress) {
      return notification({
        type: 'warn',
        msg: `In progress students can not be removed`,
      })
    }
    const isAnyBodyGraded = selectedStudentsEntity.some(
      (item) =>
        item.UTASTATUS === testActivityStatus.SUBMITTED &&
        item.graded === 'GRADED'
    )
    if (isAnyBodyGraded) {
      return notification({
        type: 'warn',
        messageKey: 'youWillNotAbleToRemove',
      })
    }
    this.setState({ showRemoveStudentsPopup: true, modalInputVal: '' })
  }

  handleRemoveStudents = () => {
    const {
      selectedStudents,
      studentUnselectAll,
      removeStudent,
      match,
      activeAssignedStudents,
    } = this.props
    const { assignmentId, classId } = match.params
    const selectedStudentKeys = Object.keys(selectedStudents)
    const isRemoveAll =
      activeAssignedStudents.filter((item) => !selectedStudents[item._id])
        .length === 0
    if (isRemoveAll) {
      return notification({
        type: 'warn',
        msg: 'Cannot remove all student(s) from assignment.',
      })
    }
    removeStudent(assignmentId, classId, selectedStudentKeys)
    studentUnselectAll()
    this.setState({ showRemoveStudentsPopup: false })
  }

  handleMarkAbsent = () => {
    const { selectedNotStartedStudents } = this.state
    const { markAbsent, match, studentUnselectAll } = this.props
    const { assignmentId, classId } = match.params
    if (!selectedNotStartedStudents.length)
      return notification({ type: 'warn', messageKey: 'noStudentsSelected' })
    markAbsent(assignmentId, classId, selectedNotStartedStudents)
    studentUnselectAll()
    this.setState({ showMarkAbsentPopup: false })
  }

  handleMarkSubmitted = () => {
    const {
      markSubmitted,
      match,
      studentUnselectAll,
      selectedStudents,
    } = this.props
    const { assignmentId, classId } = match.params
    const selectedStudentKeys = Object.keys(selectedStudents)
    if (!selectedStudentKeys.length)
      return notification({ type: 'warn', messageKey: 'noStudentsSelected' })
    markSubmitted(assignmentId, classId, selectedStudentKeys)
    studentUnselectAll()
    this.setState({ showMarkSubmittedPopup: false })
  }

  handleShowAddStudentsPopup = () => {
    const { additionalData, activeAssignedStudents } = this.props
    // total count represents total students count in the class
    if (additionalData.totalCount <= activeAssignedStudents.length) {
      return notification({
        type: 'warn',
        messageKey: 'assessmentAlreadyAssignedToAllStudents',
      })
    }

    this.setState({ showAddStudentsPopup: true })
  }

  handleTogglePauseStudents = (isPause) => () => {
    const {
      pauseStudents,
      match,
      studentUnselectAll,
      selectedStudents,
      assignmentStatus,
      additionalData,
    } = this.props
    const { assignmentId, classId } = match.params
    if (assignmentStatus.toLowerCase() === 'not open') {
      return notification({
        type: 'warn',
        messageKey: 'assignmentIsNotOpenedYet',
      })
    }
    if (additionalData.isPaused) {
      return notification({
        type: 'warn',
        messageKey: 'testPausedByTeacher',
      })
    }
    const selectedStudentKeys = Object.keys(selectedStudents)
    if (!selectedStudentKeys.length)
      return notification({
        type: 'warn',
        messageKey: isPause
          ? 'noStudentSelectedForPause'
          : 'noStudentSelectedForResume',
      })
    studentUnselectAll()
    pauseStudents(assignmentId, classId, selectedStudentKeys, isPause)
  }

  handleHideAddStudentsPopup = () => {
    this.setState({ showAddStudentsPopup: false })
  }

  handleCloseAssignedTutorPopup = () => {
    this.setState({ showAssignedTutors: false })
  }

  handleCancelMarkSubmitted = () => {
    this.setState({ showMarkSubmittedPopup: false })
  }

  handleCancelMarkAbsent = () => {
    this.setState({ showMarkAbsentPopup: false })
  }

  handleCancelRemove = () => {
    this.setState({ showRemoveStudentsPopup: false })
  }

  handleValidateInput = (e) => {
    this.setState({ modalInputVal: e.target.value })
  }

  handleDownloadGrades = (isResponseRequired) => {
    const { downloadGradesResponse, match, selectedStudents } = this.props
    const { assignmentId, classId } = match.params
    const selectedStudentKeys = Object.keys(selectedStudents)
    if (!selectedStudentKeys.length) {
      return notification({
        type: 'warn',
        messageKey: 'aleastOneStudentToDownloadGrades',
      })
    }
    downloadGradesResponse(
      assignmentId,
      classId,
      selectedStudentKeys,
      isResponseRequired
    )
  }

  onClickPrint = (event) => {
    event.preventDefault()

    const { testActivity, selectedStudents } = this.props

    const selectedStudentsKeys = Object.keys(selectedStudents)

    const studentsMap = keyBy(testActivity, 'studentId')

    const isPrintable =
      selectedStudentsKeys.length &&
      !selectedStudentsKeys.some(
        (item) =>
          studentsMap?.[item]?.status === 'notStarted' ||
          studentsMap?.[item]?.status === 'inProgress'
      )

    if (isPrintable && selectedStudentsKeys.length) {
      this.setState({ openPrintModal: true })
    } else if (!selectedStudentsKeys.length) {
      notification({
        messageKey: 'atleastOneStudentShouldBeSelectedToPrintResponse',
      })
    } else {
      notification({
        messageKey: 'youCanOnlyPrintAfterAssignmentBeenSubmited',
      })
    }
  }

  onAssignTutoring = () => {
    const {
      testActivity,
      selectedStudents,
      assignTutorForStudents,
      match,
      additionalData,
      reportStandards,
      studentsList,
      districtId,
      isTutorMeEnabled,
      userEmail,
      userFullName,
    } = this.props
    const selectedStudentsKeys = Object.keys(selectedStudents)
    segmentApi.genericEventTrack('Assign Tutor', { selectedStudentsKeys })
    if (!isTutorMeEnabled) {
      return openTutorMeBusinessPage()
    }
    if (!selectedStudentsKeys.length) {
      return notification({
        messageKey: 'atleastOneStudentShouldBeSelectedToAssignTutoring',
      })
    }
    if (!reportStandards.length) {
      return notification({
        messageKey: 'addStandardsWarning',
      })
    }
    // for now only one student can be selected for assigning tutor so next line works
    const [selectedStudentId] = selectedStudentsKeys
    const testActivitiesByStudentId = keyBy(testActivity, 'studentId')
    const selectedStudent = studentsList.find(
      (student) => student._id === selectedStudentId
    )
    const selectedTestActivity = testActivitiesByStudentId[selectedStudentId]
    if (
      !selectedTestActivity ||
      selectedTestActivity.UTASTATUS !== testActivityStatus.SUBMITTED
    ) {
      return notification({
        messageKey: 'notSubmittedWarning',
      })
    }
    const { assignmentId, classId } = match.params

    // TODO pass to the respective api or sdk
    const { termId, className, testName } = additionalData
    const standardsMasteryData = reportStandards.map((std) => {
      const masterySummary = getPerfomancePercentage(
        [selectedTestActivity],
        std
      )
      const masteryInfo = getMastery(
        additionalData.assignmentMastery,
        masterySummary
      )
      return {
        masteryScore: masterySummary,
        masteryColor: masteryInfo.color,
        standardId: std._id,
        standardIdentifier: std.identifier,
        standardDesc: std.desc,
        domainId: std.tloId,
        domainIdentifier: std.tloIdentifier,
        domainDesc: std.tloDesc,
      }
    })
    invokeTutorMeSDKtoAssignTutor({
      standardsMasteryData,
      selectedStudentDetails: {
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName || '',
        studentId: selectedTestActivity.studentId,
        studentName: selectedTestActivity.studentName,
        email: selectedTestActivity.email,
      },
      assignmentId,
      classId,
      districtId,
      termId,
      className,
      testName,
      assignedBy: {
        assignedByEmail: userEmail,
        assignedByName: userFullName,
      },
    }).then((tutorMeInterventionResponse) =>
      assignTutorForStudents(tutorMeInterventionResponse)
    )
  }

  handleOpenTutor = (studentId, studentName) => {
    this.setState({
      showAssignedTutors: true,
      studentToAssignTutor: {
        studentId,
        studentName,
      },
    })
  }

  closePrintModal = () => this.setState({ openPrintModal: false })

  gotoPrintView = (data) => {
    const { selectedStudents, match } = this.props
    const { assignmentId, classId } = match.params
    const { type, customValue } = data
    const selectedStudentsKeys = Object.keys(selectedStudents)
    const selectedStudentsStr = selectedStudentsKeys.join(',')
    window.open(
      `/author/printpreview/${assignmentId}/${classId}?selectedStudents=${selectedStudentsStr}&type=${type}&qs=${
        type === 'custom' ? customValue : ''
      }`
    )
    this.closePrintModal()
  }

  closeRedirectPopup = (reload = false) => {
    this.setState({ redirectPopup: false })
    if (reload) {
      const { loadTestActivity, match } = this.props
      const { assignmentId, classId } = match.params
      loadTestActivity(assignmentId, classId)
    }
  }

  backTopScroll = () => {
    const { toggleBackTopIcon } = this.state
    const elementTop = this.MainContentWrapperRef?.current?.scrollTop || 0
    if (elementTop < 100 && toggleBackTopIcon) {
      this.setState({ toggleBackTopIcon: false })
    } else if (!toggleBackTopIcon && elementTop >= 100) {
      this.setState({ toggleBackTopIcon: true })
    }
  }

  getActivityId = (_activityId, _studentId) => {
    const { recentAttemptsGrouped, testActivity } = this.props
    const activity =
      testActivity?.find((x) =>
        _activityId
          ? x.testActivityId === _activityId
          : x.studentId === _studentId
      ) || {}
    const { UTASTATUS, redirected, studentId } = activity
    let _testActivityId = activity.testActivityId
    if (
      redirected &&
      (UTASTATUS == testActivityStatus.NOT_STARTED ||
        UTASTATUS == testActivityStatus.ABSENT)
    ) {
      const recentUserActivities = recentAttemptsGrouped[studentId]?.filter(
        (item) => item.status == testActivityStatus.SUBMITTED
      )
      const mostRecent = last(sortBy(recentUserActivities, 'endDate'))
      _testActivityId = mostRecent?._id || _testActivityId
    }
    return _testActivityId
  }

  handleQuestionViewClick = () => {
    const {
      testActivity,
      match,
      history,
      setPageNumber,
      loadTestActivity,
    } = this.props
    const { selectedQuestion, selectedQid, itemId } = this.state
    const { assignmentId, classId } = match.params
    const allUserQuestionActivities = []
    testActivity.forEach(({ questionActivities = [] }) => {
      allUserQuestionActivities.push(
        ...questionActivities.filter((item) => !item.isItemContentHidden)
      )
    })
    const [firstQuestion] = allUserQuestionActivities
    if (!firstQuestion) {
      console.warn('no question activities')
      return
    }
    this.setState({
      selectedQuestion: selectedQuestion || 0,
      selectedQid: selectedQid || firstQuestion._id,
      itemId: itemId || firstQuestion.testItemId,
      selectedTab: 'questionView',
    })
    setPageNumber(1)
    loadTestActivity(assignmentId, classId, true)
    history.push(
      `/author/classboard/${assignmentId}/${classId}/question-activity/${
        selectedQid || firstQuestion._id
      }`
    )
  }

  render() {
    const {
      gradebook,
      testActivity,
      creating,
      match,
      classResponse = {},
      additionalData = {
        classes: [],
      },
      selectedStudents,
      setSelected,
      allStudents,
      testQuestionActivities,
      qActivityByStudent,
      isPresentationMode,
      currentTestActivityId,
      allTestActivitiesForStudent,
      setCurrentTestActivityId,
      studentResponse,
      loadStudentResponses,
      getAllTestActivitiesForStudent,
      enrollmentStatus,
      isItemsVisible,
      studentViewFilter,
      disableMarkSubmitted,
      disableMarkAbsent,
      hasRandomQuestions,
      isLoading,
      actionInProgress,
      t,
      history,
      location,
      isCliUser,
      firstQuestionEntities,
      showCanvasShare,
      canvasSyncAssignment,
      setShowCanvasShare,
      studentsList,
      recentAttemptsGrouped,
      studentsPrevSubmittedUtas,
      studentUnselectAll,
      regradeModalState,
      isDocBasedTest,
      isProxiedByEAAccount,
      userRole,
      userId,
      attemptWindow,
      isTutorMeEnabled,
      isTutorMeVisibleToDistrict,
    } = this.props
    const {
      selectedTab,
      flag,
      selectedQuestion,
      redirectPopup,
      selectedStudentId,
      itemId,
      selectedQid,
      modalInputVal,
      showMarkAbsentPopup,
      showRemoveStudentsPopup,
      showAddStudentsPopup,
      showMarkSubmittedPopup,
      openPrintModal,
      hasStickyHeader,
      toggleBackTopIcon,
      studentFilter,
      showAssignedTutors,
      studentToAssignTutor,
    } = this.state
    const isRedirectButtonDisabled =
      COMMON.includes(additionalData?.testType) &&
      !additionalData?.allowTeacherRedirect &&
      roleuser?.TEACHER === userRole &&
      !(additionalData?.assignedBy?._id === userId)

    const { assignmentId, classId } = match.params
    const studentTestActivity =
      (studentResponse && studentResponse.testActivity) || {}
    const studentResponseUqas = isDocBasedTest
      ? studentResponse?.questionActivities
      : uniqBy(studentResponse?.questionActivities || [], 'testItemId')
    const timeSpent = Math.floor(
      ((studentResponseUqas &&
        studentResponseUqas.reduce((acc, qa) => {
          acc += qa.timeSpent || 0
          return acc
        }, 0)) ||
        0) / 1000
    )
    const { status } = studentTestActivity
    let { score = 0, maxScore = 0 } = studentTestActivity
    const filteredStudentActivities = testActivity.filter(
      filterStudentsByStatus(studentFilter)
    )
    if (
      studentResponse &&
      !isEmpty(studentResponse.questionActivities) &&
      status === 0
    ) {
      studentResponse.questionActivities.forEach((uqa) => {
        score += uqa.score
        maxScore += uqa.maxScore
      })
    }
    const selectedStudentsKeys = Object.keys(selectedStudents)
    let firstStudentId = get(
      testActivity.filter(
        (x) =>
          x.UTASTATUS === testActivityStatus.SUBMITTED ||
          x.UTASTATUS === testActivityStatus.START
      ),
      [0, 'studentId'],
      false
    )

    if (!firstStudentId) {
      firstStudentId = get(
        Object.values(recentAttemptsGrouped).find((x) => x.length > 0),
        [0, 'userId'],
        false
      )
    }
    const testActivityId = this.getTestActivityId(
      testActivity,
      selectedStudentId || firstStudentId
    )

    const unselectedStudents = filteredStudentActivities.filter(
      (x) => !selectedStudents[x.studentId]
    )

    const nobodyStarted =
      testActivity.every(
        ({ UTASTATUS }) =>
          UTASTATUS === testActivityStatus.NOT_STARTED ||
          UTASTATUS === testActivityStatus.ABSENT
      ) &&
      Object.values(recentAttemptsGrouped).every(
        (groupedAttempts) =>
          !groupedAttempts.some(
            ({ status: _status }) => _status !== testActivityStatus.ABSENT
          )
      )

    const disabledList = testActivity
      .filter((student) => {
        const endDate = additionalData.closedDate || additionalData.endDate
        if (
          student.status === 'notStarted' &&
          (endDate < Date.now() || additionalData.closed)
        ) {
          return false
        }
        if (student.status === 'notStarted') {
          return true
        }
        return ['inProgress', 'redirected'].includes(student.status)
      })
      .map((x) => x.studentId)

    const absentList = testActivity
      .filter((student) => {
        const endDate = additionalData.closedDate || additionalData.endDate
        if (
          student.status === 'absent' ||
          (student.status === 'notStarted' &&
            (endDate < Date.now() || additionalData.closed))
        ) {
          return true
        }
        return false
      })
      .map((x) => x.studentId)
    const enableDownload =
      testActivity.some((item) => item.status === 'submitted') && isItemsVisible

    const showResume = testActivity.some((item) => item.isPaused)

    const { showScoreImporvement } = this.state
    const studentFilterCategoryCounts = testActivity
      .map((x) => getStudentFilterCategory(x))
      .reduce((acc, cur) => {
        if (acc[cur]) {
          acc[cur] += 1
        } else {
          acc[cur] = 1
        }
        return acc
      }, {})

    return (
      <div>
        {showCanvasShare && (
          <NotificationComponent
            msg={
              <span>
                Assignment is not available on Canvas to share grades. Click{' '}
                <a
                  onClick={() => {
                    setShowCanvasShare(false)
                    canvasSyncAssignment({ assignmentId, groupId: classId })
                    antNotification.destroy()
                  }}
                >
                  here
                </a>{' '}
                to share the assignment first.
              </span>
            }
            onClose={() => {
              setShowCanvasShare(false)
            }}
            placement="bottomRight"
            duration={0}
            className="notification"
            visibility={showCanvasShare}
          />
        )}
        {showMarkSubmittedPopup && (
          <ConfirmationModal
            title="Mark as Submitted"
            show={showMarkSubmittedPopup}
            onOk={this.handleMarkSubmitted}
            onCancel={this.handleCancelMarkSubmitted}
            inputVal={modalInputVal}
            placeHolder="Type the action"
            onInputChange={this.handleValidateInput}
            expectedVal="SUBMIT"
            bodyText={
              <div>
                The assignment for selected student(s) will be marked as
                &quot;Submitted&quot;.Once you proceed, these students will not
                be able to take the assignment online.If the students have
                answered any questions, their responses will be saved.{' '}
              </div>
            }
            okText="Yes, Submit"
            showConfirmationText
            hideUndoneText
          />
        )}
        {showMarkAbsentPopup && (
          <ConfirmationModal
            title="Mark as Absent"
            show={showMarkAbsentPopup}
            onOk={this.handleMarkAbsent}
            onCancel={this.handleCancelMarkAbsent}
            inputVal={modalInputVal}
            placeHolder="Type the action"
            onInputChange={this.handleValidateInput}
            expectedVal="ABSENT"
            bodyText={
              <span>
                You are about to Mark the selected student(s) as Absent.
                Student&apos;s response if present will be deleted. Do you still
                want to proceed?
              </span>
            }
            okText="Yes, Absent"
          />
        )}
        {showRemoveStudentsPopup && (
          <ConfirmationModal
            title="Unassign Students"
            show={showRemoveStudentsPopup}
            onOk={this.handleRemoveStudents}
            onCancel={this.handleCancelRemove}
            inputVal={modalInputVal}
            placeHolder="Type the action"
            onInputChange={this.handleValidateInput}
            expectedVal="REMOVE"
            hideUndoneText
            bodyText={
              <span>
                You are about to remove the selected student(s) from this
                assignment. The selected student responses will be DELETED and
                this action cannot be undone.
              </span>
            }
            okText="Yes, Remove"
          />
        )}
        {openPrintModal && (
          <PrintTestModal
            onProceed={this.gotoPrintView}
            onCancel={this.closePrintModal}
            currentTestId={additionalData.testId}
            assignmentId={assignmentId}
          />
        )}
        {selectedTab === 'Both' && studentsList.length && (
          <HooksContainer
            additionalData={additionalData}
            classId={classId}
            assignmentId={assignmentId}
            studentsList={studentsList}
            selectedTab={selectedTab}
          />
        )}
        {!isEmpty(regradeModalState) && <RegradeModal />}
        <ClassHeader
          classId={classId}
          active="classboard"
          creating={creating}
          onCreate={this.handleCreate}
          assignmentId={assignmentId}
          additionalData={additionalData}
          testActivityId={testActivityId}
          selectedStudentsKeys={selectedStudentsKeys}
          resetView={this.resetView}
          onStudentReportCardsClick={this.onStudentReportCardsClick}
          testActivity={testActivity}
          isCliUser={isCliUser}
        />
        <MainContentWrapper
          ref={this.MainContentWrapperRef}
          onScroll={this.backTopScroll}
          id="classboard-main-container"
        >
          <LCBScrollContext.Provider value={this.MainContentWrapperRef}>
            <StyledFlexContainer justifyContent="space-between">
              <ClassBreadBrumb
                breadCrumb={location?.state?.breadCrumb}
                isCliUser={isCliUser}
                fromUrl={location?.state?.from}
              />
              {!isCliUser && (
                <StudentButtonDiv xs={24} md={16} data-cy="studentnQuestionTab">
                  <PresentationToggleSwitch groupId={classId} />
                  <BothButton
                    disabled={isLoading}
                    style={{ marginLeft: '20px' }}
                    active={selectedTab === 'Both'}
                    onClick={(e) => this.onTabChange(e, 'Both')}
                  >
                    CARD VIEW
                  </BothButton>
                  <WithDisableMessage
                    disabled={!isItemsVisible}
                    errMessage={t('common.testHidden')}
                  >
                    <StudentButton
                      disabled={nobodyStarted || !isItemsVisible || isLoading}
                      active={selectedTab === 'Student'}
                      onClick={(e) => {
                        const _testActivityId = this.getActivityId(
                          null,
                          selectedStudentId || firstStudentId
                        )
                        setCurrentTestActivityId(_testActivityId)
                        if (!isItemsVisible) {
                          return
                        }
                        getAllTestActivitiesForStudent({
                          studentId: selectedStudentId || firstStudentId,
                          assignmentId,
                          groupId: classId,
                        })
                        this.onTabChange(
                          e,
                          'Student',
                          selectedStudentId || firstStudentId,
                          _testActivityId
                        )
                      }}
                    >
                      STUDENTS
                    </StudentButton>
                  </WithDisableMessage>
                  <WithDisableMessage
                    disabled={hasRandomQuestions || !isItemsVisible}
                    errMessage={
                      hasRandomQuestions
                        ? t('common.randomItemsDisableMessage')
                        : t('common.testHidden')
                    }
                  >
                    <QuestionButton
                      active={selectedTab === 'questionView'}
                      disabled={
                        nobodyStarted ||
                        !isItemsVisible ||
                        hasRandomQuestions ||
                        isLoading
                      }
                      onClick={this.handleQuestionViewClick}
                    >
                      QUESTIONS
                    </QuestionButton>
                  </WithDisableMessage>
                </StudentButtonDiv>
              )}
            </StyledFlexContainer>
            <EduIf
              condition={additionalData?.isDataMovedToArchivedDB && !isLoading}
            >
              <TagWrapper>
                <CustomNotificationBar textColor={red} textAlign="center">
                  {t('common.uqaArchiveMessage')}
                </CustomNotificationBar>
              </TagWrapper>
            </EduIf>

            {selectedTab === 'Both' && (
              <>
                <GraphContainer>
                  <StyledCard bordered={false}>
                    <Graph
                      gradebook={gradebook}
                      title={additionalData.testName}
                      testActivity={testActivity}
                      testQuestionActivities={testQuestionActivities}
                      onClickHandler={this.onClickBarGraph}
                      isLoading={isLoading}
                      isBoth
                    />
                  </StyledCard>
                </GraphContainer>
                <StickyFlex
                  justifyContent="space-between"
                  hasStickyHeader={hasStickyHeader}
                  className="lcb-student-sticky-bar"
                >
                  <div>
                    <CheckboxLabel
                      data-cy="selectAllCheckbox"
                      checked={unselectedStudents.length === 0}
                      indeterminate={
                        unselectedStudents.length > 0 &&
                        unselectedStudents.length <
                          filteredStudentActivities.length
                      }
                      onChange={this.onSelectAllChange}
                    >
                      {unselectedStudents.length > 0
                        ? 'SELECT ALL'
                        : 'UNSELECT ALL'}
                    </CheckboxLabel>
                    <SwitchBox style={{ position: 'relative' }}>
                      <FilterSpan>FILTER BY STATUS</FilterSpan>
                      <FilterSelect
                        data-cy="filterByStatus"
                        className="student-status-filter"
                        value={studentFilter}
                        dropdownMenuStyle={{ fontSize: 29 }}
                        getPopupContainer={(trigger) => trigger.parentElement}
                        onChange={(v) => {
                          studentUnselectAll()
                          this.setState({ studentFilter: v })
                        }}
                        width="170px"
                        height="24px"
                      >
                        {[
                          'ALL ASSIGNED',
                          'NOT STARTED',
                          'IN PROGRESS',
                          'SUBMITTED',
                          'GRADED',
                          'ABSENT',
                          'PAUSED',
                          'REDIRECTED',
                          'UNASSIGNED',
                          'NOT ENROLLED',
                        ].map((x) => (
                          <FilterSelect.Option
                            className="student-status-filter-item"
                            key={x}
                            value={x}
                            style={{ fontSize: 11 }}
                          >
                            {capitalizeIt(x)} (
                            {x === 'ALL ASSIGNED'
                              ? testActivity.filter(
                                  ({ isAssigned, isEnrolled, archived }) =>
                                    isAssigned &&
                                    studentIsEnrolled({
                                      isEnrolled,
                                      enrollmentStatus,
                                      archived,
                                    })
                                ).length
                              : studentFilterCategoryCounts[x] || 0}
                            )
                          </FilterSelect.Option>
                        ))}
                      </FilterSelect>
                    </SwitchBox>
                  </div>
                  <EduIf condition={attemptWindow}>
                    <InfoMessage color={lightGreen4}>
                      <IconInfo fill={green} height={10} /> {attemptWindow}
                    </InfoMessage>
                  </EduIf>
                  <div style={{ display: 'flex' }}>
                    {isTutorMeVisibleToDistrict && (
                      <Tooltip
                        placement="top"
                        title={
                          selectedStudentsKeys.length > 1 && isTutorMeEnabled
                            ? t('common.assignTutoringRestricted')
                            : ''
                        }
                      >
                        <div>
                          <AssignTutoring
                            disabled={
                              selectedStudentsKeys.length > 1 &&
                              isTutorMeEnabled
                            }
                            data-cy="assignTutoring"
                            target="_blank"
                            onClick={this.onAssignTutoring}
                          >
                            ASSIGN TUTORING
                          </AssignTutoring>
                        </div>
                      </Tooltip>
                    )}

                    <ClassBoardFeats>
                      <RedirectButton
                        disabled={!isItemsVisible}
                        first
                        data-cy="printButton"
                        target="_blank"
                        onClick={this.onClickPrint}
                      >
                        <ButtonIconWrap>
                          <IconPrint />
                        </ButtonIconWrap>
                        PRINT
                      </RedirectButton>
                      <Tooltip
                        placement="top"
                        title={
                          isRedirectButtonDisabled
                            ? 'Redirect is not permitted'
                            : ''
                        }
                      >
                        <div>
                          <RedirectButton
                            data-cy="rediectButton"
                            onClick={this.handleRedirect}
                            disabled={isRedirectButtonDisabled}
                          >
                            <ButtonIconWrap>
                              <IconRedirect />
                            </ButtonIconWrap>
                            REDIRECT
                          </RedirectButton>
                        </div>
                      </Tooltip>
                      <Dropdown
                        getPopupContainer={(triggerNode) => {
                          return triggerNode.parentNode
                        }}
                        overlay={
                          <DropMenu>
                            <FeaturesSwitch
                              inputFeatures="LCBmarkAsSubmitted"
                              key="LCBmarkAsSubmitted"
                              actionOnInaccessible="hidden"
                              groupId={classId}
                            >
                              <MenuItems
                                data-cy="markSubmitted"
                                disabled={disableMarkSubmitted}
                                onClick={this.handleShowMarkAsSubmittedModal}
                              >
                                <IconMarkAsSubmitted width={12} />
                                <span>Mark as Submitted</span>
                              </MenuItems>
                            </FeaturesSwitch>
                            <FeaturesSwitch
                              inputFeatures="LCBmarkAsAbsent"
                              key="LCBmarkAsAbsent"
                              actionOnInaccessible="hidden"
                              groupId={classId}
                            >
                              <MenuItems
                                data-cy="markAbsent"
                                disabled={disableMarkAbsent}
                                onClick={this.handleShowMarkAsAbsentModal}
                              >
                                <IconMarkAsAbsent />
                                <span>Mark as Absent</span>
                              </MenuItems>
                            </FeaturesSwitch>

                            <MenuItems
                              data-cy="addStudents"
                              disabled={actionInProgress}
                              onClick={this.handleShowAddStudentsPopup}
                            >
                              <IconAddStudents />
                              <span>Add Students</span>
                            </MenuItems>
                            <MenuItems
                              data-cy="removeStudents"
                              onClick={this.handleShowRemoveStudentsModal}
                            >
                              <IconRemove />
                              <span>Unassign Students</span>
                            </MenuItems>
                            <FeaturesSwitch
                              inputFeatures="premium"
                              actionOnInaccessible="hidden"
                              groupId={classId}
                            >
                              <MenuItems
                                data-cy="pauseStudents"
                                onClick={this.handleTogglePauseStudents(true)}
                                disabled={disableMarkAbsent}
                              >
                                <IconPause />
                                <span>Pause Students</span>
                              </MenuItems>
                            </FeaturesSwitch>
                            {showResume && (
                              <MenuItems
                                data-cy="resumeStudents"
                                onClick={this.handleTogglePauseStudents(false)}
                                disabled={disableMarkAbsent}
                              >
                                <IconPlay />
                                <span>Resume Students</span>
                              </MenuItems>
                            )}
                            <MenuItems
                              data-cy="downloadGrades"
                              disabled={!enableDownload || isProxiedByEAAccount}
                              title={
                                isProxiedByEAAccount
                                  ? 'Bulk action disabled for EA proxy accounts.'
                                  : ''
                              }
                              onClick={() => this.handleDownloadGrades(false)}
                            >
                              <IconDownload />
                              <span>Download Grades</span>
                            </MenuItems>
                            <MenuItems
                              data-cy="downloadResponse"
                              disabled={!enableDownload || isProxiedByEAAccount}
                              title={
                                isProxiedByEAAccount
                                  ? 'Bulk action disabled for EA proxy accounts.'
                                  : ''
                              }
                              onClick={() => this.handleDownloadGrades(true)}
                            >
                              <IconDownload
                                color={
                                  isProxiedByEAAccount ? lightFadedBlack : null
                                }
                              />
                              <span>Download Response</span>
                            </MenuItems>
                          </DropMenu>
                        }
                        placement="bottomRight"
                      >
                        <RedirectButton data-cy="moreAction" last>
                          <ButtonIconWrap className="more">
                            <IconMoreHorizontal />
                          </ButtonIconWrap>
                          MORE
                        </RedirectButton>
                      </Dropdown>
                    </ClassBoardFeats>
                  </div>
                </StickyFlex>
                <div ref={this.disneyCardsContainerRef}>
                  {flag ? (
                    <DisneyCardContainer
                      selectedStudents={selectedStudents}
                      testActivity={filteredStudentActivities}
                      assignmentId={assignmentId}
                      classId={classId}
                      studentSelect={this.onSelectCardOne}
                      endDate={
                        additionalData.endDate || additionalData.closedDate
                      }
                      dueDate={additionalData.dueDate}
                      closed={additionalData.closed}
                      detailedClasses={additionalData.detailedClasses}
                      studentUnselect={this.onUnselectCardOne}
                      handleOpenTutor={this.handleOpenTutor}
                      viewResponses={(e, selected, _testActivityId) => {
                        setCurrentTestActivityId(_testActivityId)
                        if (!isItemsVisible) {
                          return
                        }
                        getAllTestActivitiesForStudent({
                          studentId: selected,
                          assignmentId,
                          groupId: classId,
                        })
                        this.onTabChange(
                          e,
                          'Student',
                          selected,
                          _testActivityId
                        )
                      }}
                      isPresentationMode={isPresentationMode}
                      enrollmentStatus={enrollmentStatus}
                    />
                  ) : (
                    <Score
                      gradebook={gradebook}
                      assignmentId={assignmentId}
                      classId={classId}
                    />
                  )}
                </div>

                {redirectPopup && (
                  <RedirectPopup
                    open={redirectPopup}
                    allStudents={allStudents}
                    disabledList={disabledList}
                    absentList={absentList}
                    selectedStudents={selectedStudents}
                    additionalData={additionalData}
                    enrollmentStatus={enrollmentStatus}
                    closePopup={this.closeRedirectPopup}
                    setSelected={setSelected}
                    assignmentId={assignmentId}
                    groupId={classId}
                    testActivity={testActivity}
                  />
                )}
                {showAddStudentsPopup && (
                  <AddStudentsPopup
                    open={showAddStudentsPopup}
                    groupId={classId}
                    closePolicy={additionalData.closePolicy}
                    classEndDate={
                      additionalData.dueDate
                        ? additionalData.dueDate
                        : additionalData.endDate
                    }
                    serverTimeStamp={additionalData.ts}
                    assignmentId={assignmentId}
                    closePopup={this.handleHideAddStudentsPopup}
                  />
                )}
                <TutorDetailsPopup
                  open={showAssignedTutors}
                  selectedStudent={studentToAssignTutor}
                  closePopup={this.handleCloseAssignedTutorPopup}
                />
              </>
            )}

            {selectedTab === 'Student' &&
              selectedStudentId &&
              !isEmpty(testActivity) &&
              !isEmpty(classResponse) && (
                <>
                  <StudentGrapContainer>
                    <StyledCard bordered={false} paddingTop={15}>
                      <StudentSelect
                        dataCy="dropDownSelect"
                        style={{ width: '200px' }}
                        students={testActivity}
                        selectedStudent={selectedStudentId}
                        studentResponse={qActivityByStudent}
                        handleChange={(value, _activityId) => {
                          const _testActivityId = this.getActivityId(
                            _activityId
                          )
                          setCurrentTestActivityId(_testActivityId)
                          getAllTestActivitiesForStudent({
                            studentId: value,
                            assignmentId,
                            groupId: classId,
                          })
                          this.setState({ selectedStudentId: value })
                          history.push(
                            `/author/classboard/${assignmentId}/${classId}/test-activity/${_testActivityId}`
                          )
                        }}
                        isPresentationMode={isPresentationMode}
                        isCliUser={isCliUser}
                        studentsPrevSubmittedUtas={studentsPrevSubmittedUtas}
                      />
                      <GraphWrapper style={{ width: '100%', display: 'flex' }}>
                        <BarGraph
                          gradebook={gradebook}
                          testActivity={testActivity}
                          studentId={selectedStudentId}
                          studentview
                          studentViewFilter={studentViewFilter}
                          studentResponse={studentResponse}
                          isLoading={isLoading}
                        />
                        <InfoWrapper>
                          {allTestActivitiesForStudent.length > 1 && (
                            <Select
                              data-cy="attemptSelect"
                              style={{ width: '200px' }}
                              value={
                                allTestActivitiesForStudent.some(
                                  ({ _id }) =>
                                    _id ===
                                    (currentTestActivityId || testActivityId)
                                )
                                  ? currentTestActivityId || testActivityId
                                  : ''
                              }
                              onChange={(_testActivityId) => {
                                loadStudentResponses({
                                  testActivityId: _testActivityId,
                                  groupId: classId,
                                  studentId: selectedStudentId,
                                })
                                setCurrentTestActivityId(_testActivityId)
                                history.push(
                                  `/author/classboard/${assignmentId}/${classId}/test-activity/${_testActivityId}`
                                )
                              }}
                            >
                              {[...allTestActivitiesForStudent]
                                .reverse()
                                .map((_testActivity, index) => (
                                  <Select.Option
                                    key={index}
                                    value={_testActivity._id}
                                    disabled={_testActivity.status === 2}
                                  >
                                    {`Attempt ${
                                      allTestActivitiesForStudent.length - index
                                    } ${
                                      _testActivity.status === 2
                                        ? ' (Absent)'
                                        : ''
                                    }`}
                                  </Select.Option>
                                ))}
                            </Select>
                          )}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '10px',
                                alignItems: 'center',
                              }}
                            >
                              <ScoreHeader>TOTAL SCORE</ScoreHeader>
                              <ScoreWrapper data-cy="totalScore">
                                {round(score, 2) || 0}
                              </ScoreWrapper>
                              <div
                                style={{
                                  border: 'solid 1px black',
                                  width: '50px',
                                }}
                              />
                              <ScoreWrapper data-cy="totalMaxScore">
                                {round(maxScore, 2) || 0}
                              </ScoreWrapper>
                            </div>
                            {allTestActivitiesForStudent.length > 1 &&
                            showScoreImporvement ? (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  padding: '10px',
                                  alignItems: 'center',
                                }}
                              >
                                <ScoreHeader>SCORE</ScoreHeader>
                                <ScoreChangeWrapper
                                  data-cy="scoreChange"
                                  scoreChange={studentTestActivity.scoreChange}
                                >
                                  {`${
                                    studentTestActivity.scoreChange > 0
                                      ? '+'
                                      : ''
                                  }${
                                    round(studentTestActivity.scoreChange, 2) ||
                                    0
                                  }`}
                                </ScoreChangeWrapper>
                                <ScoreHeader
                                  style={{ fontSize: '10px', display: 'flex' }}
                                >
                                  <span>Improvement </span>
                                  <span
                                    style={{ marginLeft: '2px' }}
                                    title="Score increase from previous student attempt. Select an attempt from the dropdown above to view prior student responses"
                                  >
                                    <IconInfo />
                                  </span>
                                </ScoreHeader>
                              </div>
                            ) : null}
                          </div>
                          <ScoreHeader
                            data-cy="totlatTimeSpent"
                            style={{ fontSize: '12px' }}
                          >
                            {' '}
                            {`TIME (min) : `}{' '}
                            <span
                              style={{
                                color: black,
                                textTransform: 'capitalize',
                              }}
                            >
                              {`${Math.floor(timeSpent / 60)}:${
                                timeSpent % 60
                              }` || ''}
                            </span>
                          </ScoreHeader>
                          <ScoreHeader
                            data-cy="studentStatus"
                            style={{ fontSize: '12px' }}
                          >
                            {' '}
                            {`STATUS : `}{' '}
                            <span
                              style={{
                                color: black,
                                textTransform: 'capitalize',
                              }}
                            >
                              {studentTestActivity.status === 2
                                ? 'Absent'
                                : studentTestActivity.status === 1
                                ? studentTestActivity.graded === 'GRADED'
                                  ? 'Graded'
                                  : 'Submitted'
                                : 'In Progress' || ''}
                            </span>
                          </ScoreHeader>
                          <ScoreHeader
                            data-cy="submittedDate"
                            style={{ fontSize: '12px' }}
                          >
                            SUBMITTED ON :
                            <span style={{ color: black }}>
                              {getSubmittedDate(
                                studentTestActivity.endDate,
                                additionalData.endDate
                              )}
                            </span>
                          </ScoreHeader>
                        </InfoWrapper>
                      </GraphWrapper>
                    </StyledCard>
                  </StudentGrapContainer>
                  <StudentContainer
                    classResponse={classResponse}
                    studentItems={testActivity}
                    selectedStudent={selectedStudentId}
                    isPresentationMode={isPresentationMode}
                    isCliUser={isCliUser}
                    MainContentWrapperRef={this.MainContentWrapperRef}
                  />
                  {toggleBackTopIcon && (
                    <BackTop toggleBackTopIcon={toggleBackTopIcon} />
                  )}
                </>
              )}
            {selectedTab === 'questionView' &&
              !isEmpty(testActivity) &&
              !isEmpty(classResponse) &&
              !isLoading &&
              (selectedQuestion || selectedQuestion === 0) && (
                <>
                  <QuestionContainer
                    isQuestionView
                    classResponse={classResponse}
                    testActivity={testActivity}
                    qIndex={selectedQuestion}
                    itemId={itemId}
                    question={{ id: selectedQid }}
                    isPresentationMode={isPresentationMode}
                  >
                    <GenSelect
                      dataCy="dropDownSelect"
                      classid="DI"
                      classname={
                        firstQuestionEntities.map((x, index) => ({
                          value: index,
                          name: `Question ${x?.barLabel?.slice(1)}`,
                        })) // filtering after map to get the correct index value
                      }
                      selected={selectedQuestion}
                      justifyContent="flex-end"
                      handleChange={(value) => {
                        const {
                          assignmentId: _assignmentId,
                          classId: _classId,
                        } = match.params

                        const { _id: qid, testItemId } = firstQuestionEntities[
                          value
                        ]
                        history.push(
                          `/author/classboard/${_assignmentId}/${_classId}/question-activity/${qid}${
                            isCliUser ? '?cliUser=true' : ''
                          }`
                        )
                        this.setState({
                          selectedQuestion: value,
                          selectedQid: qid,
                          itemId: testItemId,
                        })
                      }}
                    />
                    {toggleBackTopIcon && (
                      <BackTop toggleBackTopIcon={toggleBackTopIcon} />
                    )}
                  </QuestionContainer>
                </>
              )}
          </LCBScrollContext.Provider>
        </MainContentWrapper>
      </div>
    )
  }
}

const enhance = compose(
  withNamespaces('classBoard'),
  connect(
    (state) => ({
      gradebook: getGradeBookSelector(state),
      testActivity: getSortedTestActivitySelector(state),
      classResponse: getClassResponseSelector(state),
      additionalData: getAdditionalDataSelector(state),
      testQuestionActivities: getTestQuestionActivitiesSelector(state),
      selectedStudents: get(
        state,
        ['author_classboard_gradebook', 'selectedStudents'],
        {}
      ),
      showCanvasShare: get(
        state,
        ['author_classboard_gradebook', 'showCanvasShare'],
        false
      ),
      allStudents: getLCBStudentsList(state),
      testItemsData: get(
        state,
        ['author_classboard_testActivity', 'data', 'testItemsData'],
        []
      ),
      studentResponse: getStudentResponseSelector(state),
      qActivityByStudent: stateStudentResponseSelector(state),
      showScore: showScoreSelector(state),
      currentTestActivityId: getCurrentTestActivityIdSelector(state),
      allTestActivitiesForStudent: getAllTestActivitiesForStudentSelector(
        state
      ),
      disableMarkSubmitted: getDisableMarkAsSubmittedSelector(state),
      disableMarkAbsent: getDisableMarkAsAbsentSelector(state),
      assignmentStatus: getAssignmentStatusSelector(state),
      enrollmentStatus: getEnrollmentStatus(state),
      isPresentationMode: get(
        state,
        ['author_classboard_testActivity', 'presentationMode'],
        false
      ),
      isItemsVisible: isItemVisibiltySelector(state),
      removedStudents: removedStudentsSelector(state),
      studentViewFilter:
        state?.author_classboard_testActivity?.studentViewFilter,
      hasRandomQuestions: getHasRandomQuestionselector(state),
      isLoading: testActivtyLoadingSelector(state),
      actionInProgress: actionInProgressSelector(state),
      isCliUser: get(state, 'user.isCliUser', false),
      isShowAllStudents: get(
        state,
        ['author_classboard_testActivity', 'isShowAllStudents'],
        false
      ),
      emailVerified: getEmailVerified(state),
      verificationTS: getVerificationTS(state),
      isDefaultDA: isDefaultDASelector(state),
      isProxiedByEAAccount: getIsProxiedByEAAccountSelector(state),
      userRole: get(state.user, 'user.role', null),
      activeAssignedStudents: getActiveAssignedStudents(state),
      firstQuestionEntities: getFirstQuestionEntitiesSelector(state),
      studentsList: getAllStudentsList(state),
      recentAttemptsGrouped:
        state?.author_classboard_testActivity?.data
          ?.recentTestActivitiesGrouped || {},
      studentsPrevSubmittedUtas: getStudentsPrevSubmittedUtasSelector(state),
      isFreeAdmin: isFreeAdminSelector(state),
      isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
      regradeModalState: getRegradeModalStateSelector(state),
      isDocBasedTest: getIsDocBasedTestSelector(state),
      userId: getUserId(state),
      attemptWindow: getAttemptWindowSelector(state),
      isContentHidden: getIsItemContentHiddenSelector(state),
      reportStandards: state.classResponse?.data?.reportStandards || [],
      isTutorMeEnabled: getIsTutorMeEnabledSelector(state),
      districtId: getUserOrgId(state),
      isTutorMeVisibleToDistrict: getIsTutorMeVisibleToDistrictSelector(state),
      userEmail: getUserEmailSelector(state),
      userFullName: getUserFullNameSelector(state),
    }),
    {
      loadTestActivity: receiveTestActivitydAction,
      loadStudentResponses: receiveStudentResponseAction,
      studentSelect: gradebookSelectStudentAction,
      studentUnselect: gradebookUnSelectStudentAction,
      getAllTestActivitiesForStudent: getAllTestActivitiesForStudentAction,
      setCurrentTestActivityId: setCurrentTestActivityIdAction,
      studentUnselectAll: gradebookUnSelectAllAction,
      setSelected: gradebookSetSelectedAction,
      setReleaseScore: releaseScoreAction,
      setMarkAsDone: markAsDoneAction,
      markAbsent: markAbsentAction,
      removeStudent: removeStudentAction,
      markSubmitted: markSubmittedAction,
      downloadGradesResponse: downloadGradesResponseAction,
      setShowAllStudents: setShowAllStudentsAction,
      updateCliUser: updateCliUserAction,
      canvasSyncAssignment: canvasSyncAssignmentAction,
      setShowCanvasShare: setShowCanvasShareAction,
      pauseStudents: togglePauseStudentsAction,
      toggleAdminAlertModal: toggleAdminAlertModalAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
      setPageNumber: setPageNumberAction,
      assignTutorForStudents: tutorMeActions.assignTutorRequest,
      fetchInterventionsList: actions.getInterventionsList,
    }
  )
)

export default enhance(ClassBoard)

/* eslint-disable react/require-default-props */
ClassBoard.propTypes = {
  gradebook: PropTypes.object,
  classResponse: PropTypes.object,
  additionalData: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  loadTestActivity: PropTypes.func,
  creating: PropTypes.object,
  testActivity: PropTypes.array,
  // t: PropTypes.func,
  studentSelect: PropTypes.func.isRequired,
  studentUnselectAll: PropTypes.func.isRequired,
  allStudents: PropTypes.array,
  selectedStudents: PropTypes.object,
  studentUnselect: PropTypes.func,
  setSelected: PropTypes.func,
  setReleaseScore: PropTypes.func,
  showScore: PropTypes.func,
  setMarkAsDone: PropTypes.func,
  isPresentationMode: PropTypes.bool,
  testQuestionActivities: PropTypes.array,
  qActivityByStudent: PropTypes.any,
}
