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

const releaseScore = ({ assignmentId, classId, releaseScore }) =>
  api
    .callApi({
      method: "put",
      url: `${prefix}/${assignmentId}/group/${classId}/releaseScore`,
      data: { releaseScore }
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

const togglePause = ({ assignmentId, classId, value }) =>
  api
    .callApi({
      method: "put",
      url: `${prefix}/${assignmentId}/toggle-pause?groupId=${classId}&value=${value}`
    })
    .then(result => result.data);

const removeStudents = ({ assignmentId, classId, students }) =>
  api
    .callApi({
      method: "put",
      url: `${prefix}/${assignmentId}/remove-students`,
      data: { _id: classId, students }
    })
    .then(response => response.data.result);

const addStudents = ({ assignmentId, classId, students, endDate }) =>
  api
    .callApi({
      method: "put",
      url: `${prefix}/${assignmentId}/add-students`,
      data: { _id: classId, students, specificStudents: students.length > 0, endDate }
    })
    .then(response => response.data.result);

const testActivitiesForStudent = ({ studentId, assignmentId, groupId }) =>
  api
    .callApi({
      method: "get",
      url: `${prefix}/${assignmentId}/group/${groupId}/student/${studentId}/test-activity`
    })
    .then(response => response.data.result);

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
  removeStudents,
  addStudents
};
