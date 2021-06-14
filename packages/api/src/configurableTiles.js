import API from './utils/API'

const api = new API()
const prefix = '/config-tiles'

const fetchTiles = (version, state) => {
  const _state = state ? `?state=${state}` : ''
  return api
    .callApi({
      url: `${prefix}/${version}${_state}`,
      method: 'get',
    })
    .then((result) => result.data)
}

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
      useSlowApi: true,
      url: `${prefix}/recommend/tests`,
      method: 'get',
    })
    .then((result) => {
      const data = []
      const res = result?.data?.map((x) => x?.results)
      const totalElements = result?.data?.flatMap((x) => x?.results)?.length
      let currentIndex = 0
      while (data.length < totalElements) {
        // eslint-disable-next-line no-loop-func
        res.forEach((arr) => {
          if (currentIndex < arr?.length) {
            data.push(arr[currentIndex])
          }
        })
        currentIndex += 1
      }
      return data
    })

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
