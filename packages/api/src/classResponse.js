import API from './utils/API'

const api = new API()

const classResponse = ({ testId, classId, assignmentId }) =>
  api
    .callApi({
      url: `/test/${testId}/minimal?validation=true&data=true${
        classId ? `&groupId=${classId}` : ''
      }${assignmentId ? `&assignmentId=${assignmentId}` : ''}`,
      method: 'get',
    })

    .then((result) => result.data.result)

const studentResponse = ({ testActivityId, groupId, audit = false }) =>
  api
    .callApi({
      url: `/test-activity/${testActivityId}/report`,
      method: 'get',
      params: {
        groupId,
        audit,
      },
    })
    .then((result) => result.data.result)

const studentResponses = ({ testActivityIds, groupId }) =>
  api
    .callApi({
      url: `/test-activity/student-reports`,
      method: 'get',
      params: {
        testActivityIds:
          testActivityIds && testActivityIds.length
            ? `${testActivityIds}`
            : null,
        groupId,
      },
    })
    .then((result) => result.data.result)

const feedbackResponse = ({ body, testActivityId, questionId }) =>
  api
    .callApi({
      url: `/test-activity/${testActivityId}/question/${questionId}/feedbackAndScore`,
      method: 'put',
      data: body,
    })
    .then((result) => result.data.result)

const receiveStudentQuestionResponse = ({
  assignmentId,
  classId,
  questionId,
  studentId,
  testItemId,
}) =>
  api
    .callApi({
      url: `/assignments/${assignmentId}/question/${questionId}/student/${studentId}/group/${classId}`,
      method: 'get',
      params: { testItemId },
    })
    .then((result) => result.data.result)

const receiveStudentItemQuestionResponse = ({
  assignmentId,
  classId,
  testItemId,
  studentId,
}) =>
  api
    .callApi({
      url: `/assignments/${assignmentId}/item/${testItemId}/student/${studentId}/group/${classId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const questionClassQuestionResponse = ({ assignmentId, classId, questionId }) =>
  api
    .callApi({
      url: `/assignments/${assignmentId}/question/${questionId}/group/${classId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const questionClassItemQuestionResponse = ({ assignmentId, classId, itemId }) =>
  api
    .callApi({
      url: `/assignments/${assignmentId}/item/${itemId}/group/${classId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

export default {
  classResponse,
  studentResponse,
  studentResponses,
  feedbackResponse,
  receiveStudentQuestionResponse,
  questionClassQuestionResponse,
  receiveStudentItemQuestionResponse,
  questionClassItemQuestionResponse,
}
