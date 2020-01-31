import API from "./utils/API";

const api = new API();
const BASE_URL = "/payment";
const pay = data =>
  api
    .callApi({
      method: "post",
      url: `${BASE_URL}/teacher`,
      data
    })
    .then(result => result.data);

export default {
  pay
};
