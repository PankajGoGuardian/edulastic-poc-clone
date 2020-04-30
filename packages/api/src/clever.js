import API from "./utils/API";

const api = new API();
const prefix = "/clever";

const fetchCleverClasses = () =>
  api
    .callApi({
      url: `${prefix}/clever-classes`,
      method: "get"
    })
    .then(result => result.data);

const syncCleverClasses = data =>
  api
    .callApi({
      url: `${prefix}/class-sync`,
      method: "post",
      data
    })
    .then(result => result.data.result);

export default {
  fetchCleverClasses,
  syncCleverClasses
};
