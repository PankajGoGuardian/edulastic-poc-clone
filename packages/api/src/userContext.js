import API from "./utils/API";

const api = new API();
const prefix = "/user-context";

const setLastUsedPlayList = ({ _id, title }) =>
  api.callApi({
    method: "post",
    url: `${prefix}`,
    data: {
      name: "LAST_ACCESSED_PLAYLIST",
      value: {
        _id,
        title
      }
    }
  });

const setRecentUsedPlayLists = playLists =>
  api.callApi({
    method: "post",
    url: `${prefix}`,
    data: {
      name: "RECENT_PLAYLISTS",
      value: [playLists]
    }
  });

const getRecentPlayLists = () =>
  api
    .callApi({
      method: "get",
      url: `${prefix}?name=RECENT_PLAYLISTS`
    })
    .then(response => response.data.result);

const getLastPlayList = () =>
  api
    .callApi({
      method: "get",
      url: `${prefix}?name=LAST_ACCESSED_PLAYLIST`
    })
    .then(response => response.data.result);

export default {
  setLastUsedPlayList,
  setRecentUsedPlayLists,
  getRecentPlayLists,
  getLastPlayList
};
