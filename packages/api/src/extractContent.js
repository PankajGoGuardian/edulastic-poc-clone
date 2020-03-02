import API from "./utils/API";

const api = new API();
const prefix = "/file";

const qtiExtract = data => {
  return api
    .callApi({
      url: `${prefix}/qti-import`,
      method: "post",
      data
    })
    .then(({ data: response }) => response);
};

export default {
  qtiExtract
};
