import { push } from 'react-router-redux'
import { createSlice } from 'redux-starter-kit'
import { takeLatest, call, put, all } from 'redux-saga/effects'

import { aws } from '@edulastic/constants'
import { assignmentApi } from '@edulastic/api'
import { notification, uploadToS3 } from '@edulastic/common'

const slice = createSlice({
  name: 'uploadAnswerSheets',
  initialState: {
    uploading: false,
    uploadProgress: 0,
    loading: false,
    omrUploadSessions: [],
    currentSession: {},
    omrSheetDocs: {},
    error: '',
  },
  reducers: {
    setUploadProgress: (state, { payload }) => {
      state.uploadProgress = payload || 0
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
        state.omrUploadSessions = [...filteredSessions, payload.session]
      }
    },
    createOmrUploadSession: (state) => {
      state.uploading = true
    },
    createOmrUploadSessionDone: (state, { payload }) => {
      state.uploading = false
      state.uploadProgress = 0
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
    notification({ msg: 'Failed to fetch upload sessions' })
    yield put(slice.actions.getOmrUploadSessionsDone({ error: e.message }))
  }
}

function* createOmrUploadSessionSaga({
  payload: { file, assignmentId, groupId, handleProgress, handleCancel },
}) {
  try {
    const source = { name: file.name }
    const session = yield call(assignmentApi.createOmrUploadSession, {
      assignmentId,
      groupId,
      source,
    })
    const { _id: sessionId } = session
    source.uri = yield call(
      uploadToS3,
      file,
      aws.s3Folders.BUBBLE_SHEETS,
      handleProgress,
      handleCancel,
      `${assignmentId}/${sessionId}`
    )
    yield put(slice.actions.setOmrUploadSession({ session, update: true }))
    yield put(
      push({
        pathname: '/uploadAnswerSheets',
        search: `?assignmentId=${assignmentId}&groupId=${groupId}&sessionId=${sessionId}`,
      })
    )
    const { result: sessionUpdated, error } = yield call(
      assignmentApi.splitScanBubbleSheets,
      {
        assignmentId,
        sessionId,
        groupId,
        source,
      }
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
    const msg = e.message || 'Failed to fetch upload sessions'
    notification({ msg })
    yield put(slice.actions.createOmrUploadSessionDone({ error: e.message }))
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
  ])
}

// export actions & reducer
export const { actions, reducer } = slice

// export state selector
export const selector = (state) => state?.scanStore?.uploadAnswerSheets
