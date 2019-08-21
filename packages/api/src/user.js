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

const updateUserRole = ({ data, userId }) =>
  api
    .callApi({
      url: `${prefix}/role/${userId}`,
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

const deleteAccount = userId =>
  api
    .callApi({
      url: `${prefix}/${userId}`,
      method: "delete"
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
        username: `${payload.username}`,
        districtId: `${payload.districtId}`
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

const checkClassCode = params => api.callApi({ url: `/auth/class-code/`, params }).then(result.data.data);

const requestNewPassword = params =>
  api
    .callApi({
      url: `auth/forgot-password`,
      params,
      method: "POST"
    })
    .then(result => result.data.result);

const fetchResetPasswordUser = params =>
  api
    .callApi({
      url: `auth/reset-password`,
      params
    })
    .then(result => result.data.result);

const resetUserPassword = data =>
  api
    .callApi({
      url: `auth/reset-password`,
      data,
      method: "POST"
    })
    .then(result => result.data.result);

const adddBulkTeacher = ({ districtId, userDetails }) =>
  api
    .callApi({
      url: `${prefix}/${districtId}/bulk-invite-teachers`,
      data: {
        userDetails
      },
      method: "POST"
    })
    .then(result => result.data.result);

const resetMyPassword = data =>
  api.callApi({
    url: `${prefix}/reset-password`,
    method: "put",
    data
  });

const moveUsersToOtherClass = ({ districtId, destinationClassCode, sourceClassCode, userDetails }) => {
  return api
    .callApi({
      url: `${prefix}/move-users`,
      data: {
        districtId,
        userDetails,
        destinationClassCode,
        sourceClassCode
      },
      method: "POST"
    })
    .then(result => result.data.result);
};

const removeSchool = data =>
  api.callApi({
    url: `${prefix}/${data.userId}/institution/${data.schoolId}/remove`,
    method: "put",
    data
  });

export default {
  getUser,
  fetchUsers,
  fetchUsersForShare,
  createUser,
  updateUser,
  updateUserRole,
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
  validateDistrictPolicy,
  checkClassCode,
  requestNewPassword,
  fetchResetPasswordUser,
  resetUserPassword,
  adddBulkTeacher,
  resetMyPassword,
  moveUsersToOtherClass,
  deleteAccount,
  removeSchool
};
