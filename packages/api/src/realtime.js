import API from "./utils/API";

const api = new API();

const getSignedUrl = () =>
  api
    .callApi({
      url: "/realtime/url",
      method: "get"
    })
    .then(res => res.data);

export default {
  getSignedUrl
};
