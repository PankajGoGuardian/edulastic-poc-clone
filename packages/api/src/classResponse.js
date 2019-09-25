import API from "./utils/API";

const api = new API();

const classResponse = ({ testId, classId, assignmentId }) =>
  api
    .callApi({
      url: `/test/${testId}?validation=true&data=true${classId ? `&groupId=${classId}` : ""}${
        assignmentId ? `&assignmentId=${assignmentId}` : ""
      }`,
      method: "get"
    })

    .then(result => result.data.result);

const studentResponse = ({ testActivityId, groupId }) =>
  api
    .callApi({
      url: `/test-activity/${testActivityId}/report`,
      method: "get",
      params: {
        groupId
      }
    })
    .then(result => result.data.result);

const feedbackResponse = ({ body, testActivityId, questionId }) =>
  api
    .callApi({
      url: `/test-activity/${testActivityId}/question/${questionId}/feedbackAndScore`,
      method: "put",
      data: body
    })
    .then(result => result.data.result);

const receiveStudentQuestionResponse = ({ assignmentId, classId, questionId, studentId }) =>
  api
    .callApi({
      url: `/assignments/${assignmentId}/question/${questionId}/student/${studentId}/group/${classId}`,
      method: "get"
    })
    .then(result => result.data.result);

const receiveStudentItemQuestionResponse = ({ assignmentId, classId, testItemId, studentId }) =>
  api
    .callApi({
      url: `/assignments/${assignmentId}/item/${testItemId}/student/${studentId}/group/${classId}`,
      method: "get"
    })
    .then(result => result.data.result);

const questionClassQuestionResponse = ({ assignmentId, classId, questionId }) =>
  api
    .callApi({
      url: `/assignments/${assignmentId}/question/${questionId}/group/${classId}`,
      method: "get"
    })
    .then(result => result.data.result);

const questionClassItemQuestionResponse = ({ assignmentId, classId, questionId, itemId }) =>
  api
    .callApi({
      url: `/assignments/${assignmentId}/item/${itemId}/group/${classId}`,
      method: "get"
    })
    .then(result => result.data.result);

export default {
  classResponse,
  studentResponse,
  feedbackResponse,
  receiveStudentQuestionResponse,
  questionClassQuestionResponse,
  receiveStudentItemQuestionResponse,
  questionClassItemQuestionResponse
};
