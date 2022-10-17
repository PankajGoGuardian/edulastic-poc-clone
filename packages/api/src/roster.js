import API from './utils/API'

const api = new API()
const prefix = '/oneroster'

const fetchRosterLogs = () =>
  api
    .callApi({
      url: `${prefix}/oneroster-stats`,
      method: 'get',
    })
    .then((result) => result.data.result)

export default {
  fetchRosterLogs,
}
