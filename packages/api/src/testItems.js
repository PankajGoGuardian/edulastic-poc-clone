import API from './utils/API';

const api = new API();
const prefix = '/TestItems';

const getAll = () =>
  api
    .callApi({
      url: prefix,
      method: 'get',
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

const updateById = (id, data) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data,
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
  updateById,
  create,
  update,
};
