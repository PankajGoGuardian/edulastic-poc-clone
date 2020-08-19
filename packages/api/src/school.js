import API from "./utils/API";

const api = new API();
const prefix = "/school";

const getSchools = data =>
  api
    .callApi({
      url: `${prefix}/search`,
      method: "post",
      data
    })
    .then(result => result.data);

const updateSchool = ({ id, body }) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: "put",
      data: body
    })
    .then(result => result.data.result);

const createSchool = data =>
  api
    .callApi({
      url: `${prefix}/`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const deleteSchool = data =>
  api
    .callApi({
      url: `${prefix}`,
      method: "delete",
      data
    })
    .then(({ data: { result } }) => result);

const searchSchool = body =>
  api
    .callApi({
      url: "search/schools",
      method: "post",
      data: body
    })
    .then(result => result.data.result);

const searchDistricts = body =>
  api.callApi({
    url: "search/districts",
    method: "post",
    data: body
  });

const searchSchoolsByName = ({ districtId, schoolName }) =>
  api
    .callApi({
      url: `${prefix}/${districtId}/searchByName`,
      method: "get",
      params: {
        schoolName
      }
    })
    .then(({ data }) => data.result);

const updateSchoolApprovalStatus = payload =>
  api
    .callApi({
      url: `${prefix}/bulk/approval-status`,
      method: "put",
      data: payload
    })
    .then(result => result);

export default {
  getSchools,
  updateSchool,
  createSchool,
  deleteSchool,
  searchSchool,
  searchDistricts,
  searchSchoolsByName,
  updateSchoolApprovalStatus
};
