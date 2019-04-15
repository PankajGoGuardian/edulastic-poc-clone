import API from "./utils/API";

const api = new API();
const prefix = "/school";

const getSchools = ({ body }) =>
  api
    .callApi({
      url: `${prefix}/search`,
      method: "post",
      data: body
    })
    .then(result => result.data.data);

const updateSchool = ({ body }) =>
  api
    .callApi({
      url: `${prefix}/`,
      method: "put",
      data: body
    })
    .then(result => result.data.result);

const createSchool = ({ body }) =>
  api
    .callApi({
      url: `${prefix}/`,
      method: "post",
      data: body
    })
    .then(result => result.data.result);

const deleteSchool = ({ schoolId, orgId }) =>
  api
    .callApi({
      url: `${prefix}/${schoolId}?districtId=${orgId}`,
      method: "delete"
    })
    .then(result => result.data.result);

export default {
  getSchools,
  updateSchool,
  createSchool,
  deleteSchool
};
