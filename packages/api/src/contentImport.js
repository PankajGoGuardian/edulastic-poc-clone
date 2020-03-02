import API from "./utils/API";

const api = new API();
const prefix = "/file";

const qtiImport = data => {
  return api
    .callApi({
      url: `${prefix}/qtiImport`,
      method: "post",
      data
    })
    .then(({ data: response }) => response);
};

const qtiImportProgress = data => {
  return api
    .callApi({
      url: `${prefix}/qtiImportProgress`,
      method: "post",
      data
    })
    .then(({ data: response }) => response);
};

export default {
  qtiImport,
  qtiImportProgress
};
