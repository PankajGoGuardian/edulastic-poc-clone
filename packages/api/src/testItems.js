import API from './utils/API';

const api = new API();
const prefix = '/testitem';

const getAll = (params = {}) =>
  api
    .callApi({
      url: prefix,
      method: 'get',
      params,
    })
    .then(result => result.data.result);

const getById = (id, params = {}) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'get',
      params,
    })
    .then(result => result.data.result);

const updateById = (id, data) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data,
    })
    .then(result => result.data.result);

const create = data =>
  api
    .callApi({
      url: prefix,
      method: 'post',
      data,
    })
    .then(result => result.data.result);

const update = ({ id, data }) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data,
    })
    .then(result => result.data.result);

const evaluate = (id, answers) =>
  api
    .callApi({
      url: `${prefix}/${id}/evaluate`,
      method: 'post',
      data: answers,
    })
    .then(result => result.data.result);

export default {
  getAll,
  getById,
  updateById,
  create,
  update,
  evaluate,
};
