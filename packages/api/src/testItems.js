import API from './API';

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

export default {
  getAll,
  getById,
};
