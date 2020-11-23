import API from './utils/API'

const api = new API()
const prefix = '/collaboration-group'

const fetchGroups = () =>
  api
    .callApi({
      url: `${prefix}/`,
      method: 'get',
    })
    .then((result) => result.data)

const createGroup = (data) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

export default {
  fetchGroups,
  createGroup,
}
