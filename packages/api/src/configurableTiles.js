import API from './utils/API'

const api = new API()
const prefix = '/config-tiles'

const fetchTiles = (version, state) =>
  api
    .callApi({
      url: `${prefix}/${version}${state ? `?state=${state}` : ''}`,
      method: 'get',
    })
    .then((result) => result.data)

const fetchTileById = (id) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'get',
    })
    .then((result) => result.data)

const fetchRecommendedTest = () =>
  api
    .callApi({
      url: `${prefix}/tests-recommendations`,
      method: 'get',
    })
    .then((result) => result.data)

const createTile = (data) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'post',
      data,
    })
    .then((result) => result.data)

const updateTile = (id, data) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data,
    })
    .then((result) => result.data)

const removeTile = (id) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'delete',
    })
    .then((result) => result.data)

export default {
  fetchTiles,
  fetchTileById,
  createTile,
  updateTile,
  removeTile,
  fetchRecommendedTest,
}
