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

const CHART_DATA = {
  "data": [
      {
          "criteriaId": "6b8be93e-7249-422d-9da5-6b70349f9e5d",
          "responsesByRating": {
              "fab93a9d-1552-4745-93ee-9b7a06aba8a8": 4
          }
      },
      {
          "criteriaId": "a12411ed-5d43-46dc-8b20-122e98b7dc00",
          "responsesByRating": {
              "f71b8136-6a46-487b-b81d-4c27b38e9514": 2,
              "32b1b971-bd8e-4079-b5e4-f9bdafc4d33e": 2
          }
      }
  ],
  "rubric": {
      "_id": "6363514390f26d00082f1ee2",
      "name": "Rubric With 2 criteria",
      "description": "",
      "criteria": [
          {
              "ratings": [
                  {
                      "name": "Rating 1",
                      "desc": "",
                      "id": "f71b8136-6a46-487b-b81d-4c27b38e9514",
                      "points": 0
                  },
                  {
                      "name": "Rating 2",
                      "desc": "",
                      "id": "32b1b971-bd8e-4079-b5e4-f9bdafc4d33e",
                      "points": 1
                  }
              ],
              "name": "Criteria 1",
              "id": "a12411ed-5d43-46dc-8b20-122e98b7dc00"
          },
          {
              "ratings": [
                  {
                      "name": "Rating 1",
                      "desc": "",
                      "id": "e41fe22d-99b8-4c7f-a748-9b62ccf715e9",
                      "points": 0
                  },
                  {
                      "name": "Rating 2",
                      "desc": "",
                      "id": "24a00593-7a44-4a29-9915-2bccc4e822bc",
                      "points": 1
                  },
                  {
                      "name": "Rating 3",
                      "desc": "",
                      "id": "fab93a9d-1552-4745-93ee-9b7a06aba8a8",
                      "points": 2
                  }
              ],
              "name": "Criteria 2",
              "id": "6b8be93e-7249-422d-9da5-6b70349f9e5d"
          }
      ]
  }
}
const fetchPerformanceByRubricsCriteriaChartData = (params) =>
  Promise.resolve(JSON.parse(JSON.stringify(CHART_DATA))) ||
  api
    .callApi({
      url: '/report/performance-by-rubric/chart',
      params,
    })
    .then((res) => res.data.result)

const TABLE_DATA = {
  data: [
    {
      criteriaId: 'a12411ed-5d43-46dc-8b20-122e98b7dc00',
      scoreGrouped: {
        '63634f40e661ad000869f19d': 0.5,
      },
    },
    {
      criteriaId: '6b8be93e-7249-422d-9da5-6b70349f9e5d',
      scoreGrouped: {
        '63634f40e661ad000869f19d': 2,
      },
    },
  ],
  compareByNames: [
    {
      _id: '63634f40e661ad000869f19d',
      name: 'class1',
    },
  ],
}

const fetchPerformanceByRubricsCriteriaTableData = (params) =>
  new Promise((resolve) => resolve(TABLE_DATA)) ||
  api
    .callApi({
      url: '/report/performance-by-rubric/table',
      params,
    })
    .then((res) => res.data.result)

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
}
