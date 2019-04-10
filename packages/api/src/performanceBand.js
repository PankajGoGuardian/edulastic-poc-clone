import API from "./utils/API";

const api = new API();
const prefix = "/setting/performance-band";

const getPerformanceBand = ({ orgId }) =>
  api
    .callApi({
      url: `${prefix}/${orgId}?orgType=district`,
      method: "get"
    })
    .then(result => result.data.result);

const createPerformanceBand = ({ body }) =>
  api
    .callApi({
      url: `${prefix}/`,
      method: "post",
      data: body
    })
    .then(result => result.data.result);

const updatePerformanceBand = ({ body }) =>
  api
    .callApi({
      url: `${prefix}/`,
      method: "put",
      data: body
    })
    .then(result => result.data.result);

export default {
  getPerformanceBand,
  createPerformanceBand,
  updatePerformanceBand
};
