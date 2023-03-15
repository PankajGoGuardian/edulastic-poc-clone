import API from './utils/API'

const api = new API()
const prefix = '/advance-search'

const advancedSearch = (data) =>
  api
    .callApi({
      url: `${prefix}/query`,
      method: 'post',
      data,
    })
    .then(({ data: { result } }) => result.data.hits)

export default {
  advancedSearch,
}
