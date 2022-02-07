import { push } from 'react-router-redux'
import pdfjsLib from 'pdfjs-dist'
import { createSlice } from 'redux-starter-kit'
import { takeLatest, call, put, all } from 'redux-saga/effects'
import axios from 'axios'

import { aws } from '@edulastic/constants'
import { scannerApi } from '@edulastic/api'
import { notification, uploadToS3 } from '@edulastic/common'

import {
  deleteNotificationDocuments,
  omrSheetScanStatus,
  omrUploadSessionStatus,
} from './utils'

function parseQr(qrCode) {
  let testId
  let assignmentId
  let groupId
  let studentId
  let page
  if (qrCode.includes('_')) {
    // ${testId}_${assignmentId}_${classId}_${studentId}_${page}
    ;[testId, assignmentId, groupId, studentId, page] = qrCode.split('_')

    if (studentId == 1) {
      ;[assignmentId, groupId, studentId] = qrCode.split('_')
    }
  } else if (qrCode.includes('.')) {
    ;[assignmentId, groupId, studentId] = qrCode.split('.')
  }

  return {
    testId,
    assignmentId,
    groupId,
    studentId,
    page,
  }
}

const getTotalPdfPageCount = (file) =>
  new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onload = () => {
        pdfjsLib
          .getDocument(reader.result)
          .then((doc) => resolve(doc.numPages))
          .catch((e) => {
            reject(e)
          })
      }
      reader.readAsArrayBuffer(file)
    } catch (e) {
      reject(e)
    }
  })

const slice = createSlice({
  name: 'uploadAnswerSheets',
  initialState: {
    uploading: false,
    uploadProgress: 0,
    uploadStep: 0,
    uploadRunner: null,
    cancelUpload: null,
    loading: false,
    omrUploadSessions: [],
    currentSession: {},
    omrSheetDocs: {},
    showSessions: false,
    responsePageNumber: 0,
    error: '',
    assignmentTitle: 'Loading...',
    classTitle: '...',
    webCamScannedDocs: [],
    recordedVideo: {
      url: null,
      time: null,
    },
  },
  reducers: {
    setCancelUpload: (state, { payload }) => {
      state.cancelUpload = payload
    },
    handleUploadProgress: (state, { payload }) => {
      if (payload.step) {
        const uploadStep = state.uploadStep || payload.step
        const uploadProgress = state.uploadProgress + uploadStep
        state.uploadStep = Number((uploadStep / 2).toFixed(2))
        state.uploadProgress = uploadProgress >= 100 ? 99 : uploadProgress
      } else {
        const { loaded: uploaded, total } = payload.progressData
        const mulFactor = payload.mulFactor || 100
        const uploadProgress = Number(
          ((mulFactor * uploaded) / total).toFixed(2)
        )
        state.uploadProgress = uploadProgress || 0
      }
    },
    setUploadRunner: (state, { payload }) => {
      state.uploadRunner = payload
    },
    getOmrUploadSessions: (state) => {
      state.loading = true
    },
    getOmrUploadSessionsDone: (state, { payload }) => {
      state.loading = false
      if (payload.error) {
        state.error = payload.error
      } else {
        state.omrUploadSessions = payload.omrUploadSessions
      }
    },
    setAssignmentAndClassTitle: (state, { payload }) => {
      state.assignmentTitle = payload.assignmentTitle
      state.classTitle = payload.classTitle
    },
    setOmrUploadSession: (state, { payload }) => {
      state.currentSession = payload.session || {}
      if (payload.update) {
        const filteredSessions = state.omrUploadSessions.filter(
          (s) => s._id !== payload.session._id
        )
        state.omrUploadSessions = [
          ...filteredSessions,
          payload.currentSession || {},
        ]
      }
    },
    createOmrUploadSession: (state) => {
      state.uploading = true
    },
    createOmrUploadSessionDone: (state, { payload }) => {
      state.uploading = false
      state.uploadProgress = 0
      state.uploadStep = 0
      state.uploadRunner = null
      state.cancelUpload = null
      if (payload.error) {
        state.error = payload.error
      }
      if (payload.session) {
        const filteredSessions = state.omrUploadSessions.filter(
          (s) => s._id !== payload.session._id
        )
        state.currentSession = payload.session
        state.omrUploadSessions = [...filteredSessions, payload.session]
      }
    },
    updateOmrUploadSession: () => {},
    abortOmrUploadSession: (state) => {
      if (state.cancelUpload) {
        state.cancelUpload()
      }
    },
    abortOmrUploadSessionDone: (state, { payload }) => {
      if (payload.error) {
        state.error = payload.error
      } else {
        const session = {
          ...state.currentSession,
          status: omrUploadSessionStatus.ABORTED,
        }
        const filteredSessions = state.omrUploadSessions.filter(
          (s) => s._id !== payload.session._id
        )
        state.omrUploadSessions = [...filteredSessions, session]
        state.currentSession = {}
      }
    },
    setOmrSheetDocsAction: (state, { payload }) => {
      state.omrSheetDocs = payload
    },
    setResponsePageNumber: (state, { payload }) => {
      state.responsePageNumber = payload || 0
    },
    setWebCamScannedDocs: (state, { payload }) => {
      state.webCamScannedDocs = payload.map(({ qrCode, ...x }) => ({
        ...x,
        ...parseQr(qrCode),
      }))
    },
    setRecordedVideo: (state, { payload }) => {
      if (state.recordedVideo.url) {
        // purely for performance optimization to release memory for recorded blob video
        URL.revokeObjectURL(state.recordedVideo.url)
      }
      const { url, filename } = payload
      state.recordedVideo = { url, filename, time: +new Date() }
    },
  },
})

