import API from './utils/API';

const api = new API('http://localhost:3100/api');

const receiveItems = () =>
  api.callApi({ url: '/items' }).then(result => result.data);

const receiveItemById = id =>
  api
    .callApi({
      url: `/items/${id}`
    })
    .then(result => result.data);

const createItem = ({ payload }) =>
  api
    .callApi({
      method: 'post',
      url: '/items',
      data: {
        ...payload
      }
    })
    .then(result => result.data);

const updateItemById = ({ payload }) =>
  api
    .callApi({
      method: 'put',
      url: `/items/${payload.id}`,
      data: {
        ...payload
      }
    })
    .then(result => result.data);

const saveUserReponse = (itemId, answer) =>
  api
    .callApi({
      method: 'post',
      url: `/UserTestItemActivities/saveResponse`,
      data: {
        testItemId: itemId,
        answers: answer
      }
    })
    .then(result => result.data);

const getUserResponse = itemId =>
  api
    .callApi({
      method: 'get',
      url: `UserTestItemActivities`,
      params: { item: itemId }
    })
    .then(result => result.data);

export default {
  receiveItems,
  receiveItemById,
  createItem,
  updateItemById,
  saveUserReponse,
  getUserResponse
};
