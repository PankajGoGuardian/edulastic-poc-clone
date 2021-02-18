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

const fetchManageLicenses = (data) =>
  api
    .callApi({
      method: 'get',
      url: `${BASE_URL}/manage-licenses`,
      params: data,
    })
    .then((result) => result.data)

export default {
  fetchLicenses,
  upgradeUsersSubscriptions,
  fetchManageLicenses,
}
