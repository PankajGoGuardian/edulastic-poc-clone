import API from "./utils/API";

const api = new API();
const prefix = "/setting";

// District Profile
const getDistrictProfile = ({ orgId }) =>
  api
    .callApi({
      url: `${prefix}/general/${orgId}?orgType=district`,
      method: "get"
    })
    .then(result => result.data.result);

const updateDistrictProfile = data =>
  api
    .callApi({
      url: `${prefix}/general/`,
      method: "put",
      data
    })
    .then(result => result.data.result);

const createDistrictProfile = data =>
  api
    .callApi({
      url: `${prefix}/general/`,
      method: "post",
      data
    })
    .then(result => result.data.result);

// term apis
const getTerm = ({ orgId }) =>
  api
    .callApi({
      url: `${prefix}/term?districtId=${orgId}`,
      method: "get"
    })
    .then(result => result.data.result);

const createTerm = ({ body }) =>
  api
    .callApi({
      url: `${prefix}/term/`,
      method: "post",
      data: body
    })
    .then(result => result.data.result);

const updateTerm = ({ body }) =>
  api
    .callApi({
      url: `${prefix}/term/`,
      method: "put",
      data: body
    })
    .then(result => result.data.result);

const deleteTerm = ({ body }) =>
  api
    .callApi({
      url: `${prefix}/term/${body.termId}?districtId=${body.orgId}`,
      method: "delete",
      data: body
    })
    .then(result => result.data.result);

// Test Setting Apis
const getTestSetting = ({ orgId }) =>
  api
    .callApi({
      url: `${prefix}/test/${orgId}?orgType=district`,
      method: "get"
    })
    .then(result => result.data.result);

const updateTestSetting = data =>
  api
    .callApi({
      url: `${prefix}/test`,
      method: "put",
      data
    })
    .then(result => result.data.result);

const createTestSetting = data =>
  api
    .callApi({
      url: `${prefix}/test`,
      method: "post",
      data
    })
    .then(result => result.data.result);

// District Policy
const getDistrictPolicy = ({ orgId }) =>
  api
    .callApi({
      url: `${prefix}/district-policy/${orgId}?orgType=district`,
      method: "get"
    })
    .then(result => result.data.result);

const updateDistrictPolicy = data =>
  api
    .callApi({
      url: `${prefix}/district-policy/`,
      method: "put",
      data
    })
    .then(result => result.data.result);

const createDistrictPolicy = data =>
  api
    .callApi({
      url: `${prefix}/district-policy/`,
      method: "post",
      data
    })
    .then(result => result.data.result);

// standards proficiency
const getStandardsProficiency = ({ orgId }) =>
  api
    .callApi({
      url: `${prefix}/standards-proficiency/${orgId}?orgType=district`,
      method: "get"
    })
    .then(result => result.data.result);

const createStandardsProficiency = data =>
  api
    .callApi({
      url: `${prefix}/standards-proficiency/`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const updateStandardsProficiency = data =>
  api
    .callApi({
      url: `${prefix}/standards-proficiency/`,
      method: "put",
      data
    })
    .then(result => result.data.result);

// PerformanceBand
const getPerformanceBand = ({ orgId }) =>
  api
    .callApi({
      url: `${prefix}/performance-band/${orgId}?orgType=district`,
      method: "get"
    })
    .then(result => result.data.result);

const createPerformanceBand = data =>
  api
    .callApi({
      url: `${prefix}/performance-band/`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const updatePerformanceBand = data =>
  api
    .callApi({
      url: `${prefix}/performance-band/`,
      method: "put",
      data
    })
    .then(result => result.data.result);

// interested standards
const getInterestedStandards = ({ orgId }) =>
  api
    .callApi({
      url: `${prefix}/intrested-standards/${orgId}?orgType=district`,
      method: "get"
    })
    .then(result => result.data.result);

const saveInterestedStandards = body =>
  api
    .callApi({
      url: `${prefix}/intrested-standards/`,
      method: "post",
      data: body
    })
    .then(result => result.data.result);

const updateInterestedStandards = body =>
  api
    .callApi({
      url: `${prefix}/intrested-standards/`,
      method: "put",
      data: body
    })
    .then(result => result.data.result);

export default {
  getDistrictProfile,
  updateDistrictProfile,
  createDistrictProfile,
  getDistrictPolicy,
  createDistrictPolicy,
  updateDistrictPolicy,
  getTestSetting,
  createTestSetting,
  updateTestSetting,
  getTerm,
  createTerm,
  updateTerm,
  deleteTerm,
  getStandardsProficiency,
  createStandardsProficiency,
  updateStandardsProficiency,
  getPerformanceBand,
  createPerformanceBand,
  updatePerformanceBand,
  getInterestedStandards,
  saveInterestedStandards,
  updateInterestedStandards
};
