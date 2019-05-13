import API from "@edulastic/api/src/utils/API";

const api = new API();
const prefix = "/test-activity/summary";

const fetchReports = groupId =>
  api
    .callApi({
      url: `${prefix}`,
      method: "get",
      params: {
        groupId
      }
    })
    .then(result => result.data.result);

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
  fetchSARFilterData,
  fetchStandardsGradebookReport,
  fetchStandardMasteryFilter,
  fetchStandardMasteryBrowseStandards
};
