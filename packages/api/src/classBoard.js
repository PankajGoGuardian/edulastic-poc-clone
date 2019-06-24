import API from "./utils/API";

const api = new API();
const prefix = "/assignments";

const gradebook = ({ assignmentId, classId }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/classes/${classId}/gradebook`,
      method: "get"
    })
    .then(result => result.data.result);

const testActivity = ({ assignmentId, classId }) =>
  api
    .callApi({
      url: `${prefix}/${assignmentId}/classes/${classId}/test-activity`,
      method: "get"
    })
    .then(result => result.data);

const releaseScore = ({ assignmentId, classId, isReleaseScore }) =>
  api
    .callApi({
      method: "put",
      url: `${prefix}/${assignmentId}/group/${classId}/releaseScore`,
      data: { status: isReleaseScore }
    })
    .then(result => result.data);

const markAsDone = ({ assignmentId, classId }) =>
  api
    .callApi({
      method: "put",
      url: `${prefix}/${assignmentId}/mark-as-done?groupId=${classId}`
    })
    .then(result => result.data);

const openAssignment = ({ assignmentId, classId }) =>
  api
    .callApi({
      method: "put",
      url: `${prefix}/${assignmentId}/open?groupId=${classId}`
    })
    .then(result => result.data);

const closeAssignment = ({ assignmentId, classId }) =>
  api
    .callApi({
      method: "put",
      url: `${prefix}/${assignmentId}/close?groupId=${classId}`
    })
    .then(result => result.data);

const markAbsent = ({ assignmentId, classId, students }) =>
  api
    .callApi({
      method: "post",
      url: `${prefix}/${assignmentId}/mark-as-absent`,
      data: { groupId: classId, students }
    })
    .then(result => result.data);

export default {
  gradebook,
  testActivity,
  releaseScore,
  markAsDone,
  openAssignment,
  closeAssignment,
  markAbsent
};
