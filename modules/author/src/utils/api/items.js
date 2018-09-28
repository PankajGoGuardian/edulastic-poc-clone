import callApi from './callApi';

export const receiveItems = ({ page, limit, search = '' }) => callApi({ url: `/items?page=${page}&limit=${limit}&search=${search}` }).then(
  result => result.data,
);

export const receiveItemById = id => callApi({
  url: `/items/${id}`,
}).then(result => result.data);

export const createItem = ({ payload }) => callApi({
  method: 'post',
  url: '/items',
  data: {
    ...payload,
  },
}).then(result => result.data);

export const updateItemById = ({ payload }) => callApi({
  method: 'put',
  url: `/items/${payload.id}`,
  data: {
    ...payload,
  },
}).then(result => result.data);
