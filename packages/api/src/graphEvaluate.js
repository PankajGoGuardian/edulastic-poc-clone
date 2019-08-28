import API from "./utils/API";

const api = new API();
const convertLatex2Js = "/convertLatex2Js";
const graphEvaluate = "/graphEvaluate";

const convert = data =>
  api
    .callApi({
      url: convertLatex2Js,
      method: "post",
      data
    })
    .then(result => result.data.result);

const evaluate = data => {
  return api
    .callApi({
      url: graphEvaluate,
      method: "post",
      data
    })
    .then(result => result.data.result);
};

export default {
  convert,
  evaluate
};
