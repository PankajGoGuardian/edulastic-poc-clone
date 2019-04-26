import API from "./utils/API";

const api = new API(`//edulastic-poc.snapwiz.net/math-api`);

const evaluate = data =>
  api
    .callApi({
      method: "post",
      url: "/evaluate",
      data
    })
    .then(result => result.data);

const calculate = data =>
  api
    .callApi({
      method: "post",
      url: "/calculate",
      data
    })
    .then(result => result.data);

export default {
  evaluate,
  calculate
};
