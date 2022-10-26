import API from './utils/API'

const api = new API()
const prefix = '/oneroster'

const getSignedUrl = (filename, folder, syncType) =>
  api
    .callApi({
      url: `${prefix}/signed-url`,
      method: 'get',
      params: {
        filename,
        folder,
        syncType,
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

const downloadEntityError = ({ entity, timestamp }) =>
  api
    .callApi({
      url: `${prefix}/download-error`,
      method: 'get',
      params: {
        entity,
        timestamp,
      },
    })
    .then((result) => result.data.result)

export default { getSignedUrl, fetchRosterLogs, downloadEntityError }
