import API from '@edulastic/api/src/utils/API'
import qs from 'qs'

const api = new API()
const prefix = '/test-activity/summary'

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

const fetchPerformanceByStandard = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/performance-by-standards`,
    params: { ...params.requestFilters, testId: params.testId },
  })

const fetchPerformanceByStudentsReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/performance-by-students`,
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

const fetchStandardsGradebookReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/standards-gradebook`,
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

const fetchQuestionAnalysisReport = (params) =>
  api.callApi({
    useSlowApi: true,
    url: `/report/question-analysis`,
    params: { ...params.requestFilters, testId: params.testId },
  })

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

export default {
  fetchReports,
  fetchTestActivityDetail,
  fetchTestActivityReport,
  fetchSkillReport,
  fetchAssignments,
  fetchResponseFrequency,
  fetchAssessmentSummaryReport,
  fetchPeerPerformanceReport,
  fetchPerformanceByStandard,
  fetchPerformanceByStudentsReport,
  fetchSARFilterData,
  fetchMARFilterData,
  fetchSPRFilterData,
  fetchStandardsProgressReport,
  fetchStandardsGradebookReport,
  fetchStandardsGradbookSkillInfo,
  fetchStandardsGradebookSummary,
  fetchStandardsGradebookDetails,
  fetchStandardsPerformanceSummaryReport,
  fetchStandardMasteryFilter,
  fetchStandardMasteryBrowseStandards,
  fetchQuestionAnalysisReport,
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
}
