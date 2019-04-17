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

const fetchResponseFrequency = params => {
  return api.callApi({ url: `/report/responseFrequency?testId=${params.testId}` });
};

const fetchAssessmentSummaryReport = params => {
  return api.callApi({
    url: `/report/assessmentSummary?testId=${params.testId}`
  });
  // ?testId=5c90d974a649cb81bc5d4ca2&districtId=5c9089b1a649cb81bc398b1f
};

const fetchPeerPerformanceReport = params => {
  return api.callApi({
    url: `/report/peerPerformance?testId=${params.testId}`
  });
};

const fetchPerformanceByStandard = params => {
  return api.callApi({
    url: `/report/performanceByStandards?testId=${params.testId}`
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
  fetchPerformanceByStandard
};
