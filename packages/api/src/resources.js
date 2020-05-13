import API from "./utils/API";

const api = new API();
const prefix = "/resources";

const fetchResources = () =>
  api
    .callApi({
      url: `${prefix}`,
      method: "get"
    })
    .then(result => result.data.result);

const addResource = data =>
  api
    .callApi({
      url: `${prefix}`,
      method: "post",
      data
    })
    .then(result => result.data.result);

export default {
  addResource,
  fetchResources
};
