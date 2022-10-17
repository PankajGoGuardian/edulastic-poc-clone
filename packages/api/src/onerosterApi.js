import API from './utils/API'

const api = new API()
const prefix = '/oneroster'

const getSignedUrl = (filename, folder, subFolder) =>
  api
    .callApi({
      url: `${prefix}/signed-url`,
      method: 'get',
      params: {
        filename,
        subFolder,
        folder,
      },
    })
    .then((result) => result.data.result)

const fetchRosterLogs = () =>
  api
    .callApi({
      url: `${prefix}/oneroster-stats`,
      method: 'get',
    })
    .then((result) => result.data.result)

export default { getSignedUrl, fetchRosterLogs }
