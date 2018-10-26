import API from './utils/API';

const api = new API();
const prefix = '/Tests';

const getAll = (params = {}) =>
  api
    .callApi({
      url: prefix,
      method: 'get',
      params,
    })
    .then(result => result.data);

const getById = (id, params = {}) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'get',
      params,
    })
    .then(result => result.data);

const create = data =>
  api
    .callApi({
      url: prefix,
      method: 'post',
      data,
    })
    .then(result => result.data);

const update = ({ id, data }) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data,
    })
    .then(result => result.data);

export default {
  getAll,
  getById,
  create,
  update,
};
