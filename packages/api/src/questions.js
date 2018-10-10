import API from './utils/API';

const api = new API();
const prefix = '/Questions';

const create = data =>
  api
    .callApi({
      url: prefix,
      method: 'post',
      data,
    })
    .then(result => result.data);

const getAll = () =>
  api
    .callApi({
      url: prefix,
      method: 'get',
    })
    .then(result => result.data);

export default {
  create,
  getAll,
};
