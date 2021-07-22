import { push } from 'react-router-redux'
import { createSlice } from 'redux-starter-kit'
import { takeLatest, call, put, all } from 'redux-saga/effects'

import { aws } from '@edulastic/constants'
import { assignmentApi } from '@edulastic/api'
import { notification, uploadToS3 } from '@edulastic/common'

import { deleteNotificationDocuments } from './utils'

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
    error: '',
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
        const session = { ...state.currentSession, status: 6 } // aborted
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
  },
})

function* getOmrUploadSessionsSaga({ payload }) {
  try {
    const { sessionId, ..._payload } = payload
    const omrUploadSessions = yield call(
      assignmentApi.getOmrUploadSessions,
      _payload
    )
    const currentSession = omrUploadSessions.find(
      (session) => session._id === sessionId
    )
    yield put(slice.actions.getOmrUploadSessionsDone({ omrUploadSessions }))
    if (currentSession) {
      yield put(slice.actions.setOmrUploadSession({ session: currentSession }))
    }
  } catch (e) {
    console.log(e.message)
    notification({ msg: 'Failed to fetch upload sessions' })
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
    const source = { name: file.name }
    const session = yield call(assignmentApi.createOmrUploadSession, {
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
      `${assignmentId}/${sessionId}`
    )
    const uploadRunner = yield call(
      setInterval,
      () => handleUploadProgress({ step: 8 }),
      1000
    )
    yield put(slice.actions.setUploadRunner(uploadRunner))
    const { result: sessionUpdated, error } = yield call(
      assignmentApi.splitScanOmrSheets,
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
    console.log(e.message)
    const msg = e.message || 'Failed to upload file'
    notification({ msg })
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
    const session = { ...currentSession, status: 3, pages: pageDocs }
    yield put(slice.actions.setOmrUploadSession({ session, update: true }))
    yield call(assignmentApi.updateOmrUploadSession, {
      assignmentId,
      groupId,
      sessionId,
      status: 3,
    })
    notification({ type: 'success', msg: 'Scoring completed!' })
    // TODO: delete firbase docs here
    const docIds = pageDocs.map(({ docId }) => docId)
    deleteNotificationDocuments(docIds)
  } catch (e) {
    console.log(e.message)
    const msg = e.message || 'Scoring completed. Failed to update session!'
    notification(msg)
  }
}

function* abortOmrUploadSessionSaga({
  payload: { assignmentId, groupId, sessionId, uploadRunner },
}) {
  try {
    if (uploadRunner) {
      yield call(clearInterval, uploadRunner)
    }
    if (sessionId) {
      yield call(assignmentApi.abortOmrUploadSession, {
        assignmentId,
        groupId,
        sessionId,
      })
      yield put(slice.actions.abortOmrUploadSessionDone())
      notification({ type: 'success', msg: 'Aborted upload session' })
    }
    yield put(
      push({
        pathname: '/uploadAnswerSheets',
        search: `?assignmentId=${assignmentId}&groupId=${groupId}`,
      })
    )
  } catch (e) {
    console.log(e.message)
    const msg = e.message || 'Failed to abort upload session'
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
