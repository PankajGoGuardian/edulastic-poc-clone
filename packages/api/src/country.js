import API from "./utils/API";

const api = new API();
const prefix = "/country";

const getCountries = () =>
  api
    .callApi({
      url: `${prefix}/`,
      method: "get"
    })
    .then(result => result.data.result);

export default {
  getCountries
};
