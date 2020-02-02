import API from "./utils/API";

const api = new API();
const prefix = "/custom-report";
const getCustomReports = () =>
  api
    .callApi({
      url: `${prefix}`,
      method: "get"
    })
    .then(({ data }) => data.result);

const getCustomReportsURL = id =>
  api
    .callApi({
      url: `${prefix}/${id}/report-url`,
      method: "get"
    })
    .then(({ data }) => data.result);

export default {
  getCustomReports,
  getCustomReportsURL
};
