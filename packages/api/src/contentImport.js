import API from "./utils/API";

const api = new API();
const prefix = "/content";

const qtiImport = data => {
  return api
    .callApi({
      url: `${prefix}/qti-import`,
      method: "post",
      data
    })
    .then(({ data: response }) => response);
};

const qtiImportProgress = data => {
  return api
    .callApi({
      url: `${prefix}/qti-import-progress`,
      method: "post",
      data
    })
    .then(({ data: response }) => response);
};

export default {
  qtiImport,
  qtiImportProgress
};
