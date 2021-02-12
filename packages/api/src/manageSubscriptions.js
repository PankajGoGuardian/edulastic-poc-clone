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

export default {
  fetchLicenses,
}
