import API from './utils/API'

const api = new API()
const prefix = '/user-context'

const setLastUsedPlayList = ({ _id, title, grades, subjects }) =>
  api.callApi({
    method: 'post',
    url: `${prefix}`,
    data: {
      name: 'LAST_ACCESSED_PLAYLIST',
      value: {
        _id,
        title,
        grades,
        subjects,
      },
    },
  })

const setRecentUsedPlayLists = (playLists) =>
  api.callApi({
    method: 'post',
    url: `${prefix}`,
    data: {
      name: 'RECENT_PLAYLISTS',
      value: [playLists],
    },
  })

const getRecentPlayLists = () =>
  api
    .callApi({
      method: 'get',
      url: `${prefix}?name=RECENT_PLAYLISTS`,
    })
    .then((response) => response.data.result)

const getLastPlayList = () =>
  api
    .callApi({
      method: 'get',
      url: `${prefix}?name=LAST_ACCESSED_PLAYLIST`,
    })
    .then((response) => response.data.result)

const storeCustomKeypad = (keypad) =>
  api.callApi({
    method: 'post',
    url: `${prefix}`,
    data: {
      name: 'USER_CUSTOM_KEYPADS',
      value: [keypad],
    },
  })

const updateCustomKeypad = (keypad, documentId) =>
  api
    .callApi({
      method: 'put',
      url: `${prefix}/${documentId}`,
      data: {
        filter: {
          _id: keypad._id,
        },
        data: keypad,
      },
    })
    .then((response) => response.data.result)

const getCustomKeypad = () =>
  api
    .callApi({
      method: 'get',
      url: `${prefix}?name=USER_CUSTOM_KEYPADS`,
    })
    .then((response) => response.data.result)

const deleteCustomKeypad = (documentId, filter) =>
  api.callApi({
    method: 'delete',
    url: `${prefix}/${documentId}`,
    data: filter,
  })

const setViewedTutorials = (viewedTutorial) =>
  api.callApi({
    method: 'post',
    url: `${prefix}`,
    data: {
      name: 'VIEWED_TUTORIALS',
      value: [viewedTutorial],
    },
  })

export default {
  setLastUsedPlayList,
  setRecentUsedPlayLists,
  getRecentPlayLists,
  getLastPlayList,
  storeCustomKeypad,
  getCustomKeypad,
  updateCustomKeypad,
  deleteCustomKeypad,
  setViewedTutorials,
}
