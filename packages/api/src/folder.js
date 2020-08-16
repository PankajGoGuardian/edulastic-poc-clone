import API from "./utils/API";

const api = new API();
const prefix = "/user-folder";

const fetchFolders = type =>
  api
    .callApi({
      url: `${prefix}?folderType=${type}`,
      method: "get"
    })
    .then(result => result.data.result);

const createFolder = data =>
  api
    .callApi({
      url: `${prefix}`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const deleteFolder = folderId =>
  api.callApi({
    url: `${prefix}/${folderId}`,
    method: "delete"
  });

const addMoveContent = ({ folderId, data }) =>
  api.callApi({
    url: `${prefix}/${folderId}/content`,
    method: "put",
    data
  });

const renameFolder = ({ folderId, data }) =>
  api.callApi({
    url: `${prefix}/${folderId}`,
    method: "put",
    data
  });

export default {
  fetchFolders,
  createFolder,
  deleteFolder,
  renameFolder,
  addMoveContent
};
