import API from './utils/API'
import * as Storage from './utils/Storage'

const api = new API()
const prefix = '/user'

/*
 * api for fetching logged in users details
 */
const getUser = (needFirebaseLoginToken = undefined) =>
  api
    .callApi({
      url: `${prefix}/me`,
      method: 'get',
      params: {
        needFirebaseLoginToken,
      },
    })
    .then((result) => result?.data?.result)

const getProxyUser = (params) =>
  api
    .callApi({
      url: `${prefix}/proxy`,
      params,
      method: 'get',
    })
    .then((result) => result.data)

const getSwitchedToken = (role) =>
  api
    .callApi({
      url: `${prefix}/token/role/${role}`,
      method: 'get',
    })
    .then((result) => result.data)

const getSwitchUser = (switchToId, personId, districtId) =>
  api
    .callApi({
      url: `${prefix}/switch`,
      method: 'get',
      params: {
        switchToId,
        personId,
        ...(districtId ? { districtId } : {}),
      },
    })
    .then((result) => result.data)

const fetchUsers = (data) =>
  api
    .callApi({
      url: `search/users`,
      method: 'post',
      data,
    })
    .then(({ data: response }) => response)

const fetchUsersForShare = (data) =>
  api
    .callApi({
      url: `user/search`,
      method: 'post',
      data,
    })
    .then(({ data: response }) => response)

