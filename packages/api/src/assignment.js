import API from "./utils/API";
import moment from "moment";

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

const remove = ({ assignmentId, classId }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/group/${classId}`,
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
      url: `${prefix}${groupId ? `?groupId=${groupId}` : ""}`,
      method: "get"
    })
    .then(result => result.data.result);

const fetchTeacherAssignments = ({
  groupId = "",
  filters: { grades = [], subject = "", termId = "", testType = "", classId = "" }
}) =>
  api
    .callApi({
      url: `${prefix}?groupId=${groupId}&grade=${grades}&subject=${subject}&termId=${termId}&testType=${testType}&classId=${classId}`,
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

const duplicateAssignment = ({ _id, title }) =>
  api
    .callApi({
      url: `test/${_id}/duplicate?title=${title}-${moment().format("MM/DD/YYYY HH:mm")}`,
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

const fetchAssignmentsSummary = ({ districtId = "", filters, sort }) =>
  api
    .callApi({
      url: `${prefix}/district/${districtId}`,
      method: "get",
      params: { ...filters, ...sort }
    })
    .then(result => result.data.result);

const fetchAssignmentsClassList = ({ districtId, testId }) =>
  api
    .callApi({
      url: `${prefix}/district/${districtId}/test/${testId}`,
      method: "get"
    })
    .then(result => result.data.result);

const validateAssignmentPassword = ({ assignmentId, password }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/validate-password`,
      method: "post",
      data: { password }
    })
    .then(result => result.data);

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
  redirect,
  validateAssignmentPassword
};
