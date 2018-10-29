import API from './utils/API';

const api = new API();
const prefix = '/Tests';

const getAll = ({ limit, page, search } = { limit: 10, page: 1 }) => {
  let url = `${prefix}?filter[limit]=${limit}&filter[skip]=${limit * (page - 1)}`;

  if (search) {
    url += `&filter[where][title][like]=${search}`;
  }

  return api
    .callApi({
      url,
      method: 'get',
    })
    .then(result => result.data);
};

const getCount = () =>
  api
    .callApi({
      url: `${prefix}/count`,
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
  getCount,
};
