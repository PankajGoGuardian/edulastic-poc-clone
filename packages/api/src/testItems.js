import API from './utils/API';

const api = new API();
const prefix = '/testItem';

const formatData = data => {
  const item = JSON.parse(JSON.stringify(data));
  delete item._id;
  return item;
};

const getAll = ({ limit = 10, page = 1, search, data, validation }) => {
  let url = `${prefix}?filter[limit]=${limit}&filter[skip]=${limit *
    (page - 1)}`;

  if (search) {
    url += `&filter[where][title][like]=${search}`;
  }

  const params = { data, validation };
  return api
    .callApi({
      url,
      method: 'get',
      params
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

const updateById = (id, item) => {
  const data = formatData(item);
  return api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data
    })
    .then(result => result.data.result);
};

const create = data =>
  api
    .callApi({
      url: prefix,
      method: 'post',
      data
    })
    .then(result => result.data.result);

const update = ({ id, item }) => {
  const data = formatData(item);
  return api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'put',
      data
    })
    .then(result => result.data.result);
};
const evaluate = (id, answers) =>
  api
    .callApi({
      url: `${prefix}/${id}/evaluate`,
      method: 'post',
      data: answers
    })
    .then(result => result.data.result);

export default {
  getAll,
  getCount,
  getById,
  updateById,
  create,
  update,
  evaluate
};
