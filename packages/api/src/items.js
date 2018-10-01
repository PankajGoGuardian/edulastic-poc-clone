import API from './API';

const api = new API();

const receiveItems = () => api.callApi({ url: '/items' }).then(result => result.data);

const receiveItemById = id =>
  api
    .callApi({
      url: `/items/${id}`,
    })
    .then(result => result.data);

export default {
  receiveItems,
  receiveItemById,
};
