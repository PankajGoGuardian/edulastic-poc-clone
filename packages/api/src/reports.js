import API from '@edulastic/api/src/utils/API'
import qs from 'qs'

const api = new API()
const prefix = '/test-activity/summary'
const dataWarehousePrefix = '/data-warehouse'
const goalsAndInterventionsPrefix = '/goals-interventions'

const fetchReports = (
  groupId = '',
  testId = '',
  assignmentId = '',
  groupStatus = 'all'
) => {
  const config = {
    url: `${prefix}`,
    method: 'get',
    params: {
      groupId,
      groupStatus,
      testId,
      assignmentId,
    },
  }

  return api.callApi(config).then((result) => result.data.result)
}

const fetchTestActivityDetail = (id) =>
  api
    .callApi({
      url: `/test-activity/${id}`,
      method: 'get',
    })
    .then((result) => result)

const fetchTestActivityReport = (id, groupId) =>
  api
    .callApi({
      url: `/test-activity/${id}/report`,
      method: 'get',
      params: {
        groupId,
      },
    })
    .then((result) => result.data.result)

const fetchSkillReport = (classId) =>
  api
    .callApi({
      url: `/skill-report/${classId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const fetchAssignments = () => api.callApi({ url: `/assignments` })

const fetchResponseFrequency = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/response-frequency`,
    params: { ...params.requestFilters, testId: params.testId },
  })

const fetchAssessmentSummaryReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/assessment-summary`,
    params: { ...params.requestFilters, testId: params.testId },
  })

const fetchPeerPerformanceReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/peer-performance`,
    params: { ...params.requestFilters, testId: params.testId },
  })

const fetchPerformanceByStandardSummary = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/performance-by-standards/summary`,
    params: { ...params.requestFilters, testId: params.testId },
  })

const fetchPerformanceByStandardDetails = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/performance-by-standards/details`,
    params: { ...params.requestFilters, testId: params.testId },
  })

const fetchPerformanceByStudentsSummary = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/performance-by-students/summary`,
    params: { ...params.requestFilters, testId: params.testId },
  })

const fetchPerformanceByStudentsDetails = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/performance-by-students/details`,
    params: { ...params.requestFilters, testId: params.testId },
  })

const fetchSARFilterData = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/filter/single-assessment`,
    params,
  })

const fetchStandardsProgressReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/standards-progress`,
    params,
  })

const fetchStandardsGradbookSkillInfo = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `report/standards-gradebook/skill-info`,
    params,
  })

const fetchStandardsGradebookSummary = (params) =>
  api.callApi({
    useSlowApi: true,
    url: '/report/standards-gradebook/summary',
    params,
  })

const fetchStandardsGradebookDetails = (params) =>
  api.callApi({
    useSlowApi: true,
    url: '/report/standards-gradebook/details',
    params,
  })

const fetchStandardsPerformanceSummaryReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/standards-summary`,
    params,
  })

const fetchStandardMasteryFilter = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/filter/standard-mastery`,
    params,
  })

const fetchStandardMasteryBrowseStandards = ({
  curriculumId,
  ...restParams
}) => {
  const curriculumIds =
    curriculumId && Array.isArray(curriculumId) ? curriculumId : [curriculumId]

  const data = {
    ...restParams,
    curriculumIds,
  }

  return api.callApi({
    url: `/search/browse-standards`,
    data,
    method: 'POST',
  })
}

const fetchQuestionAnalysisSummaryReport = (params) =>
  api
    .callApi({
      useSlowApi: true,
      url: `/report/question-analysis/summary`,
      params,
    })
    .then((response) => response.data.result)

const fetchQuestionAnalysisPerformanceReport = (params) =>
  api
    .callApi({
      useSlowApi: true,
      url: `report/question-analysis/details`,
      params,
    })
    .then((response) => response.data.result)

