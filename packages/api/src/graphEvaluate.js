import API from "./utils/API";

const api = new API("https://1nz4dq81w6.execute-api.us-east-1.amazonaws.com/dev", "Bearer Token: U4aJ6616mlTFKK");
const convertLatex2Js = "/convertLatex2Js";
const graphEvaluate = "/evaluate";

const convert = data =>
  api
    .callApi({
      url: convertLatex2Js,
      method: "post",
      data
    })
    .then(result => result.data.result);

const evaluate = data =>
  api
    .callApi({
      url: graphEvaluate,
      method: "post",
      data
    })
    .then(result => {
      console.log("graphApiEvaluate", result.data.result);
      return result.data.result;
    });

export default {
  convert,
  evaluate
};
