import API from './api';

const namespace = 'user';

const fetchUser = () => API.get(`${namespace}/me`).then(res => res.data.result);

export default {
  fetchUser
}