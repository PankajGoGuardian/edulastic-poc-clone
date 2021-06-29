import qs from 'qs'
import API from './utils/API'

const api = new API()
const prefix = '/resources'

const fetchResources = () =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const addResource = (data) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const updateStandards = (data) =>
  api
    .callApi({
      url: `${prefix}/standards`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const searchResource = (data) =>
  api
    .callApi({
      url: `${prefix}/search`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result?.hits?.hits)

const addRecommendedResources = (data) => {
  const queryString = qs.stringify({ resourceIdsToFetch: data.resourceIds })
  return api
    .callApi({
      url: `${prefix}/recommendation/${data.testId}?${queryString}`,
      method: 'get',
      data,
    })
    .then((result) => result.data.result)
}

export default {
  addResource,
  fetchResources,
  updateStandards,
  searchResource,
  addRecommendedResources,
}
