import API from './utils/API'

const api = new API()
const prefix = '/assignments'

const gradebook = ({ assignmentId, classId }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/classes/${classId}/gradebook`,
      method: 'get',
    })
    .then((result) => result.data.result)

const testActivity = ({
  assignmentId,
  classId,
  isQuestionsView = false,
  includeStudents = [],
  page,
  leftOverStudents,
}) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/classes/${classId}/test-activity`,
      method: 'POST',
      params: {
        isQuestionsView,
        includeStudents:
          includeStudents && includeStudents.length
            ? `${includeStudents}`
            : null,
      },
      data: {
        page,
        leftOverStudents,
      },
    })
    .then((result) => result.data)

const releaseScore = ({
  assignmentId,
  classId,
  releaseScore: _releaseScore,
  testId,
  filterState,
}) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'put',
      url: `${prefix}/${assignmentId}/test/${testId}/group/${classId}/releaseScore`,
      data: { releaseScore: _releaseScore },
      params: filterState,
    })
    .then((result) => result.data)

const markAsDone = ({ assignmentId, classId, testId }) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'put',
      url: `${prefix}/${assignmentId}/mark-as-done?groupId=${classId}&testId=${testId}`,
    })
    .then((result) => result.data)

const openAssignment = ({ assignmentId, classId, testId }) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'put',
      url: `${prefix}/${assignmentId}/open?groupId=${classId}&testId=${testId}`,
    })
    .then((result) => result.data)

const closeAssignment = ({ assignmentId, classId, testId }) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'put',
      url: `${prefix}/${assignmentId}/close?groupId=${classId}&testId=${testId}`,
    })
    .then((result) => result.data)

const markAbsent = ({ assignmentId, classId, students }) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/${assignmentId}/mark-as-absent`,
      data: { groupId: classId, students },
    })
    .then((result) => result.data)

const markSubmitted = ({ assignmentId, classId, students }) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/${assignmentId}/mark-as-submitted`,
      data: { groupId: classId, students },
    })
    .then((result) => result.data.result)

const togglePause = ({ assignmentId, classId, value, testId }) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'put',
      url: `${prefix}/${assignmentId}/toggle-pause?groupId=${classId}&value=${value}&testId=${testId}`,
    })
    .then((result) => result.data)

const removeStudents = ({ assignmentId, classId, students }) =>
  api
    .callApi({
      method: 'put',
      url: `${prefix}/${assignmentId}/remove-students`,
      data: { _id: classId, students },
    })
    .then((response) => response.data.result)

const addStudents = ({ assignmentId, classId, students, endDate }) =>
  api
    .callApi({
      method: 'put',
      url: `${prefix}/${assignmentId}/add-students`,
      data: { _id: classId, students, endDate },
    })
    .then((response) => response.data.result)

const testActivitiesForStudent = ({ studentId, assignmentId, groupId }) =>
  api
    .callApi({
      method: 'get',
      url: `${prefix}/${assignmentId}/group/${groupId}/student/${studentId}/test-activity`,
    })
    .then((response) => response.data.result)

const downloadGrades = ({
  assignmentId,
  classId,
  students,
  isResponseRequired,
}) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/${assignmentId}/group/${classId}/download-grades-and-response`,
      data: { studentIds: students, isResponseRequired },
    })
    .then((response) => response.data)

const regeneratePassword = ({ assignmentId, classId, passwordExpireIn }) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/${assignmentId}/group/${classId}/regenerate-password`,
      data: { passwordExpireIn },
    })
    .then((response) => response.data)

const bulkOpenAssignment = ({ testId, data, testType, status }) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'post',
      url: `${prefix}/test/${testId}/bulk-open`,
      data,
      params: Object.keys(data).length === 0 ? { testType, status } : {},
    })
    .then((response) => response.data)

const bulkCloseAssignment = ({ testId, data, testType, status }) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'post',
      url: `${prefix}/test/${testId}/bulk-close`,
      data,
      params: Object.keys(data).length === 0 ? { testType, status } : {},
    })
    .then((response) => response.data)

const bulkPauseAssignment = ({ testId, data, testType, status }) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'post',
      url: `${prefix}/test/${testId}/bulk-pause`,
      data,
      params: Object.keys(data).length === 0 ? { testType, status } : {},
    })
    .then((response) => response.data)

const bulkMarkAsDoneAssignment = ({ testId, data, testType, status }) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'post',
      url: `${prefix}/test/${testId}/bulk-mark-as-done`,
      data,
      params: Object.keys(data).length === 0 ? { testType, status } : {},
    })
    .then((response) => response.data)

const bulkReleaseScoreAssignment = ({ testId, data, testType, status }) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'post',
      url: `${prefix}/test/${testId}/bulk-release-score`,
      data,
      params:
        Object.keys(data.assignmentGroups).length === 0
          ? { testType, status }
          : {},
    })
    .then((response) => response.data)

const bulkUnassignAssignment = ({ testId, data, testType, status }) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'post',
      url: `${prefix}/test/${testId}/bulk-unassign`,
      data,
      params: Object.keys(data).length === 0 ? { testType, status } : {},
    })
    .then((response) => response.data)

const bulkDownloadGrades = ({ testId, data, testType, status }) =>
  api
    .callApi({
      useSlowApi: true,
      method: 'post',
      url: `${prefix}/test/${testId}/bulk-download-grades-and-response`,
      data,
      params:
        Object.keys(data.assignmentGroups).length === 0
          ? { testType, status }
          : {},
    })
    .then((response) => response.data)

const togglePauseStudents = ({
  assignmentId,
  classId,
  students,
  isPause,
  pauseReason,
}) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/${assignmentId}/toggle-pause-students`,
      data: { groupId: classId, students, isPause, pauseReason },
    })
    .then((result) => result.data.result)

const fetchAiViewData = (payload) =>
  api
    .callApi({
      method: 'get',
      url: `/report/pear-prediction-difficulty-by-standard`,
      params: payload,
    })
    .then((result) => result.data.result)

export default {
  gradebook,
  testActivity,
  testActivitiesForStudent,
  releaseScore,
  markAsDone,
  togglePause,
  openAssignment,
  closeAssignment,
  markAbsent,
  markSubmitted,
  removeStudents,
  addStudents,
  downloadGrades,
  regeneratePassword,
  bulkOpenAssignment,
  bulkCloseAssignment,
  bulkPauseAssignment,
  bulkMarkAsDoneAssignment,
  bulkReleaseScoreAssignment,
  bulkUnassignAssignment,
  bulkDownloadGrades,
  togglePauseStudents,
  fetchAiViewData,
}
