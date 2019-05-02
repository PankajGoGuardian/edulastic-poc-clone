import API from "./utils/API";

const api = new API();
const prefix = "/clever/";

const searchUpdateDistrict = params =>
  api
    .callApi({
      url: `${prefix}search`,
      method: "get",
      params
    })
    .then(({ data }) => data);

const updateDistrictCleverId = data =>
  api
    .callApi({
      url: `${prefix}update-clever`,
      method: "post",
      data
    })
    .then(({ data }) => data);

export default {
  searchUpdateDistrict,
  updateDistrictCleverId
};
