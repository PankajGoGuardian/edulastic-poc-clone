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

const fetchMyArchiveGroups = () =>
  api
    .callApi({
      url: `${prefix}/mygroups?active=0`,
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
    .then(({ data: { result } }) => result.data.hits);

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

const deleteGroup = data =>
  api
    .callApi({
      url: `${prefix}`,
      method: "delete",
      data
    })
    .then(result => result.data.result);

const addCoTeacher = data =>
  api
    .callApi({
      url: `${prefix}/co-teacher`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const bulkUpdateClasses = data =>
  api
    .callApi({
      url: `${prefix}`,
      method: "put",
      data
    })
    .then(({ data: response }) => response);

const archiveGroup = ({ _id, districtId }) => {
  return api.callApi({
    url: `${prefix}/${_id}?districtId=${districtId}`,
    method: "delete"
  });
};

const fetchStudentsByGroupId = data =>
  api
    .callApi({
      url: `/search/student`,
      method: "post",
      data
    })
    .then(({ data }) => data);

const dropPlaylist = data =>
  api
    .callApi({
      url: `/user-playlist-activity/`,
      method: "post",
      data
    })
    .then(({ data }) => data);

const fetchPlaylistAccess = playlistId =>
  api
    .callApi({
      url: `/user-playlist-activity/${playlistId}`,
      method: "get"
    })
    .then(result => result.data.result);

const saveHangoutEvent = data =>
  api
    .callApi({
      url: `${prefix}/hangout`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const updateHangoutEvent = data =>
  api
    .callApi({
      url: `${prefix}/hangout`,
      method: "put",
      data
    })
    .then(result => result.data.result);

export default {
  fetchMyGroups,
  fetchMyArchiveGroups,
  getGroups,
  editGroup,
  createGroup,
  deleteGroup,
  addCoTeacher,
  bulkUpdateClasses,
  archiveGroup,
  fetchStudentsByGroupId,
  dropPlaylist,
  fetchPlaylistAccess,
  saveHangoutEvent,
  updateHangoutEvent
};
