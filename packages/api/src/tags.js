import qs from 'qs'
import API from './utils/API'

const api = new API()
const prefix = '/tag'

const getAll = (tagType) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'get',
      params: { tagType },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'comma' }),
    })
    .then((result) => result.data.result)

const create = (_data) => {
  const data = { ..._data, tagName: _data?.tagName?.trim() }
  return api
    .callApi({
      url: prefix,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)
}

const searchTags = (data) =>
  api
    .callApi({
      url: `search/tags`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

export default {
  getAll,
  create,
  searchTags,
}
