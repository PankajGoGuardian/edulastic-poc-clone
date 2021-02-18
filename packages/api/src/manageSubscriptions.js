import API from './utils/API'

const api = new API()
const BASE_URL = '/license-keys'

const fetchLicenses = () =>
  api
    .callApi({
      method: 'get',
      url: `${BASE_URL}/me`,
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

export default {
  fetchLicenses,
  upgradeUsersSubscriptions,
  bulkEditUsersPermission,
}
