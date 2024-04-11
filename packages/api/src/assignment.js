import moment from 'moment'
import qs from 'qs'
import API from './utils/API'

const api = new API()
const prefix = '/assignments'

const create = (data) =>
  api
    .callApi({
      useSlowApi: true,
      url: `${prefix}`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const createAssignmentV2 = (data) =>
  api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/v2/assign`,
      method: 'post',
      data,
    })
    .then((result) => result.data)

const bulkAssign = (data) =>
  api
    .callApi({
      url: `${prefix}/bulk-assign`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const update = (id, data) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const remove = ({ assignmentId, classId, testId }) =>
  api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/${assignmentId}/group/${classId}?testId=${testId}`,
      method: 'delete',
    })
    .then((result) => result.data.result)

const fetchAssignments = (testId) =>
  api
    .callApi({
      url: `/test/${testId}${prefix}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const fetchRegradeAssignments = (testId) =>
  api
    .callApi({
      url: `/test/${testId}/regrade-assignments`,
      method: 'get',
    })
    .then((result) => result.data.result)

const fetchAssigned = (
  groupId = '',
  testId = '',
  groupStatus = 'all',
  studentId = '',
  districtId = '',
  searchWithVersionId = false
) =>
  api
    .callApi({
      url: `${prefix}/all`,
      method: 'post',
      params: {
        groupId,
        testId,
        groupStatus,
        studentId,
        districtId,
        searchWithVersionId,
      },
    })
    .then((result) => result.data.result)

const fetchTeacherAssignments = ({
  groupId = '',
  filters: {
    grades = [],
    subject = '',
    termId = '',
    testTypes = [],
    classId = '',
    status = '',
    tags = [],
    testId = '',
  },
  folderId = '',
}) =>
  api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/all?groupId=${groupId}&grade=${grades}&subject=${subject}&termId=${termId}&testTypes=${testTypes}&classId=${classId}&status=${status}&folderId=${folderId}&testId=${testId}`,
      method: 'post',
      data: { tags },
    })
    .then((result) => result.data.result)

const regrade = (data) =>
  api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/regrade`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const getById = (id) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const fetchTestActivities = (assignmentId, groupId) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/testActivity`,
      params: { groupId },
      method: 'get',
    })
    .then((result) => result.data.result)

const duplicateAssignment = ({
  _id,
  title,
  isInEditAndRegrade = false,
  playlistId,
  updatePlaylist = false,
  updateContentVersionId = false,
}) =>
  api
    .callApi({
      url: `test/${_id}/duplicate`,
      params: {
        title: isInEditAndRegrade
          ? title
          : `${title}-${moment().format('MM/DD/YYYY HH:mm')}`,
        isInEditAndRegrade,
        playlistId,
        updatePlaylist,
        updateContentVersionId,
      },
      method: 'post',
    })
    .then((result) => result.data.result)

const redirect = (assignmentId, data) =>
  api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/${assignmentId}/redirect`,
      method: 'POST',
      data,
    })
    .then((result) => result.data.result)

const fetchAssignmentsSummary = ({
  districtId = '',
  filters: { tags, ...filters },
  sort,
}) =>
  api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/district/${districtId}`,
      method: 'post',
      params: { ...filters, ...sort },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'comma' }),
      data: { tags },
    })
    .then((result) => result.data.result)

const fetchAssignmentsClassList = ({
  districtId,
  testId,
  testType,
  termId,
  pageNo = 1,
  status = '',
  grades = [],
  assignedBy = '',
  tags,
}) =>
  api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/district/${districtId}/test/${testId}`,
      method: 'post',
      params: { testType, termId, pageNo, status, grades, assignedBy },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'comma' }),
      data: { tags },
    })
    .then((result) => result.data.result)

const validateAssignmentPassword = ({ assignmentId, password, groupId }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/validate-password`,
      method: 'post',
      data: { password, groupId },
    })
    .then((result) => result.data)

const updateClassSettings = ({ assignmentId, classId, settings }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/group/${classId}/settings`,
      method: 'put',
      data: settings,
    })
    .then((result) => result.data)

const getDifferentiationStudentList = ({ assignmentId, groupId }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/mastery?groupId=${groupId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const getMasteryStudentList = ({ assignmentId, groupId }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/${groupId}/standards-mastery`,
    })
    .then((result) => result.data.result)

const syncWithGoogleClassroom = (data) =>
  api
    .callApi({
      url: `${prefix}/google-classroom-share`,
      method: 'POST',
      data,
    })
    .then((result) => result.data.result)

const fetchByTestId = (testId) =>
  api
    .callApi({
      url: `${prefix}/test/${testId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const searchAssignments = (data) =>
  api
    .callApi({
      url: `search/assignments`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const searchMultiSchoolYearAssignments = (data) =>
  api
    .callApi({
      url: `search/assessments`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const syncWithSchoologyClassroom = (data) =>
  api
    .callApi({
      url: `${prefix}/share-with-atlas`,
      method: 'POST',
      data,
    })
    .then((result) => result.data.result)

const fetchRegradeSettings = ({ oldTestId, newTestId }) =>
  api
    .callApi({
      url: `${prefix}/regrade-actions/old/${oldTestId}/new/${newTestId}`,
      method: 'GET',
    })
    .then((result) => result.data.result)

const editTagsRequest = (payload) =>
  api.callApi({
    url: `${prefix}/edit-tags`,
    method: 'post',
    data: payload,
  })

const getBubbleSheet = ({ assignmentId, groupId }) =>
  api.callApi({
    url: `${prefix}/${assignmentId}/group/${groupId}/bubble-sheet`,
    method: 'post',
  })

const bulkEditSettings = (payload) =>
  api.callApi({
    useSlowApi: true,
    url: `${prefix}/bulk-settings-edit`,
    method: 'post',
    data: payload,
  })

export default {
  create,
  update,
  remove,
  fetchAssignments,
  fetchRegradeAssignments,
  fetchAssigned,
  fetchTeacherAssignments,
  fetchAssignmentsSummary,
  fetchAssignmentsClassList,
  regrade,
  getById,
  fetchTestActivities,
  duplicateAssignment,
  redirect,
  validateAssignmentPassword,
  updateClassSettings,
  getDifferentiationStudentList,
  syncWithGoogleClassroom,
  fetchByTestId,
  searchAssignments,
  searchMultiSchoolYearAssignments,
  syncWithSchoologyClassroom,
  fetchRegradeSettings,
  editTagsRequest,
  getBubbleSheet,
  bulkAssign,
  createAssignmentV2,
  bulkEditSettings,
  getMasteryStudentList,
}
