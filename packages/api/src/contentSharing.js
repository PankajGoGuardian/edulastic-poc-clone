import API from "./utils/API";
const api = new API();
const prefix = "/content-sharing";

const shareContent = ({ data, contentId }) =>
  api
    .callApi({
      url: `${prefix}/${contentId}`,
      method: "post",
      data
    })
    .then(result => result.data.result);

const getSharedUsersList = ({ contentId, contentType }) =>
  api
    .callApi({
      url: `${prefix}/${contentId}/shared-entities?contentType=${contentType}`,
      method: "get"
    })
    .then(result => result.data.result);

const deleteSharedUser = ({ contentId, sharedId, sharedWith }) =>
  api
    .callApi({
      url: `${prefix}/${contentId}/unshare-entity`,
      method: "delete",
      data: {
        sharedId,
        sharedWith
      }
    })
    .then(result => result.data.result);

export default {
  shareContent,
  getSharedUsersList,
  deleteSharedUser
};
