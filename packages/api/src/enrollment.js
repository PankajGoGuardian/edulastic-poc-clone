import API from "./utils/API";

const api = new API();
const prefix = "enrollment";

const fetch = classId =>
  api
    .callApi({
      url: `${prefix}/class/${classId}`,
      method: "get"
    })
    .then(result => result.data.result);

// fetch multiple classes by Ids
const fetchByIds = classIds => {
  const ids = classIds.join(",");
  return api
    .callApi({
      url: `${prefix}/class`,
      method: "get",
      params: { ids }
    })
    .then(result => result.data.result);
};

const create = data =>
  api
    .callApi({
      url: `${prefix}`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const addStudent = data =>
  api.callApi({
    url: `${prefix}/user`,
    method: "post",
    data
  });

const removeStudents = data =>
  api.callApi({
    url: `${prefix}/student`,
    method: "delete",
    data
  });

const addEnrolMultiStudents = ({ classId, data }) => {
  return api.callApi({
    url: `${prefix}/${classId}/students`,
    method: "post",
    data
  });
};
const SearchAddEnrolMultiStudents = data => {
  return api.callApi({
    url: `${prefix}/student`,
    method: "post",
    data
  });
};
const fetchStudentEnrollClass = () => {
  return api.callApi({
    url: `${prefix}/student`,
    method: "get"
  });
};
export default {
  fetch,
  create,
  fetchByIds,
  addStudent,
  removeStudents,
  addEnrolMultiStudents,
  SearchAddEnrolMultiStudents,
  fetchStudentEnrollClass
};
