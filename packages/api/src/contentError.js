import API from './utils/API'

const api = new API()
const prefix = '/content-error'

const reportContentError = (data) =>
  api
    .callApi({
      url: prefix,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

export default {
  reportContentError,
}
