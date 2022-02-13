import API from './utils/API'

const api = new API()
const prefix = '/recommendations'

const fetchRecommendations = () =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const getDifferentiationWork = (testId) =>
  api
    .callApi({
      url: `${prefix}/test/${testId}/differentiation-standards`,
      method: 'get',
    })
    .then((result) => result.data.result)

const acceptRecommendations = (data) =>
  api
    .callApi({
      url: `${prefix}/accept`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const getRecommendationsStatus = ({ assignmentId, groupId }) =>
  api
    .callApi({
      url: `${prefix}?assignmentId=${assignmentId}&groupId=${groupId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const getRecommendedReviewStandards = (data) =>
  api
    .callApi({
      url: `${prefix}/differentiation-standards`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

export default {
  fetchRecommendations,
  getDifferentiationWork,
  acceptRecommendations,
  getRecommendationsStatus,
  getRecommendedReviewStandards,
}
