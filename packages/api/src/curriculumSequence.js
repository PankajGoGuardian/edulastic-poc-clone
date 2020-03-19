import API from "./utils/API";
import moment from "moment";
import qs from "qs";

const api = new API();
const prefix = "/playlists";
const getPlaylist = id => {
  return api
    .callApi({
      method: "get",
      url: `${prefix}/${id}`
    })
    .then(result => result.data.result);
};

const searchDistinctPublishers = () => {
  return api
    .callApi({
      method: "get",
      url: `${prefix}/search/collection`
    })
    .then(result => result.data.result);
};

const updateCurriculumSequence = (id, curriculumSequence) => {
  const _curriculumSequence = { ...curriculumSequence };

  delete _curriculumSequence._id;
  delete _curriculumSequence.__v;

  const options = {
    method: "put",
    url: `${prefix}/${id}`,
    data: _curriculumSequence
  };

  return api.callApi(options).then(res => res.data.result);
};

const searchCurriculumSequences = ({ search, limit, page }) => {
  const options = {
    method: "post",
    url: `${prefix}/search/`,
    data: {
      page,
      limit,
      search
    }
  };

  return api.callApi(options).then(res => res.data.result);
};

const create = ({ data }) =>
  api
    .callApi({
      method: "post",
      url: `${prefix}`,
      data
    })
    .then(res => res.data.result);

const update = ({ data, id }) =>
  api
    .callApi({
      method: "put",
      url: `${prefix}/${id}`,
      data
    })
    .then(res => res.data.result);

const publishPlaylist = id =>
  api
    .callApi({
      method: "put",
      url: `${prefix}/${id}/publish`
    })
    .then(res => res);

const updatePlaylistStatus = data =>
  api
    .callApi({
      method: "put",
      url: `${prefix}/${data.playlistId}/publish?status=${data.status}`,
      data: { collections: data.collections }
    })
    .then(result => result.data.result);

const duplicatePlayList = ({ _id, title, forUseThis = false }) =>
  api
    .callApi({
      method: "post",
      url: `${prefix}/${_id}/duplicate?title=${title}-${moment().format("MM/DD/YYYY HH:mm")}${
        forUseThis ? `&forUseThis=1` : ""
      }`
    })
    .then(res => res.data.result);

const fetchPlaylistMetrics = data => {
  const queryString = qs.stringify(data);
  return api
    .callApi({
      method: "get",
      url: `/report/playlist-metrics?${queryString}`
    })
    .then(result => result.data.result);
};

const fetchPlaylistInsights = data => {
  const queryString = qs.stringify(data);
  return api
    .callApi({
      method: "get",
      url: `/report/insights?${queryString}`
    })
    .then(result => result.data.result);
};

const getSignedRequest = ({ playlistId, moduleId, contentId }) => {
  return api
    .callApi({
      method: "post",
      url: `${prefix}/${playlistId}/generate-lti-request`,
      data: {
        moduleId,
        contentId
      }
    })
    .then(result => result.data.result);
};

export default {
  getCurriculums: getPlaylist,
  updateCurriculumSequence,
  searchDistinctPublishers,
  searchCurriculumSequences,
  create,
  publishPlaylist,
  updatePlaylistStatus,
  update,
  duplicatePlayList,
  fetchPlaylistMetrics,
  fetchPlaylistInsights,
  getSignedRequest
};
