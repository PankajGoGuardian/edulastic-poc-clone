import API from './utils/API'

const api = new API()
const prefix = '/google'

const getCourseList = (code) =>
  api
    .callApi({
      url: `${prefix}/getCourseList`,
      method: 'post',
      data: { code },
    })
    .then((result) => result.data.result)

const syncClass = (data) =>
  api
    .callApi({
      url: `${prefix}/sync-class`,
      data,
      method: 'post',
    })
    .then((result) => result.data.result)

const postGoogleClassRoomAnnouncement = (data) =>
  api
    .callApi({
      url: `${prefix}/announcement`,
      method: 'post',
      data,
    })
    .then((result) => result.data.result)
const removeClassSyncNotification = () => {
  api
    .callApi({
      url: `${prefix}/remove-sync-notification`,
      method: 'delete',
    })
    .then((result) => result.data.result)
}
const saveGoogleTokens = (data) =>
  api
    .callApi({
      url: `${prefix}/tokens`,
      method: 'post',
      data,
    })
    .then((result) => result?.data?.result)

const syncGradesWithGoogleClassroom = (data) =>
  api
    .callApi({
      url: `${prefix}/sync-grades`,
      method: 'POST',
      data,
    })
    .then((result) => result.data)

export default {
  getCourseList,
  syncClass,
  postGoogleClassRoomAnnouncement,
  removeClassSyncNotification,
  saveGoogleTokens,
  syncGradesWithGoogleClassroom,
}
