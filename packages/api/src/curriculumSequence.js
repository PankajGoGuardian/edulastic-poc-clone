import API from "./utils/API";

const api = new API();

const getPlaylists = id => {
  return api
    .callApi({
      method: "get",
      url: `/playlists/${id}`
    })
    .then(result => result.data.result);
};

const searchDistinctPublishers = () => {
  return api
    .callApi({
      method: "get",
      url: `/playlists/search/distinct-collection`
    })
    .then(result => result.data.result);
};

const updateCurriculumSequence = (id, curriculumSequence) => {
  const _curriculumSequence = { ...curriculumSequence };

  delete _curriculumSequence._id;
  delete _curriculumSequence.__v;

  const options = {
    method: "put",
    url: `/playlists/${id}`,
    data: _curriculumSequence
  };

  return api.callApi(options).then(res => res.data.result);
};

const searchCurriculumSequences = ({ search, limit, page }) => {
  const options = {
    method: "post",
    url: "/playlists/search/",
    data: {
      page,
      limit,
      search
    }
  };

  return api.callApi(options).then(res => res.data.result);
};

export default {
  getCurriculums: getPlaylists,
  updateCurriculumSequence,
  searchDistinctPublishers,
  searchCurriculumSequences
};
