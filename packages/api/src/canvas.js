import API from './utils/API'

const api = new API()
const prefix = '/canvas'

const getCanvasAuthURI = (institutionId, type) =>
  api
    .callApi({
      url: `${prefix}/sso-details?institutionId=${institutionId}&type=${type}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const fetchCourseList = (institutionId) =>
  api
    .callApi({
      url: `${prefix}/course-list?institutionId=${institutionId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const fetchCourseSectionList = ({ allCourseIds, institutionId }) =>
  api
    .callApi({
      url: `${prefix}/course-section-list?courseIds=${allCourseIds.toString()}&institutionId=${institutionId}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const bulkSync = (data) =>
  api
    .callApi({
      url: `${prefix}/sync-all-classes`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const canvasSync = (data) =>
  api
    .callApi({
      url: `${prefix}/start-canvas-sync`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const canvasGradesSync = (data) =>
  api
    .callApi({
      url: `${prefix}/sync-grades-manually`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const canvasAssignmentSync = (data) =>
  api
    .callApi({
      useSlowApi: true,
      url: `${prefix}/sync-assignment-manually`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

export default {
  getCanvasAuthURI,
  fetchCourseList,
  fetchCourseSectionList,
  bulkSync,
  canvasSync,
  canvasGradesSync,
  canvasAssignmentSync,
}
