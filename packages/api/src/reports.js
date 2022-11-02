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
  metrics: [
    {
      rubricId: 1,
      criteriaId: 1,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      responsesByRating: {
        1: 20,
        2: 12,
        3: 30,
      },
      totalResponses: 80,
    },
    {
      rubricId: 1,
      criteriaId: 2,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      responsesByRating: {
        4: 10,
        5: 9,
        6: 7,
      },
      totalResponses: 30,
    },
    {
      rubricId: 2,
      criteriaId: 3,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      responsesByRating: {
        7: 13,
        8: 12,
        9: 8,
      },
      totalResponses: 80,
    },
    {
      rubricId: 2,
      criteriaId: 4,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      responsesByRating: {
        10: 16,
        11: 8,
        12: 7,
        13: 5,
      },
      totalResponses: 40,
    },
    {
      rubricId: 2,
      criteriaId: 5,
      criteriaScore: 2,
      criteriaMaxScore: 2,
      responsesByRating: {
        14: 6,
        15: 18,
        16: 7,
        17: 15,
      },
      totalResponses: 40,
    },
  ],
  rubrics: [
    {
      id: 1,
      name: 'rubric 1',
      criteria: [
        {
          id: 1,
          name: 'organizational skill',
          ratings: [
            {
              id: 1,
              name: 'rating 1',
              fill: '#E55C5C',
            },
            {
              id: 2,
              name: 'rating 2',
              fill: '#FFFF00',
            },
            {
              id: 3,
              name: 'rating 3',
              fill: '#00FF00',
            },
          ],
        },
        {
          id: 2,
          name: 'speaking skill',
          ratings: [
            {
              id: 4,
              name: 'rating 4',
              fill: '#E55C5C',
            },
            {
              id: 5,
              name: 'rating 5',
              fill: '#FFFF00',
            },
            {
              id: 6,
              name: 'rating 6',
              fill: '#00FF00',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'rubric 2',
      criteria: [
        {
          id: 3,
          name: 'organizational skill',
          ratings: [
            {
              id: 7,
              name: 'rating 7',
              fill: '#E55C5C',
            },
            {
              id: 8,
              name: 'rating 8',
              fill: '#FFFF00',
            },
            {
              id: 9,
              name: 'rating 9',
              fill: '#00FF00',
            },
          ],
        },
        {
          id: 4,
          name: 'speaking skill',
          ratings: [
            {
              id: 10,
              name: 'rating 10',
              fill: '#E55C5C',
            },
            {
              id: 11,
              name: 'rating 11',
              fill: '#FFFF00',
            },
            {
              id: 12,
              name: 'rating 12',
              fill: '#00FF00',
            },
            {
              id: 13,
              name: 'rating 13',
              fill: '#E55C5C',
            },
          ],
        },
        {
          id: 5,
          name: 'speaking skill',
          ratings: [
            {
              id: 14,
              name: 'rating 14',
              fill: '#E55C5C',
            },
            {
              id: 15,
              name: 'rating 15',
              fill: '#FFFF00',
            },
            {
              id: 16,
              name: 'rating 16',
              fill: '#00FF00',
            },
            {
              id: 17,
              name: 'rating 17',
              fill: '#E55C5C',
            },
          ],
        },
      ],
    },
  ],
}
const fetchPerformanceByRubricsCriteriaChartData = () =>
  new Promise((resolve) => resolve(CHART_DATA))

const TABLE_DATA = {}

const fetchPerformanceByRubricsCriteriaTableData = () =>
  new Promise((resolve) => resolve(TABLE_DATA))

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
