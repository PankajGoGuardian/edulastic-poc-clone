import API from './utils/API';

const api = new API();
const prefix = '/test';

const formatData = data => {
  const item = JSON.parse(JSON.stringify(data));
  delete item._id;
  return item;
};

// experimental api cache
let apiCache = {};

const getAll = (
  { limit, page, search } = { limit: 10, page: 1, search: '' }
) => {
  let url = `${prefix}?limit=${limit}&skip=${limit * (page - 1)}`;

  if (search) {
    url += `&filter[where][title][like]=${search}`;
  }

  // if url is cached, return cached result
  if (apiCache[url]) {
    return apiCache[url];
  }

  return api
    .callApi({
      url,
      method: 'get'
    })
    .then(result => {
      result = result.data.result;
      apiCache[url] = result;
      return result;
    });
};

const getCount = () => {
  let url = `${prefix}/count`;
  if (apiCache[url]) {
    return apiCache[url];
  }

  return api
    .callApi({
      url,
      method: 'get'
    })
    .then(result => {
      result = result.data.result;
      apiCache[url] = result;
      return result;
    });
};

const getById = (id, params = {}) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'get',
      params
    })
    .then(result => result.data.result);

const create = data => {
  apiCache = {};
  return api
    .callApi({
      url: prefix,
      method: 'post',
      data
    })
    .then(result => result.data.result);
};

const update = ({ id, data: test }) => {
  const data = formatData(test);
  apiCache = {};
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
