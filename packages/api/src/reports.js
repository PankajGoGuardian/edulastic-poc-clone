import API from '@edulastic/api/src/utils/API'
import qs from 'qs'

const api = new API()
const prefix = '/test-activity/summary'

const qSummary = [
  {
    questionId: '123',
    questionLabel: 'Q1',
    points: 1,
    standards: ['1.OA.C.6', '1.OA.C.2', '1.OA.C.3', '1.OA.C.1'],
    districtAvgPerf: 40,
    avgTimeSpent: 55,
    avgPerformance: 20,
  },
  {
    questionId: '234',
    questionLabel: 'Q2',
    points: 1,
    standards: ['1.OA.A.1'],
    districtAvgPerf: 30,
    avgTimeSpent: 123,
    avgPerformance: 10,
  },
  {
    questionId: '456',
    questionLabel: 'Q3',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 92,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '457',
    questionLabel: 'Q4',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 88,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '458',
    questionLabel: 'Q5',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 76,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '459',
    questionLabel: 'Q6',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 55,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '460',
    questionLabel: 'Q7',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 42,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '560',
    questionLabel: 'Q8',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 24,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '561',
    questionLabel: 'Q9',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 12,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '562',
    questionLabel: 'Q10',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 76,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '563',
    questionLabel: 'Q11',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 99,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '564',
    questionLabel: 'Q12',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 56,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '565',
    questionLabel: 'Q13',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 48,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '566',
    questionLabel: 'Q14',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 32,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '567',
    questionLabel: 'Q15',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 40,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '568',
    questionLabel: 'Q16',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 89,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '569',
    questionLabel: 'Q17',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 46,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '570',
    questionLabel: 'Q18',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 89,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '571',
    questionLabel: 'Q19',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 46,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '572',
    questionLabel: 'Q20',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 89,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '573',
    questionLabel: 'Q21',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 46,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '574',
    questionLabel: 'Q22',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 89,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
  {
    questionId: '575',
    questionLabel: 'Q23',
    points: 1,
    standards: ['1.MD.B.3'],
    districtAvgPerf: 46,
    avgTimeSpent: 145,
    avgPerformance: 30,
  },
]

const teachers = [
  'as',
  'an',
  'au',
  'bs',
  'bu',
  'bn',
  'cs',
  'cn',
  'cu',
  'ds',
  'du',
  'dn',
]
const groups = ['g1', 'g2', 'g3']
const schools = [
  's1',
  's2',
  's3',
  's4',
  's5',
  's6',
  's7',
  's8',
  's9',
  's10',
  's11',
  's12',
]
const scorePercent = [0, 100, 30, 20, 10, 30, 20, 10, 30, 20, 10, 30]
const allScorePercent = [100, 0, 60, 20, 10, 30, 20, 10, 30, 20, 10, 30]

const teacherDetails = () => {
  return teachers.flatMap((teacher, index) => {
    return qSummary.map((question) => {
      return {
        questionId: question.questionId,
        teacherId: index,
        teacherName: teacher,
        scorePercent: scorePercent[index],
        allTeachersScorePercent: allScorePercent[index],
        assignmentId: 123,
      }
    })
  })
}

const schoolDetails = () => {
  return schools.flatMap((item, index) => {
    return qSummary.map((question) => {
      return {
        questionId: question.questionId,
        schoolId: index,
        schoolName: item,
        scorePercent: scorePercent[index],
        allSchoolsScorePercent: allScorePercent[index],
        assignmentId: 123,
      }
    })
  })
}

const groupDetails = () => {
  return groups.flatMap((item, index) => {
    return qSummary.map((question) => {
      return {
        questionId: question.questionId,
        groupId: index,
        groupName: item,
        scorePercent: scorePercent[index],
        allGroupsScorePercent: allScorePercent[index],
        assignmentId: 123,
      }
    })
  })
}

const performanceByDimension = {
  teacherId: {
    totalPages: 4,
    details: teacherDetails(),
  },
  schoolId: {
    totalPages: 5,
    details: schoolDetails(),
  },
  groupId: {
    totalPages: 6,
    details: groupDetails(),
  },
}

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

const fetchQuestionAnalysisSummaryReport = (params) =>
  api
    .callApi({
      useSlowApi: true,
      url: `/report/question-analysis`,
      // url: `/report/question-analysis/summary`,
      params: { ...params.requestFilters, testId: params.testId },
    })
    .then(() => qSummary)

const fetchQuestionAnalysisPerformanceReport = (params) =>
  api
    .callApi({
      useSlowApi: true,
      url: `/report/question-analysis`,
      // url: `/report/question-analysis/performance-by-dimension`,
      params: { ...params.requestFilters, testId: params.testId },
    })
    .then(() => performanceByDimension[params.requestFilters.compareBy])

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
  fetchStandardsPerformanceSummaryReport,
  fetchStandardMasteryFilter,
  fetchStandardMasteryBrowseStandards,
  fetchQuestionAnalysisReport,
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
}
