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

const updateResource = (data) => {
  const id = data?.id
  delete data.id
  return api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)
}

const deleteResource = (data) =>
  api
    .callApi({
      url: `${prefix}/${data}`,
      method: 'delete',
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

const getRecommendedResources = (data) =>
  api
    .callApi({
      url: `${prefix}/recommendations`,
      method: 'post',
      data,
    })
    .then((response) => response?.data?.result)

export default {
  addResource,
  fetchResources,
  updateStandards,
  searchResource,
  getRecommendedResources,
  updateResource,
  deleteResource,
}
