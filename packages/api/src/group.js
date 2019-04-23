import API from "./utils/API";

const api = new API();
const prefix = "/group";

const fetchMyGroups = () =>
  api
    .callApi({
      url: `${prefix}/mygroups`,
      method: "get"
    })
    .then(result => result.data.result);

const getGroups = body =>
  api
    .callApi({
      url: `${prefix}/search`,
      method: "post",
      data: body
    })
    .then(result => result.data.result);

const editGroup = ({ groupId, body }) =>
  api
    .callApi({
      url: `${prefix}/${groupId}`,
      method: "put",
      data: body
    })
    .then(result => result.data.result);

const createGroup = body =>
  api
    .callApi({
      url: `${prefix}`,
      method: "post",
      data: body
    })
    .then(result => result.data.result);

const deleteGroup = ({ districtId, groupId }) =>
  api
    .callApi({
      url: `${prefix}/${groupId}?districtId=${districtId}`,
      method: "delete"
    })
    .then(result => result.data.result);

export default {
  fetchMyGroups,
  getGroups,
  editGroup,
  createGroup,
  deleteGroup
};
