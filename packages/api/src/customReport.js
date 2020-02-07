import API from "./utils/API";

const api = new API();
const prefix = "/custom-report";
const getCustomReports = params =>
  api
    .callApi({
      url: `${prefix}`,
      method: "get",
      params
    })
    .then(({ data }) => data.result);

const getCustomReportsURL = id =>
  api
    .callApi({
      url: `${prefix}/${id}/report-url`,
      method: "get"
    })
    .then(({ data }) => data.result);

const updatePermissionStatus = ({ _id, enable, permissionIds }) =>
  api
    .callApi({
      url: `${prefix}/${_id}/permissions`,
      method: "put",
      data: { enable, permissionIds }
    })
    .then(({ data }) => data.result);

/*TODO: create new api and change the url*/
const updateCustomReport = data =>
  api
    .callApi({
      url: `${prefix}/new-report`,
      method: "put",
      data
    })
    .then(({ data }) => data.result);

/*TODO: create new api and change the url*/
const createCustomReport = data =>
  api
    .callApi({
      url: `${prefix}/new-report`,
      method: "post",
      data
    })
    .then(({ data }) => data.result);

export default {
  getCustomReports,
  getCustomReportsURL,
  updatePermissionStatus,
  updateCustomReport,
  createCustomReport
};
