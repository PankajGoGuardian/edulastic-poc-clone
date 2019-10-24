import API from "./utils/API";

const api = new API(`${process.env.POI_APP_API_URI}`);
const convertLatex2Js = "/graph-api/convertLatex2Js";
const graphEvaluate = "/graph-api/evaluate";

const convert = data =>
  api
    .callApi({
      url: convertLatex2Js,
      method: "post",
      data
    })
    .then(result => result.data);

const evaluate = (data, type) =>
  api
    .callApi({
      url: `${graphEvaluate}/${type}`,
      method: "post",
      data
    })
    .then(result => {
      return result.data;
    });

export default {
  convert,
  evaluate
};
