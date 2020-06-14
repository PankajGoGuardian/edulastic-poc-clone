import API from "@edulastic/api/src/utils/API";
import qs from "qs";

const api = new API();
const prefix = "/test-activity/summary";

const fetchReports = (groupId = "", testId = "") => {
  const config = {
    url: `${prefix}`,
    method: "get",
    params: {
      groupId,
      testId
    }
  };

  return api.callApi(config).then(result => result.data.result);
};

const fetchTestActivityDetail = id =>
  api
    .callApi({
      url: `/test-activity/${id}`,
      method: "get"
    })
    .then(result => result);

const fetchTestActivityReport = (id, groupId) =>
  api
    .callApi({
      url: `/test-activity/${id}/report`,
      method: "get",
      params: {
        groupId
      }
    })
    .then(result => result.data.result);

const fetchSkillReport = classId =>
  api
    .callApi({
      url: `/skill-report/${classId}`,
      method: "get"
    })
    .then(result => result.data.result);

const fetchAssignments = () => api.callApi({ url: `/assignments` });

const fetchResponseFrequency = params => api.callApi({
    url: `/report/response-frequency`,
    params: { ...params.requestFilters, testId: params.testId }
  });

const fetchAssessmentSummaryReport = params => api.callApi({
    url: `/report/assessment-summary`,
    params: { ...params.requestFilters, testId: params.testId }
  });

const fetchPeerPerformanceReport = params => api.callApi({
    url: `/report/peer-performance`,
    params: { ...params.requestFilters, testId: params.testId }
  });

const fetchPerformanceByStandard = params => api.callApi({
    url: `/report/performance-by-standards`,
    params: { ...params.requestFilters, testId: params.testId }
  });

const fetchPerformanceByStudentsReport = params => api.callApi({
    url: `/report/performance-by-students`,
    params: { ...params.requestFilters, testId: params.testId }
  });

const fetchSARFilterData = params => api.callApi({
    url: `/report/filter/single-assessment`,
    params
  });

const fetchStandardsGradebookReport = params => api.callApi({
    url: `/report/standards-gradebook`,
    params
  });

const fetchStandardsPerformanceSummaryReport = params => api.callApi({
    url: `/report/standards-summary`,
    params
  });

const fetchStandardMasteryFilter = params => api.callApi({
    url: `/report/filter/standard-mastery`,
    params
  }).then(result => result.data.result);

const fetchStandardMasteryBrowseStandards = params => api.callApi({
    url: `/search/browse-standards`,
    data: params,
    method: "POST"
  });

const fetchQuestionAnalysisReport = params => api.callApi({
    url: `/report/question-analysis`,
    params: { ...params.requestFilters, testId: params.testId }
  });

const fetchMARFilterData = params => api.callApi({
    url: `/report/filter/multiple-assessment`,
    params
  });

const fetchPeerProgressAnalysisReport = params => api.callApi({
    url: `/report/peer-progress-analysis`,
    params
  });

const fetchStudentProgressReport = params => api.callApi({
    url: `/report/student-progress`,
    params
  });

const fetchPerformanceOverTimeReport = params => api.callApi({
    url: `/report/performance-over-time`,
    params
  });

const fetchSPRFilterData = params => api.callApi({
    url: `/report/filter/student-profile`,
    params
  });

const fetchStudentMasteryProfileReport = params => api.callApi({
    url: `/report/student-mastery-profile`,
    params
  });

const fetchStudentAssessmentProfileReport = params => api.callApi({
    url: `/report/student-assessment-performance`,
    params
  });

const fetchStudentProfileSummaryReport = params => api.callApi({
    url: `/report/student-profile-summary`,
    params
  });

const fetchStudentList = params => api.callApi({
    url: `/report/students`,
    method: "POST",
    data: params
  });

const fetchStudentStandards = params => api.callApi({
    url: `/report/student-standard`,
    params
  });

const fetchStudentPerformance = params => {
  const queryString = qs.stringify(params);
  return api
    .callApi({
      method: "get",
      url: `/report/student-performance?${queryString}`
    })
    .then(({ data }) => data.result);
};

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
  fetchStudentList,
  fetchStudentStandards,
  fetchStudentPerformance
};
