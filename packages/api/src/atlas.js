import API from './utils/API'

const api = new API()
const atlasPrefix = '/atlas'

const getCourseList = ({ code }) =>
  api
    .callApi({
      url: `${atlasPrefix}/courses`,
      method: 'post',
      data: { code },
    })
    .then(({ data }) => data)

const bulkSyncClasses = (payload) =>
  api
    .callApi({
      url: `${atlasPrefix}/sync-all-classes`,
      method: 'post',
      data: payload,
    })
    .then(({ data }) => data)

export default {
  getCourseList,
  bulkSyncClasses,
}
