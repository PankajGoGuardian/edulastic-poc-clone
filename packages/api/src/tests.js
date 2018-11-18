import API from './utils/API';

const api = new API('/api');
const prefix = '/test';

const formatData = data => {
  let item = JSON.parse(JSON.stringify(data));
  delete item._id;
  return item;
};

const getAll = ({ limit, page, search } = { limit: 10, page: 1 }) => {
  let url = `${prefix}?filter[limit]=${limit}&filter[skip]=${limit *
    (page - 1)}`;

  if (search) {
    url += `&filter[where][title][like]=${search}`;
  }

  return api
    .callApi({
      url,
      method: 'get'
    })
    .then(result => result.data.result);
};

const getCount = () =>
  api
    .callApi({
      url: `${prefix}/count`,
      method: 'get'
    })
    .then(result => result.data.result);

const getById = (id, params = {}) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'get',
      params
    })
    .then(result => result.data.result);

const create = data =>
  api
    .callApi({
      url: prefix,
      method: 'post',
      data
    })
    .then(result => result.data.result);

const update = ({ id, data: test }) => {
  let data = formatData(test);
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data
    })
    .then(result => result.data.result);
};
export default {
  getAll,
  getById,
  create,
  update,
  getCount
};
