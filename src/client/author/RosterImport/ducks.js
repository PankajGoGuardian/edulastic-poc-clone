import { takeEvery, all, call, put } from 'redux-saga/effects'
import { adminApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

const UPLOAD_FILES_REQUEST = '[rosterImport] upload files request'
const UPLOAD_FILES_SUCCESS = '[rosterImport] upload files success'
const UPLOAD_FILES_ERROR = '[rosterImport] upload files error'

export const uploadFilesRequestAction = createAction(UPLOAD_FILES_REQUEST)

export const uploadFilesSuccessAction = createAction(UPLOAD_FILES_SUCCESS)

export const uploadFilesErrorAction = createAction(UPLOAD_FILES_ERROR)

const initialState = {
  data: {},
  error: null,
  loading: false,
}

export const reducer = createReducer(initialState, {
  [UPLOAD_FILES_REQUEST]: (state) => {
    state.loading = true
  },
  [UPLOAD_FILES_SUCCESS]: (state) => {
    state.loading = false
  },
  [UPLOAD_FILES_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

function* uploadFilesSaga({ payload }) {
  try {
    yield call(adminApi.rosterImportFileUploadApi, payload)
    yield put(uploadFilesSuccessAction())
  } catch (err) {
    notification({
      type: 'error',
      msg: 'Unable to upload roster import csv files.',
    })
    yield put(uploadFilesErrorAction({ error: err }))
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(UPLOAD_FILES_REQUEST, uploadFilesSaga)])
}
