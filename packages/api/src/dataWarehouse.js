import { reportNavType } from '@edulastic/constants/const/report'
import qs from 'qs'
import API from './utils/API'

const api = new API()
const prefix = '/data-warehouse'
const WHOLE_LEARNER_REPORT = 'whole-learner-report'
const MULTIPLE_ASSESSMENT_REPORT = 'multiple-assessment-report'
const GOALS_INTERVENTIONS = 'goals-interventions'

const {
  DW_DASHBOARD_REPORT,
  DW_EARLY_WARNING_REPORT,
  DW_EFFICACY_REPORT,
} = reportNavType

const getSignedUrl = (params) =>
  api
    .callApi({
      url: `${prefix}/signed-url`,
      method: 'get',
      params,
    })
    .then((result) => result.data.result)

const deleteUploadLog = (params) =>
  api
    .callApi({
      url: `${prefix}/upload-log`,
      method: 'delete',
      params,
    })
    .then((result) => result.data.result)

const getDataWarehouseLogs = () =>
  api
    .callApi({
      url: prefix,
      method: 'get',
    })
    .then((result) => result.data.result)

const updateDatawarehouseLogsStatus = (id, data) =>
  api
    .callApi({
      url: `${prefix}/${id}/status`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

/**
 * @param {{reportId: string} | {studentId: string, termId: strign}} data
 */
const getWholeLearnerReport = (data) => {
  const queryString = qs.stringify(data)
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${WHOLE_LEARNER_REPORT}?${queryString}`,
    method: 'get',
    data,
  })
}

const getMARChartMetrics = (data) => {
  const queryString = qs.stringify(data)
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${MULTIPLE_ASSESSMENT_REPORT}/chart?${queryString}`,
    method: 'get',
    data,
  })
}

const getMARTableMetrics = (data) => {
  const queryString = qs.stringify(data)
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${MULTIPLE_ASSESSMENT_REPORT}/table?${queryString}`,
    method: 'get',
    data,
  })
}

const getAttendanceMetrics = (data) => {
  const queryString = qs.stringify(data)
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${WHOLE_LEARNER_REPORT}/attendance?${queryString}`,
    method: 'get',
    data,
  })
}

const getRiskMetrics = (data) =>
  api.callApi({
    url: `${prefix}/${WHOLE_LEARNER_REPORT}/risk`,
    method: 'get',
    params: data,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: 'comma' }),
  })

const getDashboardAcademicSummary = (data) => {
  const queryString = qs.stringify(data)
  return api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/${DW_DASHBOARD_REPORT}/academic-summary?${queryString}`,
      method: 'get',
      data,
    })
    .then((result) => result.data)
}

const getDashboardAttendanceSummary = (data) => {
  const queryString = qs.stringify(data)
  return api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/${DW_DASHBOARD_REPORT}/attendance-summary?${queryString}`,
      method: 'get',
      data,
    })
    .then((result) => result.data)
}

const getDashboardDistrictAverages = (params) => {
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${DW_DASHBOARD_REPORT}/district-averages`,
    params,
  })
}

const getDashboardTableMetrics = (params) => {
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${DW_DASHBOARD_REPORT}/details`,
    params,
  })
}

const getEarlyWarningRiskSummary = (params) => {
  return api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/${DW_EARLY_WARNING_REPORT}/summary`,
      params,
    })
    .then((result) => result)
}

const getRiskTimeline = (params) => {
  return api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/${DW_EARLY_WARNING_REPORT}/timeline`,
      params,
    })
    .then((result) => result)
}

const getEarlyWarningDetails = (params) => {
  return api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/${DW_EARLY_WARNING_REPORT}/details`,
      params,
    })
    .then((result) => result.data)
}

const getEfficacySummary = (params) => {
  return api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/${DW_EFFICACY_REPORT}/summary`,
      params,
    })
    .then((result) => result.data)
}

const getEfficacyDetails = (params) => {
  return api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/${DW_EFFICACY_REPORT}/details`,
      params,
    })
    .then((result) => result.data)
}

const goalsAndInterventionsAdvanceSearchStudents = (
  advanceSearchQuery,
  paginationDetails
) => {
  const {
    page = 1,
    pageSize = 10,
    sortKey = 'dimension',
    sortOrder = 'asc',
  } = paginationDetails

  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${GOALS_INTERVENTIONS}/advance-search-students?sortKey=${sortKey}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`,
    method: 'post',
    data: advanceSearchQuery,
  })
}
const saveGroupdDataWithAdvSearch = (data) => {
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${GOALS_INTERVENTIONS}/student-group`,
    method: 'post',
    data,
  })
}

const deleteGroup = (id) => {
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${GOALS_INTERVENTIONS}/student-group/${id}`,
    method: 'delete',
  })
}

const updateGroupWithAdvSearch = (id, data) => {
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${GOALS_INTERVENTIONS}/student-group/${id}`,
    method: 'put',
    data,
  })
}

const getFeedTypes = (districtId) => {
  const reqObj = {
    url: `${prefix}/feed-types`,
    method: 'get',
  }
  if (districtId) reqObj.params = { districtId }

  return api.callApi(reqObj).then((result) => result.data)
}

export default {
  getSignedUrl,
  deleteUploadLog,
  getDataWarehouseLogs,
  updateDatawarehouseLogsStatus,
  getWholeLearnerReport,
  getMARChartMetrics,
  getMARTableMetrics,
  getAttendanceMetrics,
  getDashboardAcademicSummary,
  getDashboardAttendanceSummary,
  getDashboardDistrictAverages,
  getDashboardTableMetrics,
  getEarlyWarningRiskSummary,
  getRiskTimeline,
  getEarlyWarningDetails,
  goalsAndInterventionsAdvanceSearchStudents,
  saveGroupdDataWithAdvSearch,
  updateGroupWithAdvSearch,
  deleteGroup,
  getEfficacySummary,
  getEfficacyDetails,
  getRiskMetrics,
  getFeedTypes,
}
