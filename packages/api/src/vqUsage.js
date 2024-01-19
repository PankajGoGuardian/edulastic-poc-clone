import API from './utils/API'

const api = new API()

const getVQUsageCount = () =>
  api
    .callApi({
      url: `/vqUsage`,
      method: 'get',
    })
    .then(({ data }) => data)

export default {
  getVQUsageCount,
}
