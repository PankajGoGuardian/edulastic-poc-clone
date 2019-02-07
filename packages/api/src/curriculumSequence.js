import API from './utils/API';

const api = new API();

const getCurriculumSequences = (id) => {
  console.log('GETCURRICULUMSEQUENCES', id);
  return api
    .callApi({
      method: 'get',
      url: `/curriculum-sequence/${id}`
    })
    .then(result => result.data.result);
};

const updateCurriculumSequence = (id, curriculumSequence) => {
  const options = {
    method: 'put',
    url: `/curriculum-sequence/${id}`,
    data: curriculumSequence
  };

  return api
    .callApi(options)
    .then(result => result);
};

export default {
  getCurriculums: getCurriculumSequences,
  updateCurriculumSequence
};