function* getOmrUploadSessionsSaga({ payload }) {
  try {
    const { sessionId, fromWebcam, ..._payload } = payload
    const result = yield call(scannerApi.getOmrUploadSessions, _payload)
    const { omrUploadSessions, assignmentTitle, classTitle } = result || {}
    yield put(
      slice.actions.setAssignmentAndClassTitle({ assignmentTitle, classTitle })
    )
    const currentSession =
      omrUploadSessions?.find((session) => session._id === sessionId) ||
      omrUploadSessions?.filter(
        ({ status }) =>
          status === omrUploadSessionStatus.SCANNING ||
          status === omrUploadSessionStatus.DONE
      ).lastItem
    if (currentSession) {
      yield put(slice.actions.setOmrUploadSession({ session: currentSession }))
      if (!sessionId && !fromWebcam) {
        yield put(
          push({
            pathname: '/uploadAnswerSheets',
            search: `?assignmentId=${payload.assignmentId}&groupId=${payload.groupId}&sessionId=${currentSession._id}`,
          })
        )
      }
    }
    yield put(slice.actions.getOmrUploadSessionsDone({ omrUploadSessions }))
  } catch (e) {
    console.log(e)
    notification({
      msg:
        'Error getting last uploaded data. Please try again later or reach us at support@edulastic.com',
    })
    yield put(slice.actions.getOmrUploadSessionsDone({ error: e.message }))
  }
}

function* createOmrUploadSessionSaga({
  payload: {
    file,
    assignmentId,
    groupId,
    handleUploadProgress,
    setCancelUpload,
  },
}) {
  let uploadRunner
  try {
    if (!file) {
      throw new Error(
        'Multiple files and file type other than PDF are not supported.'
      )
    }

    if (file.type === 'application/pdf') {
      const pdfPagesCount = yield call(getTotalPdfPageCount, file)
      if (pdfPagesCount > 100) {
        throw new Error(
          'Maximum 100 sheets allowed in a single PDF. Please split the PDF and upload in batches one by one.'
        )
      }
    }

    const source = { name: file.name, size: file.size }
    const session = yield call(scannerApi.createOmrUploadSession, {
      assignmentId,
      groupId,
      source,
    })
    const { _id: sessionId } = session
    yield put(slice.actions.setOmrUploadSession({ session, update: true }))
    yield put(
      push({
        pathname: '/uploadAnswerSheets',
        search: `?assignmentId=${assignmentId}&groupId=${groupId}&sessionId=${sessionId}`,
      })
    )
    source.uri = yield call(
      uploadToS3,
      file,
      aws.s3Folders.BUBBLE_SHEETS,
      (progressData) => handleUploadProgress({ progressData, mulFactor: 80 }),
      setCancelUpload,
      `${assignmentId}/${sessionId}`,
      true
    )
    uploadRunner = yield call(
      setInterval,
      () => handleUploadProgress({ step: 8 }),
      1000
    )
    yield put(slice.actions.setUploadRunner(uploadRunner))
    const { result: sessionUpdated, error } = yield call(
      scannerApi.splitScanOmrSheets,
      {
        assignmentId,
        sessionId,
        groupId,
        source,
      }
    )
    yield call(clearInterval, uploadRunner)
    yield put(
      handleUploadProgress({ progressData: { loaded: 100, total: 100 } })
    )
    if (error) {
      throw new Error(error)
    }
    yield put(
      slice.actions.createOmrUploadSessionDone({
        session: { ...session, source, ...sessionUpdated },
      })
    )
  } catch (e) {
    if (!axios.isCancel(e)) {
      const msg = e.message || 'Upload failed. Please try again.'
      notification({ msg })
    }
    yield call(clearInterval, uploadRunner)
    yield put(slice.actions.createOmrUploadSessionDone({ error: e.message }))
    yield put(
      push({
        pathname: '/uploadAnswerSheets',
        search: `?assignmentId=${assignmentId}&groupId=${groupId}`,
      })
    )
  }
}

