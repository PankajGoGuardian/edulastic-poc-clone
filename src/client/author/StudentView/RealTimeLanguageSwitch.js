import { connect } from 'react-redux'
import { useRealtimeV2, notification } from '@edulastic/common'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import {
  receiveAnswersAction,
  receiveStudentResponseAction,
  receiveTestActivitydAction,
  setCurrentTestActivityIdAction,
} from '../src/actions/classBoard'
import {
  getAllStudentsList,
  getStudentResponseLoadingSelector,
  testNameSelector,
} from '../ClassBoard/ducks'
import { getFormattedName } from '../Gradebook/transformers'

const RealTimeLanguageSwitch = ({
  groupId,
  assignmentId,
  testActivityIds = [],
  loadStudentResponses,
  history,
  setCurrentTestActivityId,
  studentView,
  studentResponseLoading,
  studentsList,
  testName,
  itemId,
  qid,
  questionView,
  loadClassQuestionResponses,
  loadTestActivity,
}) => {
  const topics = testActivityIds.length
    ? testActivityIds.map(
        (testActivityId) =>
          `gradebook:${groupId}:${assignmentId}:${testActivityId}`
      )
    : []

  useRealtimeV2(topics, {
    languagePreferenceSwitched: (payload) => {
      const { newActivityId, oldActivityId, userId } = payload
      if(!newActivityId || !oldActivityId || !userId){
        return
      }
      const student = studentsList.find((item) => item._id === userId)
      const { firstName = '', middleName = '', lastName = '' } = student
      const studentName = getFormattedName(firstName, middleName, lastName)
      if (
        studentView &&
        !studentResponseLoading &&
        oldActivityId !== newActivityId
      ) {
        notification({
          msg: `student ${studentName} had switched the preferred language for the assignment ${testName}`,
        })
        setCurrentTestActivityId(newActivityId)
        loadStudentResponses({
          testActivityId: newActivityId,
          groupId,
          studentId: userId,
        })
        history.push(
          `/author/classboard/${assignmentId}/${groupId}/test-activity/${newActivityId}`
        )
      }
      if (
        questionView &&
        !studentResponseLoading &&
        oldActivityId !== newActivityId
      ) {
        notification({
          msg: `student ${studentName} had switched the preferred language for the assignment ${testName}`,
        })
        loadTestActivity(assignmentId, groupId, true)
        loadClassQuestionResponses(assignmentId, groupId, qid, itemId)
      }
    },
  })

  return null
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      studentResponseLoading: getStudentResponseLoadingSelector(state),
      studentsList: getAllStudentsList(state),
      testName: testNameSelector(state),
    }),
    {
      loadStudentResponses: receiveStudentResponseAction,
      setCurrentTestActivityId: setCurrentTestActivityIdAction,
      loadClassQuestionResponses: receiveAnswersAction,
      loadTestActivity: receiveTestActivitydAction,
    }
  )
)
export default enhance(RealTimeLanguageSwitch)
