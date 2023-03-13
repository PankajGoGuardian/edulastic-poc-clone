import API from './utils/API'

const api = new API()
const BASE_URL = '/license-keys'

const fetchLicenses = (data) =>
  api
    .callApi({
      method: 'get',
      url: `${BASE_URL}/me`,
      params: data,
    })
    .then((result) => result.data)

const upgradeUsersSubscriptions = (data) =>
  api
    .callApi({
      method: 'post',
      url: `${BASE_URL}/upgrade-users`,
      data,
    })
    .then((result) => result.data)

const bulkEditUsersPermission = (data) =>
  api
    .callApi({
      method: 'put',
      url: `${BASE_URL}/users-permission`,
      data,
    })
    .then((result) => result.data)

const fetchManageLicenses = (data) =>
  api
    .callApi({
      method: 'get',
      url: `${BASE_URL}/manage-licenses`,
      params: data,
    })
    .then((result) => result.data)

const deleteLicenses = (data) =>
  api
    .callApi({
      method: 'put',
      url: `${BASE_URL}/archive`,
      data,
    })
    .then((result) => result.data)

const getAllLicensedUserInDistrict = (data) =>
  api
    .callApi({
      method: 'get',
      url: `${BASE_URL}/licensed-users`,
      params: data,
    })
    .then((result) => result.data)

export default {
  fetchLicenses,
  upgradeUsersSubscriptions,
  fetchManageLicenses,
  bulkEditUsersPermission,
  deleteLicenses,
  getAllLicensedUserInDistrict,
}
