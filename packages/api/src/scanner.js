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
      useSlowApi: true,
      url: `${prefix}/scan-omr`,
      data: payload,
      method: 'post',
    })
    .then((result) => result.data)

const generateWebCamOmrSession = ({ assignmentId, groupId }) =>
  api
    .callApi({
      url: `${prefix}/omr-session`,
      data: { assignmentId, groupId },
      method: 'post',
    })
    .then((result) => result?.data?.result)

// {{value:{assignmentId:string,groupId:string,sessionId:string,responses:{answers:string[],studentId:string,imageUri:string}[]}},error?:Error}

const scoreWebCamScans = ({ assignmentId, groupId, sessionId, responses }) =>
  api.callApi({
    url: `${prefix}/score-answers`,
    method: 'POST',
    data: {
      assignmentId,
      groupId,
      sessionId,
      responses,
    },
  })

export default {
  createOmrUploadSession,
  updateOmrUploadSession,
  getOmrUploadSessions,
  splitScanOmrSheets,
  generateWebCamOmrSession,
  scoreWebCamScans,
}
