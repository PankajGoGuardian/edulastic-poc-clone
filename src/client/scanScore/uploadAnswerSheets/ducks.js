import { push } from 'react-router-redux'
import pdfjsLib from 'pdfjs-dist'
import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { takeLatest, call, put, all, select } from 'redux-saga/effects'
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
  name: 'uploadAnswerSheets', //! FIXME key should be `slice` not `name`
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
        state.hasNonMcq = payload.hasNonMcq
        state.bubbleSheetVersion = payload.bubbleSheetVersion
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
    updateOmrUploadSessionOnSplitPDFAction: () => {
      // redux saga is sufficient, no state change required
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

// export actions & reducer
export const { actions, reducer } = slice

// export state selector
export const selector = (state) => state?.scanStore?.uploadAnswerSheets
export const currentSessionSelector = createSelector(
  selector,
  (state) => state.currentSession
)

function* getOmrUploadSessionsSaga({ payload }) {
  try {
    const { sessionId, fromWebcam, ..._payload } = payload
    const result = yield call(scannerApi.getOmrUploadSessions, _payload)
    const {
      omrUploadSessions,
      assignmentTitle,
      classTitle,
      bubbleSheetVersion,
      hasNonMcq,
    } = result || {}
    yield put(
      slice.actions.setAssignmentAndClassTitle({ assignmentTitle, classTitle })
    )
    const currentSession = sessionId
      ? omrUploadSessions?.find((session) => session._id === sessionId)
      : omrUploadSessions?.filter(
          ({ status }) => status >= omrUploadSessionStatus.SCANNING
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
    yield put(
      slice.actions.getOmrUploadSessionsDone({
        omrUploadSessions,
        hasNonMcq,
        bubbleSheetVersion,
      })
    )
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
      (progressData) => handleUploadProgress({ progressData, mulFactor: 99 }),
      setCancelUpload,
      `${assignmentId}/${sessionId}`,
      true
    )
    const { error } = yield call(scannerApi.splitScanOmrSheets, {
      assignmentId,
      sessionId,
      groupId,
      source,
    })
    yield put(
      handleUploadProgress({ progressData: { loaded: 100, total: 100 } })
    )
    if (error) {
      throw new Error(error)
    }
    yield put(
      slice.actions.createOmrUploadSessionDone({
        session: { ...session, source },
      })
    )
  } catch (e) {
    if (!axios.isCancel(e)) {
      const msg = e.message || 'Upload failed. Please try again.'
      notification({ msg })
    }
    yield put(slice.actions.createOmrUploadSessionDone({ error: e.message }))
    yield put(
      push({
        pathname: '/uploadAnswerSheets',
        search: `?assignmentId=${assignmentId}&groupId=${groupId}`,
      })
    )
  }
}

function* updateOmrUploadSessionOnSplitPDFSaga({ payload: splitPDFDocs }) {
  const currentSession = yield select(currentSessionSelector)
  const currentSessionSplitPDFDoc = splitPDFDocs.find(
    (doc) =>
      doc.sessionId === currentSession._id &&
      doc.processStatus !== 'in_progress'
  )
  if (
    currentSessionSplitPDFDoc &&
    currentSession.status === omrUploadSessionStatus.NOT_STARTED
  ) {
    if (currentSessionSplitPDFDoc.processStatus === 'failed') {
      notification({ msg: currentSessionSplitPDFDoc.message })
      yield put(
        slice.actions.createOmrUploadSessionDone({
          error: currentSessionSplitPDFDoc.message,
        })
      )
      yield put(
        push({
          pathname: '/uploadAnswerSheets',
          search: `?assignmentId=${currentSessionSplitPDFDoc.assignmentId}&groupId=${currentSessionSplitPDFDoc.groupId}`,
        })
      )
    } else if (currentSessionSplitPDFDoc.processStatus === 'done') {
      yield put(
        slice.actions.createOmrUploadSessionDone({
          session: { ...currentSession, status: omrSheetScanStatus.SCANNING },
        })
      )
    }
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
    const { hasNonMcq } = yield select(selector)
    if (hasNonMcq) {
      notification({
        type: 'warn',
        msg:
          'Multiple choice responses are graded. Please manually grade the other responses.',
        exact: true,
        duration: null,
      })
    } else {
      notification({
        type: 'success',
        msg: 'Successfully scanned responses have been recorded on Edulastic.',
      })
    }
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
    takeLatest(slice.actions.getOmrUploadSessions, getOmrUploadSessionsSaga),
    takeLatest(
      slice.actions.createOmrUploadSession,
      createOmrUploadSessionSaga
    ),
    takeLatest(
      slice.actions.updateOmrUploadSessionOnSplitPDFAction,
      updateOmrUploadSessionOnSplitPDFSaga
    ),
    takeLatest(
      slice.actions.updateOmrUploadSession,
      updateOmrUploadSessionSaga
    ),
    takeLatest(slice.actions.abortOmrUploadSession, abortOmrUploadSessionSaga),
  ])
}
