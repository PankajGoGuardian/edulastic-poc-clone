import API from '@edulastic/api/src/utils/API'

const api = new API()
const prefix = '/test-activity'

const create = (data) =>
  api
    .callApi({
      url: prefix,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const fetchReports = () =>
  api
    .callApi({
      url: `${prefix}/?status=graded`,
      method: 'get',
    })
    .then((result) => result.data.result)

const submit = (testActivityId, groupId) =>
  api
    .callApi({
      url: `${prefix}/${testActivityId}/status`,
      method: 'put',
      data: { status: 1, groupId },
    })
    .then((result) => result.data)

// API for submitting section
const submitSection = ({ testActivityId, sectionId }) =>
  api
    .callApi({
      url: `${prefix}/${testActivityId}/${sectionId}/submit`,
      method: 'put',
    })
    .then((result) => result.data)

const previousResponses = (testActivityId) =>
  api
    .callApi({
      url: `${prefix}/${testActivityId}/previousResponses`,
      method: 'get',
    })
    .then((result) => result.data.result)

const getById = (testActivityId, groupId, studentAssesment = false) =>
  api
    .callApi({
      url: `${prefix}/${testActivityId}`,
      method: 'get',
      params: { groupId, studentAssesment },
    })
    .then((result) => result.data.result)

const getScratchpad = (testActivityId) =>
  api
    .callApi({
      url: `/question-activity/${testActivityId}/scratchpad`,
      method: 'get',
    })
    .then((result) => result.data.result)

const saveOverallFeedback = ({ testActivityId, groupId, feedback: data }) =>
  api
    .callApi({
      url: `${prefix}/${testActivityId}/overall-feedback?groupId=${groupId}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

function incrementTabNavigationCounter(id) {
  return api
    .callApi({
      url: `${prefix}/${id}/tab-navigation-counter`,
      method: 'put',
      data: {},
    })
    .then((result) => result.data)
}

const updateResponseEntryAndScore = ({ testActivityId, itemId, ...data }) =>
  api
    .callApi({
      url: `${prefix}/${testActivityId}/test-item/${itemId}/response-entry-and-score`,
      method: 'put',
      data,
    })
    .then((result) => result.data)

const updateQuestionFeedBack = ({
  testActivityId,
  questionId,
  itemId,
  ...data
}) =>
  api
    .callApi({
      url: `${prefix}/${testActivityId}/test-item/${itemId}/question/${questionId}/feedback`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const updateUtaTime = ({ utaId, type, syncOffset }) =>
  api
    .callApi({
      url: `${prefix}/uta/${utaId}`,
      method: 'post',
      data: { type, syncOffset },
    })
    .then((result) => result.data.result)

const switchLanguage = ({ testActivityId, ...data }) =>
  api
    .callApi({
      url: `${prefix}/${testActivityId}/switch-preferred-language`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const saveUserWork = ({ testActivityId, groupId, userWork }) =>
  api
    .callApi({
      url: `${prefix}/${testActivityId}/user-work`,
      method: 'put',
      data: { userWork, groupId },
    })
    .then((result) => result.data.result)

const updateSelectedStudentAttempt = (data) =>
  api
    .callApi({
      url: `${prefix}/select-student-attempt`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)
export default {
  create,
  submit,
  submitSection,
  fetchReports,
  getById,
  getScratchpad,
  previousResponses,
  saveOverallFeedback,
  updateResponseEntryAndScore,
  updateQuestionFeedBack,
  updateUtaTime,
  incrementTabNavigationCounter,
  switchLanguage,
  saveUserWork,
  updateSelectedStudentAttempt,
}
