import { useMemo } from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import useInterval from '@use-it/interval'
import { assignmentPolicyOptions as Policies } from '@edulastic/constants'
import { notification } from '@edulastic/common'
import {
  realtimeGradebookActivityAddAction,
  realtimeGradebookActivitySubmitAction,
  // realtimeGradebookQuestionAddMaxScoreAction,
  // realtimeGradebookQuestionsRemoveAction,
  realtimeGradebookRedirectAction,
  // realtimeGradebookCloseAction,
  // realtimeUpdateAssignmentAction,
  recalculateAdditionalDataAction,
} from '../../../src/reducers/testActivity'
import useRealtimeUpdates from '../../useRealtimeUpdates'
import {
  receiveAnswersAction,
  receiveStudentResponseAction,
  receiveTestActivityRealTimeAction,
  setCurrentTestActivityIdAction,
  setRealTimeAttemptDataAction,
  setUpdateActivityIdInEntityAction,
} from '../../../src/actions/classBoard'
import { getFirstQuestionEntitiesSelector, testNameSelector } from '../../ducks'
import { getFormattedName } from '../../../Gradebook/transformers'

const needRealtimeDateTracking = ({
  openPolicy,
  closePolicy,
  startDate,
  endDate,
}) => {
  const now = Date.now()
  const openingTimeFromNowInHours = (startDate - now) / (1000 * 60 * 60)
  const closingTimeFromNowInHours = (endDate - now) / (1000 * 60 * 60)
  if (
    openPolicy === Policies.POLICY_AUTO_ON_STARTDATE &&
    openingTimeFromNowInHours > 0 &&
    openingTimeFromNowInHours <= 24
  ) {
    return true
  }
  if (
    closePolicy === Policies.POLICY_AUTO_ON_DUEDATE &&
    closingTimeFromNowInHours > 0 &&
    closingTimeFromNowInHours <= 24
  ) {
    return true
  }
  return false
}

const getStudentName = (studentsList, studentId) => {
  if (!studentsList.length) {
    return ''
  }
  const student = studentsList.find((item) => item._id === studentId)
  const { firstName = '', middleName = '', lastName = '' } = student
  const studentName = getFormattedName(firstName, middleName, lastName)
  return studentName
}

const Shell = ({
  addActivity,
  classId,
  assignmentId,
  loadTestActivity,
  submitActivity,
  setRealTimeAttemptData,
  recalculateAssignment,
  additionalData,
  selectedTab,
  testName,
  studentsList,
  loadStudentResponses,
  setCurrentTestActivityId,
  loadClassQuestionResponses,
  testActivityId,
  itemId,
  qid,
  isEG,
  history,
  setUpdateActivityIdInEntity,
  firstQuestionEntities,
}) => {
  const reloadLCB = () => {
    loadTestActivity({ assignmentId, classId, loader: !isEG })
  }

  const { openPolicy, closePolicy, startDate, endDate } = additionalData || {}

  const dateTrackingNeeded = useMemo(
    () =>
      needRealtimeDateTracking({ openPolicy, closePolicy, startDate, endDate }),
    [openPolicy, closePolicy, startDate, endDate]
  )

  useInterval(() => {
    if (dateTrackingNeeded) {
      recalculateAssignment()
    }
  }, 60 * 1000)

  const languagePreferenceSwitched = (payload) => {
    const { newActivityId, oldActivityId, userId } = payload
    if (!newActivityId || !oldActivityId || !userId || isEG) {
      return
    }

    const studentName = getStudentName(studentsList, userId)
    if (selectedTab === 'Both') {
      loadTestActivity({ assignmentId, classId })
    }
    if (selectedTab === 'Student' && testActivityId === oldActivityId) {
      setUpdateActivityIdInEntity({ oldActivityId, newActivityId })
      setCurrentTestActivityId(newActivityId)
      loadStudentResponses({
        testActivityId: newActivityId,
        groupId: classId,
        studentId: userId,
      })
      history.push(
        `/author/classboard/${assignmentId}/${classId}/test-activity/${newActivityId}`
      )
    }
    if (selectedTab === 'questionView') {
      const questionIds =
        firstQuestionEntities.find((entity) => entity._id === qid)?.qids || []
      loadTestActivity({ assignmentId, classId, isQuestionsView: true })
      loadClassQuestionResponses(
        assignmentId,
        classId,
        qid,
        itemId,
        questionIds
      )
    }
    notification({
      msg: `student ${studentName} had switched the preferred language for the assignment ${testName}`,
    })
  }
  useRealtimeUpdates(`gradebook:${classId}:${assignmentId}`, {
    addActivity,
    addItem: setRealTimeAttemptData,
    submitActivity,
    redirect: () => {
      if (!isEG) {
        reloadLCB()
      }
    },
    // "assignment:close": closeAssignment,
    assignment: reloadLCB,
    languagePreferenceSwitched,
    // TODO: need to comeback to it when we need to handle realtime impact of regrading
    // removeQuestions,
    // addQuestionsMaxScore
  })

  return null
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      testName: testNameSelector(state),
      firstQuestionEntities: getFirstQuestionEntitiesSelector(state),
    }),
    {
      addActivity: realtimeGradebookActivityAddAction,
      setRealTimeAttemptData: setRealTimeAttemptDataAction,
      submitActivity: realtimeGradebookActivitySubmitAction,
      loadTestActivity: receiveTestActivityRealTimeAction,
      redirect: realtimeGradebookRedirectAction,
      recalculateAssignment: recalculateAdditionalDataAction,
      loadStudentResponses: receiveStudentResponseAction,
      setCurrentTestActivityId: setCurrentTestActivityIdAction,
      loadClassQuestionResponses: receiveAnswersAction,
      setUpdateActivityIdInEntity: setUpdateActivityIdInEntityAction,
    }
  )
)(Shell)
