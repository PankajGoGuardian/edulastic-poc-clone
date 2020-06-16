import API from "./utils/API";

const api = new API();
const prefix = "/analytics";

const toggleLike = payload => {
  const { versionId, ...data } = payload;
  return api
    .callApi({
      url: `${prefix}/toggle-like`,
      method: "post",
      data
    })
    .then(result => result.data.result);
};

export default {
  toggleLike
};
