import callApi from './callApi';

export const receiveItems = ({ page, limit, search = '' }) => callApi({ url: `/items?page=${page}&limit=${limit}&search=${search}` }).then(
  result => result.data,
);

export const receiveItemById = id => callApi({
  url: `/items/${id}`,
}).then(result => result.data);
