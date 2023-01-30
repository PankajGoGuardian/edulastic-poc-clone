import qs from 'qs'
import API from './utils/API'

const api = new API()
const prefix = '/data-warehouse'

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
const getWholeStudentReport = (data) => {
  const queryString = qs.stringify(data)
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/whole-student-report?${queryString}`,
    method: 'get',
    data,
  })
}

const getMARChartMetrics = (data) => {
  const queryString = qs.stringify(data)
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/multiple-assessment-report/chart?${queryString}`,
    method: 'get',
    data,
  })
}

const getMARTableMetrics = (data) => {
  const queryString = qs.stringify(data)
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/multiple-assessment-report/table?${queryString}`,
    method: 'get',
    data,
  })
}

const getAttendanceMetrics = (data) => {
  const queryString = qs.stringify(data)
  return api.callApi({
    useSlowApi: true,
    url: `${prefix}/whole-student-report/attendance?${queryString}`,
    method: 'get',
    data,
  })
}

export default {
  getSignedUrl,
  getDataWarehouseLogs,
  updateDatawarehouseLogsStatus,
  getWholeStudentReport,
  getMARChartMetrics,
  getMARTableMetrics,
  getAttendanceMetrics,
}
