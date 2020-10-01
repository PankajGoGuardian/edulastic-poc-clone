import API from './utils/API'

const api = new API()
const prefix = '/tag'

const getAll = (tagType) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'get',
      params: { tagType },
    })
    .then((result) => result.data.result)

const create = (data) =>
  api
    .callApi({
      url: prefix,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

export default {
  getAll,
  create,
}
