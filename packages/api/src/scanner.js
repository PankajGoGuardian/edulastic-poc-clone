import API from './utils/API'

const api = new API()
const prefix = '/scanner'

const createOmrUploadSession = (payload) =>
  api
    .callApi({
      url: `${prefix}/omr-upload`,
      data: payload,
      method: 'post',
    })
    .then((result) => result.data.result)

const updateOmrUploadSession = (payload) =>
  api
    .callApi({
      url: `${prefix}/omr-upload`,
      data: payload,
      method: 'put',
    })
    .then((result) => result.data)

const getOmrUploadSessions = ({ assignmentId, groupId, archived, aborted }) =>
  api
    .callApi({
      url: `${prefix}/omr-uploads`,
      params: {
        assignmentId: assignmentId || '',
        groupId: groupId || '',
        archived: archived || '',
        aborted: aborted || '',
      },
      method: 'get',
    })
    .then((result) => result.data.result)

const splitScanOmrSheets = (payload) =>
  api
    .callApi({
      url: `${prefix}/scan-omr`,
      data: payload,
      method: 'post',
    })
    .then((result) => result.data)

export default {
  createOmrUploadSession,
  updateOmrUploadSession,
  getOmrUploadSessions,
  splitScanOmrSheets,
}
