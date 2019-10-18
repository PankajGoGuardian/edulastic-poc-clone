import API from "./utils/API";

const api = new API(`${process.env.POI_APP_API_URI}`);

const evaluate = (data, type) =>
  api
    .callApi({
      method: "post",
      url: `math/evaluate/${type}`,
      data
    })
    .then(result => result.data);

const calculate = data =>
  api
    .callApi({
      method: "post",
      url: "math/calculate",
      data
    })
    .then(result => result.data);

export default {
  evaluate,
  calculate
};
