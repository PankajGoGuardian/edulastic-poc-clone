import API from './utils/API'

const api = new API()
const prefix = '/setting'

// District Profile
const getDistrictProfile = ({ orgId, orgType }) =>
  api
    .callApi({
      url: `${prefix}/general/${orgId}?orgType=${orgType}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const updateDistrictProfile = (data) =>
  api
    .callApi({
      url: `${prefix}/general/`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const createDistrictProfile = (data) =>
  api
    .callApi({
      url: `${prefix}/general/`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const getOrgDetailsByShortNameAndOrgType = (params) =>
  api
    .callApi({
      url: `/auth/setting/org-data/`,
      params,
    })
    .then((result) => result.data.result)

// term apis
const getTerm = ({ orgId }) =>
  api
    .callApi({
      url: `${prefix}/term?districtId=${orgId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const createTerm = ({ body }) =>
  api
    .callApi({
      url: `${prefix}/term/`,
      method: 'post',
      data: body,
    })
    .then((result) => result.data.result)

const updateTerm = ({ body }) =>
  api
    .callApi({
      url: `${prefix}/term/`,
      method: 'put',
      data: body,
    })
    .then((result) => result.data.result)

const deleteTerm = ({ body }) =>
  api
    .callApi({
      url: `${prefix}/term/${body.termId}?districtId=${body.orgId}`,
      method: 'delete',
      data: body,
    })
    .then((result) => result.data.result)

// Test Setting Apis
const getTestSetting = ({ orgId, orgType = 'district' }) =>
  api
    .callApi({
      url: `${prefix}/test/${orgId}?orgType=${orgType}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const updateTestSetting = (data) =>
  api
    .callApi({
      url: `${prefix}/test`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const createTestSetting = (data) =>
  api
    .callApi({
      url: `${prefix}/test`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const removeTestSetting = (testSettingsId) =>
  api
    .callApi({
      url: `${prefix}/archive-test-setting/${testSettingsId}`,
      method: 'put',
    })
    .then((result) => result.data.result)

const getTestSettingsList = ({ orgId, orgType }) =>
  api
    .callApi({
      url: `${prefix}/testSettings/${orgId}?orgType=${orgType}`,
      method: 'get',
    })
    .then((result) => result.data.result)

// District Policy
const getDistrictPolicy = ({ orgId, orgType = 'district' }) =>
  api
    .callApi({
      url: `${prefix}/district-policy/${orgId}?orgType=${orgType}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const updateDistrictPolicy = (data) =>
  api
    .callApi({
      url: `${prefix}/district-policy/`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const createDistrictPolicy = (data) =>
  api
    .callApi({
      url: `${prefix}/district-policy/`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

// standards proficiency
const getStandardsProficiency = ({ orgId }) =>
  api
    .callApi({
      url: `${prefix}/standards-proficiency/${orgId}?orgType=district`,
      method: 'get',
    })
    .then((result) => result.data.result)

const createStandardsProficiency = (data) =>
  api
    .callApi({
      url: `${prefix}/standards-proficiency/`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const updateStandardsProficiency = ({ _id, ...data }) =>
  api
    .callApi({
      url: `${prefix}/standards-proficiency/${_id}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const deleteStandardsProficiency = (_id, districtId) =>
  api
    .callApi({
      url: `${prefix}/standards-proficiency/${_id}`,
      params: { districtId },
      method: 'delete',
    })
    .then((result) => result.data.result)

// PerformanceBand
const getPerformanceBand = ({ orgId }) =>
  api
    .callApi({
      url: `${prefix}/performance-band/${orgId}?orgType=district`,
      method: 'get',
    })
    .then((result) => result.data.result)

const createPerformanceBand = (data) =>
  api
    .callApi({
      url: `${prefix}/performance-band/`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const updatePerformanceBand = ({ _id, ...data }) =>
  api
    .callApi({
      url: `${prefix}/performance-band/${_id}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const deletePerformanceBand = (_id, districtId) =>
  api
    .callApi({
      url: `${prefix}/performance-band/${_id}`,
      params: { districtId },
      method: 'delete',
    })
    .then((result) => result.data)

// interested standards
const getInterestedStandards = ({ orgId, orgType = 'district' }) =>
  api
    .callApi({
      url: `${prefix}/interested-standards/${orgId}?orgType=${orgType}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const saveInterestedStandards = (body) =>
  api
    .callApi({
      url: `${prefix}/interested-standards/`,
      method: 'post',
      data: body,
    })
    .then((result) => result.data.result)

const updateInterestedStandards = (body) =>
  api
    .callApi({
      url: `${prefix}/interested-standards/`,
      method: 'put',
      data: body,
    })
    .then((result) => result.data.result)

const getExternalTools = ({ orgId, orgType = 'district' }) =>
  api
    .callApi({
      url: `${prefix}/general/${orgId}/external-tools?orgType=${orgType}`,
      method: 'get',
    })
    .then((result) => result.data.result?.externalTools || [])

const createExternalTools = ({ orgId, orgType = 'district', body }) =>
  api
    .callApi({
      url: `${prefix}/general/${orgId}/external-tools?orgType=${orgType}`,
      method: 'post',
      data: body,
    })
    .then((result) => result.data.result.externalTools)

const updateExternalTools = ({
  orgId,
  orgType = 'district',
  externalToolId,
  body,
}) =>
  api
    .callApi({
      url: `${prefix}/general/${orgId}/external-tools/${externalToolId}?orgType=${orgType}`,
      method: 'put',
      data: body,
    })
    .then((result) => result.data.result.externalTools)

const deleteExternalTools = ({ orgId, orgType = 'district', externalToolId }) =>
  api
    .callApi({
      url: `${prefix}/general/${orgId}/external-tools/${externalToolId}?orgType=${orgType}`,
      method: 'delete',
    })
    .then((result) => result.data.result.externalTools)

const saveCanvasIntegrationKeys = (data) =>
  api
    .callApi({
      url: `${prefix}/canvas-integration-keys`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const fetchOrgInterestedStandards = ({ districtId, institutionId }) =>
  api
    .callApi({
      url: `${prefix}/minimal-org-settings`,
      method: 'get',
      params: { districtId, institutionId },
    })
    .then((result) => result.data.result)

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
  deleteStandardsProficiency,
  getPerformanceBand,
  createPerformanceBand,
  deletePerformanceBand,
  updatePerformanceBand,
  getInterestedStandards,
  saveInterestedStandards,
  updateInterestedStandards,
  getOrgDetailsByShortNameAndOrgType,
  getExternalTools,
  createExternalTools,
  updateExternalTools,
  deleteExternalTools,
  saveCanvasIntegrationKeys,
  getTestSettingsList,
  removeTestSetting,
  fetchOrgInterestedStandards,
}
