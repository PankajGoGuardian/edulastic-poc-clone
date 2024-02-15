import API from './utils/API'

const api = new API()
const prefix = '/feedback'
const addFeedback = (id, data) =>
  api
    .callApi({
      url: `${prefix}/feedback/${id}`,
      method: 'post',
      data,
    })
    .then((r) => r.data)

const editFeedback = (id, data) =>
  api
    .callApi({
      url: `${prefix}/feedback/${id}`,
      method: 'put',
      data,
    })
    .then((r) => r.data)

const getFeedbacks = (id, params) =>
  api
    .callApi({
      url: `${prefix}/feedbacks/${id}`,
      method: 'get',
      params,
    })
    .then((r) => r.data)

const deleteFeedback = (id, params) =>
  api
    .callApi({
      url: `${prefix}/feedback/${id}`,
      method: 'delete',
      params,
    })
    .then((r) => r.data)

export default {
  addFeedback,
  editFeedback,
  getFeedbacks,
  deleteFeedback,
}
