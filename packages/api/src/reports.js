import API from "@edulastic/api/src/utils/API";

const api = new API();
const prefix = "/test-activity/summary";

const fetchReports = groupId => {
  let config = {
    url: `${prefix}`,
    method: "get"
  };

  if (groupId) {
    config["params"] = {
      groupId
    };
  }

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

const fetchAssignments = () => {
  return api.callApi({ url: `/assignments` });
};

const getRequestParams = obj => {
  let str = "";
  let arr = Object.keys(obj);
  arr.map((item, index) => {
    str = str + item + "=" + obj[item] + "&";
  });

  return str;
};

const fetchResponseFrequency = params => {
  return api.callApi({
    url: `/report/responseFrequency`,
    params: { ...params.requestFilters, testId: params.testId }
  });
};

const fetchAssessmentSummaryReport = params => {
  return api.callApi({
    url: `/report/assessmentSummary`,
    params: { ...params.requestFilters, testId: params.testId }
  });
};

const fetchPeerPerformanceReport = params => {
  return api.callApi({
    url: `/report/peerPerformance`,
    params: { ...params.requestFilters, testId: params.testId }
  });
};

const fetchPerformanceByStandard = params => {
  return api.callApi({
    url: `/report/performanceByStandards`,
    params: { ...params.requestFilters, testId: params.testId }
  });
};

const fetchPerformanceByStudentsReport = params => {
  return api.callApi({
    url: `/report/performance-by-students`,
    params: { ...params.requestFilters, testId: params.testId }
  });
};

const fetchSARFilterData = params => {
  return api.callApi({
    url: `/report/filter/single-assessment`,
    params
  });
};

const fetchStandardsGradebookReport = params => {
  return api.callApi({
    url: `/report/standards-gradeBook`,
    params: params
  });
};

const fetchStandardsPerformanceSummaryReport = params => {
  return api.callApi({
    url: `/report/standards-summary`,
    params: params
  });
};

const fetchStandardMasteryFilter = params => {
  return api.callApi({
    url: `/report/filter/standard-mastery`,
    params: params
  });
};

const fetchStandardMasteryBrowseStandards = params => {
  return api.callApi({
    url: `/search/browseStandards`,
    data: params,
    method: "POST"
  });
};

const fetchQuestionAnalysisReport = params => {
  return api.callApi({
    url: `/report/question-analysis`,
    params: { ...params.requestFilters, testId: params.testId }
  });
};

const fetchMARFilterData = params => {
  return api.callApi({
    url: `/report/filter/single-assessment`,
    params
  });
};

const fetchPeerProgressAnalysisReport = params => {
  return api.callApi({
    url: `/report/peer-progress-analysis`,
    params
  });
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
  fetchStandardsGradebookReport,
  fetchStandardsPerformanceSummaryReport,
  fetchStandardMasteryFilter,
  fetchStandardMasteryBrowseStandards,
  fetchQuestionAnalysisReport,
  fetchPeerProgressAnalysisReport
};
