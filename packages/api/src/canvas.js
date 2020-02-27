import qs from "qs";
import API from "./utils/API";

const api = new API();
const prefix = "/canvas";

const getCanvasAuthURI = () =>
  api
    .callApi({
      url: `${prefix}/sso-details`,
      method: "get"
    })
    .then(result => result.data.result);

const fetchCourseList = () =>
  api
    .callApi({
      url: `${prefix}/course-list`,
      method: "get"
    })
    .then(result => result.data.result);

const fetchCourseSectionList = courseIds =>
  api
    .callApi({
      url: `${prefix}/course-section-list?${qs.stringify({ courseIds })}`,
      method: "get"
    })
    .then(result => result.data.result);

const bulkSync = data =>
  api
    .callApi({
      url: `${prefix}/sync-all-classes`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const canvasSync = data =>
  api
    .callApi({
      url: `${prefix}/start-canvas-sync`,
      method: "post",
      data
    })
    .then(result => result.data.result);

export default {
  getCanvasAuthURI,
  fetchCourseList,
  fetchCourseSectionList,
  bulkSync,
  canvasSync
};
