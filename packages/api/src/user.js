import API from "./utils/API";

const api = new API();
const prefix = "/user";

/*
 * api for fetching logged in users details
 */
const getUser = () =>
  api
    .callApi({
      url: `${prefix}/me`,
      method: "get"
    })
    .then(result => result.data.result);

const fetchUsers = data =>
  api
    .callApi({
      url: `${prefix}/search`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const createUser = data =>
  api
    .callApi({
      url: `${prefix}/`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const updateUser = ({ data, userId }) =>
  api
    .callApi({
      url: `${prefix}/${userId}`,
      method: "put",
      data
    })
    .then(result => result.data.result);

const deleteUser = data =>
  api
    .callApi({
      url: `${prefix}/:${data.userId}?districtId:${data.districtId}`,
      method: "delete"
    })
    .then(result => result.data.result);

export default {
  getUser,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
};