const createUser = (data) =>
  api
    .callApi({
      url: `${prefix}/`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const updateUser = ({ data, userId }) =>
  api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/${userId}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const updateUserRole = ({ data, userId }) =>
  api
    .callApi({
      url: `${prefix}/role/${userId}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const updateCollectionVisited = ({ data, userId }) =>
  api
    .callApi({
      url: `${prefix}/collectionVisited/${userId}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const deleteUser = (data) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'delete',
      data,
    })
    .then(({ data: response }) => response)

const deleteAccount = (userId) =>
  api
    .callApi({
      url: `${prefix}/${userId}`,
      method: 'delete',
    })
    .then(({ data: response }) => response)

const changeUserTTS = (data) =>
  api.callApi({
    url: `${prefix}/tts`,
    method: 'put',
    data,
  })

const resetPassword = (data) =>
  api.callApi({
    url: `${prefix}/password`,
    method: 'put',
    data,
  })

const addMultipleStudents = ({ districtId, data }) =>
  api
    .callApi({
      url: `${prefix}/${districtId}/students`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const checkUser = (payload) =>
  api
    .callApi({
      url: `${prefix}/username-email/`,
      params: {
        username: `${payload.username}`,
        districtId: payload.districtId ? `${payload.districtId}` : null,
        classCode: payload.classCode ? `${payload.classCode}` : null,
        role: `${payload.role}`,
      },
      method: 'get',
    })
    .then((result) => result.data.result)

const SearchAddEnrolMultiStudents = (classCode, data) =>
  api.callApi({
    url: `${prefix}/${classCode}/class-students`,
    method: 'post',
    data,
  })

const addStudentsToOtherClass = ({ classCode, userDetails }) =>
  api
    .callApi({
      url: `${prefix}/${classCode}/class-students`,
      method: 'post',
      data: {
        userDetails,
      },
    })
    .then(({ data }) => data)

const validateClassCode = (classCode) =>
  api
    .callApi({
      url: `/group/${classCode}/validate`,
      method: 'get',
    })
    .then(({ data }) => data)

const validateDistrictPolicy = (params) =>
  api
    .callApi({ url: `${prefix}/domain`, params })
    .then((result) => result.data.result)

const checkClassCode = (params) =>
  api
    .callApi({ url: `/auth/class-code/`, params })
    .then((result) => result.data.data)

const requestNewPassword = (params) =>
  api
    .callApi({
      url: `auth/forgot-password`,
      params,
      method: 'POST',
    })
    .then((result) => result.data.result)

const fetchResetPasswordUser = (params) =>
  api
    .callApi({
      url: `auth/reset-password`,
      params,
    })
    .then((result) => result.data.result)

const resetUserPassword = (data) =>
  api
    .callApi({
      url: `auth/reset-password`,
      data,
      method: 'POST',
    })
    .then((result) => result.data.result)

const adddBulkTeacher = ({ districtId, userDetails }) =>
  api
    .callApi({
      url: `${prefix}/${districtId}/bulk-invite-teachers`,
      data: {
        userDetails,
      },
      method: 'POST',
    })
    .then((result) => result.data.result)

const resetMyPassword = (data) =>
  api.callApi({
    url: `${prefix}/reset-password`,
    method: 'put',
    data,
  })

const moveUsersToOtherClass = ({
  districtId,
  destinationClassCode,
  sourceClassCode,
  userDetails,
}) =>
  api
    .callApi({
      url: `${prefix}/move-users`,
      data: {
        districtId,
        userDetails,
        destinationClassCode,
        sourceClassCode,
      },
      method: 'POST',
    })
    .then((result) => result.data.result)

const removeSchool = (data) =>
  api.callApi({
    url: `${prefix}/institution/${data.schoolId}/remove`,
    method: 'put',
    data,
  })

const sendParentCode = (code) =>
  api
    .callApi({
      method: 'post',
      url: `${prefix}/parent-code/${code}`,
      data: {},
    })
    .then((result) => {
      if (result?.data?.result?.token) {
        Storage.storeAccessToken(
          result?.data?.result?.token,
          result?.data?.result?.userId,
          'parent'
        )
        Storage.selectAccessToken(result?.data?.result?.userId, 'parent')
      }
      return result.data.result
    })

const fetchUsersFromDistrict = (districtId) =>
  api
    .callApi({
      url: `districts/${districtId}/users`,
      data: {},
      method: 'POST',
    })
    .then((result) => result.data.result)

const fetchUsersForMerge = ({ type, userIds }) =>
  api
    .callApi({
      url: `${prefix}/${type}/${userIds}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const mergeUsers = ({ primaryUserId, userIds }) =>
  api
    .callApi({
      url: `${prefix}/merge-user`,
      method: 'post',
      data: { primaryUserId, userIds },
    })
    .then((result) => result.data)

const updatePowerTeacherTools = (payload) =>
  api.callApi({
    url: `${prefix}/power-teacher`,
    method: 'post',
    data: payload,
  })

const activateUser = ({ userId, activate }) =>
  api.callApi({
    url: `${prefix}/activate-user/${userId}/activate/${activate}`,
    method: 'put',
  })

const updateUsername = ({ username, userId, newUsername, permissions }) =>
  api.callApi({
    url: `/admin-tool/user`,
    method: 'put',
    data: { username, userId, newUsername, permissions },
  })

const logout = () =>
  api.callApi({
    url: `${prefix}/logout`,
    method: 'post',
  })

const getDemoPlaygroundUser = () =>
  api
    .callApi({
      url: `${prefix}/playground`,
      method: 'get',
    })
    .then((result) => result.data)

const eulaPolicyStatusUpdate = (data) =>
  api.callApi({
    url: `${prefix}/eula-policy`,
    method: 'put',
    data,
  })
const getUserLocation = () =>
  api
    .callApi({
      url: `${prefix}/user-loc-data`,
      method: 'get',
    })
    .then((result) => result.data)

const addFeedback = (id, data) =>
  api
    .callApi({
      url: `${prefix}/feedback/${id}`,
      method: 'post',
      data,
    })
    .then((r) => r.data)

const getFeedbacks = (id, params) =>
  api
    .callApi({
      url: `${prefix}/feedbacks/${id}`,
      method: 'get',
      params,
    })
    .then((r) => r.data)

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
  removeSchool,
  fetchUsersFromDistrict,
  sendParentCode,
  fetchUsersForMerge,
  getSwitchUser,
  mergeUsers,
  updatePowerTeacherTools,
  activateUser,
  updateUsername,
  logout,
  getDemoPlaygroundUser,
  updateCollectionVisited,
  eulaPolicyStatusUpdate,
  getUserLocation,
  addFeedback,
  getFeedbacks,
}
