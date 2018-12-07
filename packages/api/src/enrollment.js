import API from './utils/API';

const api = new API();
const prefix = 'enrollment';

const fetch = classId =>
  api
    .callApi({
      url: `${prefix}/class/${classId}`,
      method: 'get'
    })
    .then(result => result.data.result);

const create = data =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'post',
      data
    })
    .then(result => result.data.result);
export default {
  fetch,
  create
};
