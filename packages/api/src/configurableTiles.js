import API from './utils/API'

const api = new API()
const prefix = '/config-tiles'

const fetchTiles = () =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const fetchTileById = (id) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const createTile = (data) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const updateTile = (id, data) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const removeTile = (id) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'delete',
    })
    .then((result) => result.data.result)

export default {
  fetchTiles,
  fetchTileById,
  createTile,
  updateTile,
  removeTile,
}
