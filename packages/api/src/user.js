import API from "./utils/API";

const api = new API();
const prefix = "/user";

/*
 * api for fetching logged in users details
 */
const getUser = () =>
  api
    .callApi({
      url: `${prefix}/me`,
      method: "get"
    })
    .then(result => result.data.result);

const getProxyUser = params =>
  api
    .callApi({
      url: `${prefix}/proxy`,
      params,
      method: "get"
    })
    .then(result => result.data);

const getSwitchedToken = role =>
  api
    .callApi({
      url: `${prefix}/token/role/${role}`,
      method: "get"
    })
    .then(result => result.data);

const fetchUsers = data =>
  api
    .callApi({
      url: `search/users`,
      method: "post",
      data
    })
    .then(({ data: response }) => response);

const fetchUsersForShare = data =>
  api
    .callApi({
      url: `user/search`,
      method: "post",
      data
    })
    .then(({ data: response }) => response);

const createUser = data =>
  api
    .callApi({
      url: `${prefix}/`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const updateUser = ({ data, userId }) =>
  api
    .callApi({
      url: `${prefix}/${userId}`,
      method: "put",
      data
    })
    .then(result => result.data.result);

const deleteUser = data =>
  api
    .callApi({
      url: `${prefix}`,
      method: "delete",
      data
    })
    .then(({ data: response }) => response);

const changeUserTTS = data =>
  api.callApi({
    url: `${prefix}/tts`,
    method: "put",
    data
  });

const resetPassword = data =>
  api.callApi({
    url: `${prefix}/password`,
    method: "put",
    data
  });

const addMultipleStudents = ({ districtId, data }) =>
  api
    .callApi({
      url: `${prefix}/${districtId}/students`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const checkUser = payload => {
  return api
    .callApi({
      url: `${prefix}/username-email/`,
      params: {
        username: `${payload.username}`
      },
      method: "get"
    })
    .then(result => result.data.result);
};

const SearchAddEnrolMultiStudents = (classCode, data) => {
  return api.callApi({
    url: `${prefix}/${classCode}/class-students`,
    method: "post",
    data
  });
};

const addStudentsToOtherClass = ({ classCode, userDetails }) =>
  api
    .callApi({
      url: `${prefix}/${classCode}/class-students`,
      method: "post",
      data: {
        userDetails
      }
    })
    .then(({ data }) => data);

const validateClassCode = classCode =>
  api
    .callApi({
      url: `/group/${classCode}/validate`,
      method: "get"
    })
    .then(({ data }) => data);

const validateDistrictPolicy = params =>
  api.callApi({ url: `${prefix}/domain`, params }).then(result => result.data.result);

export default {
  getUser,
  fetchUsers,
  fetchUsersForShare,
  createUser,
  updateUser,
  deleteUser,
  getProxyUser,
  getSwitchedToken,
  changeUserTTS,
  resetPassword,
  addMultipleStudents,

  checkUser,

  SearchAddEnrolMultiStudents,

  addStudentsToOtherClass,
  validateClassCode,
  validateDistrictPolicy
};