function* updateOmrUploadSessionSaga({
  payload: { assignmentId, groupId, sessionId, pageDocs, currentSession },
}) {
  try {
    const status = pageDocs.some((p) => p.status === omrSheetScanStatus.DONE)
      ? omrUploadSessionStatus.DONE
      : omrUploadSessionStatus.FAILED
    const session = {
      ...currentSession,
      pages: pageDocs,
      status,
    }
    if (status !== omrUploadSessionStatus.DONE) {
      session.message = 'No scan completed successfully. Session failed.'
    }
    yield put(slice.actions.setOmrUploadSession({ session, update: true }))
    yield call(scannerApi.updateOmrUploadSession, {
      assignmentId,
      groupId,
      sessionId,
      status,
      message: session.message,
    })
    notification({
      type: 'success',
      msg: 'Successfully scanned responses have been recorded on Edulastic.',
    })
    // delete firebase docs here
    const docIds = pageDocs.map(({ docId }) => docId)
    yield call(deleteNotificationDocuments, docIds)
  } catch (e) {
    console.log(e.message)
    const msg =
      e.message ||
      'Error in adding scores to Edulastic. Please try uploading again or reach us at support@edulastic.com'
    notification(msg)
  }
}

function* abortOmrUploadSessionSaga({
  payload: { assignmentId, groupId, sessionId, uploadRunner, source },
}) {
  try {
    if (uploadRunner) {
      yield call(clearInterval, uploadRunner)
    }
    if (sessionId) {
      yield call(scannerApi.updateOmrUploadSession, {
        assignmentId,
        groupId,
        sessionId,
        status: omrUploadSessionStatus.ABORTED,
        message: 'Aborted by user',
      })
      yield put(slice.actions.abortOmrUploadSessionDone())
      const msg = source === 'session' ? 'Scan aborted' : 'Upload aborted'
      notification({ type: 'success', msg })
    }
    yield put(
      push({
        pathname: '/uploadAnswerSheets',
        search: `?assignmentId=${assignmentId}&groupId=${groupId}`,
      })
    )
  } catch (e) {
    console.log(e.message)
    const msg =
      e.message ||
      `Error in aborting ${
        source === 'session' ? 'scan' : 'upload'
      }. Please try again or reach us at support@edulastic.com`
    notification({ msg })
    yield put(slice.actions.abortOmrUploadSessionDone({ error: e.message }))
  }
}

// export saga as default
export default function* watcherSaga() {
  yield all([
    yield takeLatest(
      slice.actions.getOmrUploadSessions,
      getOmrUploadSessionsSaga
    ),
    yield takeLatest(
      slice.actions.createOmrUploadSession,
      createOmrUploadSessionSaga
    ),
    yield takeLatest(
      slice.actions.updateOmrUploadSession,
      updateOmrUploadSessionSaga
    ),
    yield takeLatest(
      slice.actions.abortOmrUploadSession,
      abortOmrUploadSessionSaga
    ),
  ])
}

// export actions & reducer
export const { actions, reducer } = slice

// export state selector
export const selector = (state) => state?.scanStore?.uploadAnswerSheets