const fetchMARFilterData = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/filter/multiple-assessment`,
    params,
  })

const fetchPeerProgressAnalysisReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/peer-progress-analysis`,
    params,
  })

const fetchStudentProgressReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/student-progress`,
    params,
  })

const fetchPerformanceOverTimeReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/performance-over-time`,
    params,
  })

const fetchSPRFilterData = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/filter/student-profile`,
    params,
  })

const fetchStudentMasteryProfileReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/student-mastery-profile`,
    params,
  })

const fetchStudentAssessmentProfileReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/student-assessment-performance`,
    params,
  })

const fetchStudentProfileSummaryReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/student-profile-summary`,
    params,
  })

const fetchStudentProgressProfileReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/student-progress-profile`,
    params,
  })

const fetchStudentList = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/students`,
    method: 'POST',
    data: params,
  })

const fetchStudentStandards = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/student-standard`,
    params,
  })

const fetchStudentPerformance = (params) => {
  const queryString = qs.stringify(params)
  return api
    .callApi({
      useSlowApi: true,
      method: 'get',
      url: `/report/student-performance?${queryString}`,
    })
    .then(({ data }) => data.result)
}

const fetchEngagementSummary = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/engagement-summary`,
    params,
  })

const fetchActivityBySchool = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/activity-by-school`,
    params,
  })

const fetchActivityByTeacher = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/activity-by-teacher`,
    params,
  })

const generateCSV = (params) =>
  api
    .callApi({
      url: '/report/generate-csv',
      method: 'POST',
      data: params,
    })
    .then(({ data }) => data.result)

const fetchGeneratedCSVs = () =>
  api
    .callApi({
      url: '/report/generated-csv',
      method: 'GET',
    })
    .then(({ data }) => data.result)

const fetchPerformanceByRubricsCriteriaChartData = (params) =>
  api
    .callApi({
      url: '/report/performance-by-rubric/chart',
      params,
    })
    // FIXME remove `.result` which doesn't contain dataSize error
    .then((res) => res.data.result)

const fetchPerformanceByRubricsCriteriaTableData = (params) =>
  api
    .callApi({
      url: '/report/performance-by-rubric/table',
      params,
    })
    // FIXME remove `.result` which doesn't contain dataSize error
    .then((res) => res.data.result)

const fetchPreVsPostReportSummaryData = (params) =>
  api
    .callApi({
      url: '/report/pre-vs-post-test/summary',
      params,
    })
    .then((res) => res.data)

const fetchPreVsPostReportTableData = (params) =>
  api
    .callApi({
      url: '/report/pre-vs-post-test/table',
      params,
    })
    .then((res) => res.data)

const fetchAttendanceReportDetails = (params) =>
  api
    .callApi({
      url: '/data-warehouse/attendance/report/details',
      params,
    })
    .then((response) => response?.data?.result)

const fetchAttendanceSummaryReport = (params) =>
  api
    .callApi({
      url: `/data-warehouse/attendance/report`,
      params,
    })
    .then((response) => response?.data?.result)

const fetchAttendanceDistributionReport = (params) =>
  api
    .callApi({
      url: `/data-warehouse/attendance/distribution`,
      params,
    })
    .then((response) => response?.data?.result)

const createGoal = (data) =>
  api
    .callApi({
      url: `${dataWarehousePrefix}${goalsAndInterventionsPrefix}/goals`,
      method: 'post',
      data,
    })
    .then((response) => response?.data?.result)

const createIntervention = (data) =>
  api
    .callApi({
      url: `${dataWarehousePrefix}${goalsAndInterventionsPrefix}/interventions`,
      method: 'post',
      data,
    })
    .then((response) => response?.data?.result)

const updateGoal = (id, data) =>
  api
    .callApi({
      url: `${dataWarehousePrefix}${goalsAndInterventionsPrefix}/goals/${id}`,
      method: 'put',
      data,
    })
    .then((response) => response?.data?.result)

