import API from './utils/API'

const api = new API()
const prefix = '/oneroster'

const testApiConfig = (data) =>
  api
    .callApi({
      url: `${prefix}/test-oneroster-config`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const generateLtiKeys = () =>
  api
    .callApi({
      url: `${prefix}/generate-lti-keys`,
      method: 'get',
    })
    .then((result) => result.data.result)

export default {
  testApiConfig,
  generateLtiKeys,
}
