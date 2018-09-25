import callApi from './callApi';

export const receiveItems = () => callApi({ url: '/items' }).then(result => result.data);

export const receiveItemById = id => callApi({
  url: `/items/${id}`,
}).then(result => result.data);
