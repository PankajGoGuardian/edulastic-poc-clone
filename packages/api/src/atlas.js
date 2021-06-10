import API from './utils/API'

const api = new API()
const prefix = '/atlas'

const syncGradesWithSchoologyClassroom = (data) =>
  api
    .callApi({
      url: `${prefix}/sync-grades-with-atlas`,
      method: 'POST',
      data,
    })
    .then((result) => result.data)

export default {
  syncGradesWithSchoologyClassroom,
}
