import API from './utils/API'

const api = new API()
const prefix = '/utils'

const fetchServerTime = () =>
  api
    .callApi({
      url: `${prefix}/fetch-sync-time`,
      method: 'get',
    })
    .then(({ data: { result } }) => new Date(result.serverTimeISO).getTime())

const generateTranscribeTempCredentials = () =>
  api
    .callApi({
      url: `${prefix}/transcribe-temp-credentials`,
      method: 'get',
    })
    .then(({ data: { result } }) => result)

export default {
  fetchServerTime,
  generateTranscribeTempCredentials,
}
