import API from './utils/API';

const api = new API();

const receiveCurriculums = () =>
  api.callApi({ url: '/curriculum' }).then(result => result.data.result);

const receiveStandards = ({ curriculumId, grades, searchStr }) => {
  const data = {
    andSearch: [
      { curriculumId }
    ],
    andSearchSubstr: [],
    orSearch: grades.map(el => ({ grades: el })),
    orSearchSubstr: [
      { standardIdentifier: searchStr },
      { standardDescription: searchStr }
    ]
  };
  return api
    .callApi({
      method: 'post',
      url: '/search/fields',
      data
    })
    .then(result => result.data.result.hits.hits.map(el => el._source));
};

export default {
  receiveCurriculums,
  receiveStandards
};
