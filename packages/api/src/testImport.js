import API from './utils/API'

const api = new API()
const prefix = '/test-import'
const importGoogleFormTest = (data) =>
  api
    .callApi({
      url: `${prefix}/google-form`,
      method: 'post',
      data,
    })
    .then((result) => result.data)

export default {
  importGoogleFormTest,
}
