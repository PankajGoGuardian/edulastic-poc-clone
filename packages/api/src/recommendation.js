import API from "./utils/API";

const api = new API();
const prefix = "/recommendations";

const getDifferentiationWork = testId =>
  api
    .callApi({
      url: `${prefix}/test/${testId}/differentiation-standards`,
      method: "get"
    })
    .then(result => result.data.result);

const acceptRecommendations = data =>
  api
    .callApi({
      url: `${prefix}/accept`,
      method: "post",
      data
    })
    .then(result => result.data.result);

export default {
  getDifferentiationWork,
  acceptRecommendations
};
