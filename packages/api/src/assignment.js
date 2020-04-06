import API from "./utils/API";
import moment from "moment";
import qs from "qs";

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
  filters: { grades = [], subject = "", termId = "", testType = "", classId = "", status = "" }
}) =>
  api
    .callApi({
      url: `${prefix}?groupId=${groupId}&grade=${grades}&subject=${subject}&termId=${termId}&testType=${testType}&classId=${classId}&status=${status}`,
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
      params: { ...filters, ...sort },
      paramsSerializer: params => qs.stringify(params, { arrayFormat: "comma" })
    })
    .then(result => result.data.result);

const fetchAssignmentsClassList = ({ districtId, testId, testType }) =>
  api
    .callApi({
      url: `${prefix}/district/${districtId}/test/${testId}?testType=${testType}`,
      method: "get"
    })
    .then(result => result.data.result);

const validateAssignmentPassword = ({ assignmentId, password, groupId }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/validate-password`,
      method: "post",
      data: { password, groupId }
    })
    .then(result => result.data);

const updateClassSettings = ({ assignmentId, classId, settings }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/group/${classId}/settings`,
      method: "put",
      data: settings
    })
    .then(result => result.data);

const getDifferentiationStudentList = ({ assignmentId, groupId }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/mastery?groupId=${groupId}`,
      method: "get"
    })
    .then(result => result.data.result);

const syncWithGoogleClassroom = data =>
  api
    .callApi({
      url: `${prefix}/google-classroom-share`,
      method: "POST",
      data
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
  redirect,
  validateAssignmentPassword,
  updateClassSettings,
  getDifferentiationStudentList,
  syncWithGoogleClassroom
};