const updateIntervention = (id, data) =>
  api
    .callApi({
      url: `${dataWarehousePrefix}${goalsAndInterventionsPrefix}/interventions/${id}`,
      method: 'put',
      data,
    })
    .then((response) => response?.data?.result)

const deleteGoal = (id) =>
  api
    .callApi({
      url: `${dataWarehousePrefix}${goalsAndInterventionsPrefix}/goals/${id}`,
      method: 'delete',
    })
    .then((response) => response?.data?.result)

const deleteIntervention = (id) =>
  api
    .callApi({
      url: `${dataWarehousePrefix}${goalsAndInterventionsPrefix}/interventions/${id}`,
      method: 'delete',
    })
    .then((response) => response?.data?.result)

const getGoals = () =>
  api
    .callApi({
      url: `${dataWarehousePrefix}${goalsAndInterventionsPrefix}/goals`,
      method: 'get',
    })
    .then((response) => response?.data?.result)

const fetchAttendanceBands = () =>
  api
    .callApi({
      url: `${dataWarehousePrefix}${goalsAndInterventionsPrefix}/attendance-band`,
      method: 'get',
    })
    .then((result) => result.data.result)

const getInterventions = (params) =>
  api
    .callApi({
      url: `${dataWarehousePrefix}${goalsAndInterventionsPrefix}/interventions`,
      method: 'get',
      params,
      paramsSerializer: (param) => qs.stringify(param),
    })
    .then((response) => response?.data?.result)

const getInterventionsByGroups = (params) => {
  return api
    .callApi({
      url: `${dataWarehousePrefix}${goalsAndInterventionsPrefix}/report-interventions`,
      method: 'get',
      params: { jsonQuery: JSON.stringify(params) },
    })
    .then((response) => response?.data?.result?.responseData)
}

export default {
  fetchReports,
  fetchTestActivityDetail,
  fetchTestActivityReport,
  fetchSkillReport,
  fetchAssignments,
  fetchResponseFrequency,
  fetchAssessmentSummaryReport,
  fetchPeerPerformanceReport,
  fetchPerformanceByStandardSummary,
  fetchPerformanceByStandardDetails,
  fetchPerformanceByStudentsSummary,
  fetchPerformanceByStudentsDetails,
  fetchSARFilterData,
  fetchMARFilterData,
  fetchSPRFilterData,
  fetchStandardsProgressReport,
  fetchStandardsGradbookSkillInfo,
  fetchStandardsGradebookSummary,
  fetchStandardsGradebookDetails,
  fetchStandardsPerformanceSummaryReport,
  fetchStandardMasteryFilter,
  fetchStandardMasteryBrowseStandards,
  fetchQuestionAnalysisSummaryReport,
  fetchQuestionAnalysisPerformanceReport,
  fetchPeerProgressAnalysisReport,
  fetchStudentProgressReport,
  fetchPerformanceOverTimeReport,
  fetchStudentMasteryProfileReport,
  fetchStudentAssessmentProfileReport,
  fetchStudentProfileSummaryReport,
  fetchStudentProgressProfileReport,
  fetchStudentList,
  fetchStudentStandards,
  fetchStudentPerformance,
  fetchEngagementSummary,
  fetchActivityBySchool,
  fetchActivityByTeacher,
  generateCSV,
  fetchGeneratedCSVs,
  fetchPerformanceByRubricsCriteriaChartData,
  fetchPerformanceByRubricsCriteriaTableData,
  fetchPreVsPostReportSummaryData,
  fetchPreVsPostReportTableData,
  fetchAttendanceReportDetails,
  fetchAttendanceSummaryReport,
  fetchAttendanceDistributionReport,
  createGoal,
  createIntervention,
  getGoals,
  fetchAttendanceBands,
  getInterventions,
  getInterventionsByGroups,
  deleteGoal,
  deleteIntervention,
  updateGoal,
  updateIntervention,
}
