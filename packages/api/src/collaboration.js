import API from './utils/API'

const api = new API()
const prefix = '/collaboration-group'

const fetchGroups = () =>
  api
    .callApi({
      url: `${prefix}/`,
      method: 'get',
    })
    .then((result) => result.data)

const createGroup = (data) =>
  api
    .callApi({
      url: `${prefix}`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const archiveGroup = (groupId) =>
  api
    .callApi({
      url: `${prefix}/${groupId}`,
      method: 'delete',
    })
    .then((result) => result.data)

const updateGroupName = ({ groupId, data }) =>
  api
    .callApi({
      url: `${prefix}/${groupId}`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const fetchGroupById = (id) =>
  api
    .callApi({
      url: `${prefix}/${id}`,
      method: 'get',
    })
    .then((result) => result.data.result)

const addMembers = ({ groupId, data }) =>
  api
    .callApi({
      url: `${prefix}/${groupId}/members`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const removeMembers = ({ groupId, data }) =>
  api
    .callApi({
      url: `${prefix}/${groupId}/members`,
      method: 'delete',
      data,
    })
    .then((result) => result.data.result)

const updateMembersRole = ({ groupId, data }) =>
  api
    .callApi({
      url: `${prefix}/${groupId}/members/role`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

const fetchUsersToAdd = (data) =>
  api
    .callApi({
      url: `${prefix}/users`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)

const updateUserMemberships = (data) =>
  api
    .callApi({
      url: `${prefix}/user/memberships`,
      method: 'put',
      data,
    })
    .then((result) => result.data.result)

export default {
  fetchGroups,
  createGroup,
  archiveGroup,
  updateGroupName,
  fetchGroupById,
  addMembers,
  removeMembers,
  updateMembersRole,
  fetchUsersToAdd,
  updateUserMemberships,
}
