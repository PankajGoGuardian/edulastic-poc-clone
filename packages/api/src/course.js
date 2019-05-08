import API from "./utils/API";

const api = new API();
const prefix = "/course";

/*
 * api for fetching logged in users details
 */
const fetchCourse = ({ districtId }) =>
  api
    .callApi({
      url: `${prefix}/district/${districtId}`,
      method: "get"
    })
    .then(result => result.data.result);

const searchCourse = data =>
  api
    .callApi({
      url: `search/courses`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const saveCourse = data =>
  api
    .callApi({
      url: `${prefix}/`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const editCourse = ({ courseId, data }) =>
  api
    .callApi({
      url: `${prefix}/${courseId}`,
      method: "put",
      data
    })
    .then(result => result.data.result);

const deactivateCourse = data =>
  api
    .callApi({
      url: `${prefix}/deactivate`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const uploadcCSV = file => {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .callApi({
      url: `${prefix}/uploadcsv`,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(result => result.data.result);
};

export default {
  fetchCourse,
  searchCourse,
  saveCourse,
  editCourse,
  deactivateCourse,
  uploadcCSV
};
