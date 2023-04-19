import { reportNavType } from '@edulastic/constants/const/report'
import qs from 'qs'
import API from './utils/API'

const api = new API()
const prefix = '/data-warehouse'
const WHOLE_LEARNER_REPORT = 'whole-learner-report'
const MULTIPLE_ASSESSMENT_REPORT = 'multiple-assessment-report'
const GOALS_INTERVENTIONS = 'goals-interventions'

const { DW_DASHBOARD_REPORT, DW_EARLY_WARNING_REPORT } = reportNavType

const getSignedUrl = (
  filename,
  category,
  versionYear,
  termId,
  testName,
  folder,
  subFolder
) =>
  api
    .callApi({
      url: `${prefix}/signed-url`,
      method: 'get',
      params: {
        filename,
        category,
        versionYear,
        termId,
        testName,
        subFolder,
        folder,
      },
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

const getDashboardTableMatrics = (data) => {
  const queryString = qs.stringify(data)
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${DW_DASHBOARD_REPORT}/details?${queryString}`,
    method: 'get',
    data,
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

const goalsAndInterventionsAdvanceSearchStudents = (advanceSearchQuery) => {
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${GOALS_INTERVENTIONS}/advance-search-students`,
    method: 'post',
    data: advanceSearchQuery,
  })
}
const saveGroupdDataWithAdvSearch = (data) => {
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/${GOALS_INTERVENTIONS}/create-student-group`,
    method: 'post',
    data,
  })
}

export default {
  getSignedUrl,
  getDataWarehouseLogs,
  updateDatawarehouseLogsStatus,
  getWholeLearnerReport,
  getMARChartMetrics,
  getMARTableMetrics,
  getAttendanceMetrics,
  getDashboardAcademicSummary,
  getDashboardAttendanceSummary,
  getDashboardTableMatrics,
  getEarlyWarningRiskSummary,
  getRiskTimeline,
  getEarlyWarningDetails,
  goalsAndInterventionsAdvanceSearchStudents,
  saveGroupdDataWithAdvSearch,
}
