import API from "./utils/API";

const api = new API();
const prefix = "/dashboard";

/*
 * api for fetching dashboard details
 */
const getTeacherDashboardDetails = () => {
  return api
    .callApi({
      url: `${prefix}/teacher`,
      method: "get"
    })
    .then(result => result.data.result);
};

export default {
  getTeacherDashboardDetails
};
