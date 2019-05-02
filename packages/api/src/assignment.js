import API from "./utils/API";

const api = new API();
const prefix = "/assignments";

const create = data =>
  api
    .callApi({
      url: `${prefix}`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const update = (id, data) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: "put",
      data
    })
    .then(result => result.data.result);

const remove = id =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: "delete"
    })
    .then(result => result.data.result);

const fetchAssignments = testId =>
  api
    .callApi({
      url: `/test/${testId}${prefix}`,
      method: "get"
    })
    .then(result => result.data.result);

const fetchAssigned = groupId =>
  api
    .callApi({
      url: `${prefix}?groupId=${groupId}`,
      method: "get"
    })
    .then(result => result.data.result);

const fetchTeacherAssignments = ({ groupId = "", filters: { grades = [], subject = "", termId = "" } }) =>
  api
    .callApi({
      url: `${prefix}?groupId=${groupId}&grade=${grades}&subject=${subject}&termId=${termId}`,
      method: "get"
    })
    .then(result => result.data.result);

const regrade = data =>
  api
    .callApi({
      url: `${prefix}/regrade`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const getById = id =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: "get"
    })
    .then(result => result.data.result);

const fetchTestActivities = (assignmentId, groupId) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/testActivity`,
      params: { groupId },
      method: "get"
    })
    .then(result => result.data.result);

const duplicateAssignment = testId =>
  api
    .callApi({
      url: `test/${testId}/duplicate`,
      method: "post"
    })
    .then(result => result.data.result);

const redirect = (assignmentId, data) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/redirect`,
      method: "POST",
      data
    })
    .then(result => result.data.result);

const fetchAssignmentsSummary = ({ districtId = "", filters }) =>
  api
    .callApi({
      url: `${prefix}/district/${districtId}`,
      method: "get",
      params: filters
    })
    .then(result => result.data.result);

const fetchAssignmentsClassList = ({ districtId, testId }) =>
  api
    .callApi({
      url: `${prefix}/district/${districtId}/test/${testId}`,
      method: "get"
    })
    .then(result => result.data.result);

export default {
  create,
  update,
  remove,
  fetchAssignments,
  fetchAssigned,
  fetchTeacherAssignments,
  fetchAssignmentsSummary,
  fetchAssignmentsClassList,
  regrade,
  getById,
  fetchTestActivities,
  duplicateAssignment,
  redirect
};
