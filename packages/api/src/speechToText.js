import API from './utils/API'

const api = new API()
const prefix = '/speech-to-text'

const generateTranscribeCredentials = () =>
  api
    .callApi({
      url: `${prefix}/transcribe-credentials`,
      method: 'get',
    })
    .then(({ data: { result } }) => result)

export default {
  generateTranscribeCredentials,
}
