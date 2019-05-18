import API from "./utils/API";

const api = new API();
const prefix = "/playlists";
const getPlaylists = id => {
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
  api.callApi({
    method: "post",
    url: `${prefix}`,
    data
  });

const update = ({ data, _id }) =>
  api.callApi({
    method: "put",
    urL: `${prefix}/${_id}`,
    data
  });

export default {
  getCurriculums: getPlaylists,
  updateCurriculumSequence,
  searchDistinctPublishers,
  searchCurriculumSequences,
  create,
  update
};
