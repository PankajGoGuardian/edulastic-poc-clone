import { takeEvery, call, put, all } from 'redux-saga/effects'
import { settingsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'
import * as moment from 'moment'

const CREATE_TERM_REQUEST = '[term] create data request'
const CREATE_TERM_SUCCESS = '[term] create data success'
const CREATE_TERM_ERROR = '[term] create data error'
const RECEIVE_TERM_REQUEST = '[term] receive data request'
const RECEIVE_TERM_SUCCESS = '[term] receive data success'
const RECEIVE_TERM_ERROR = '[term] receive data error'
const UPDATE_TERM_REQUEST = '[term] update data request'
const UPDATE_TERM_SUCCESS = '[term] update data success'
const UPDATE_TERM_ERROR = '[term] update data error'
const DELETE_TERM_REQUEST = '[term] delete data request'
const DELETE_TERM_SUCCESS = '[term] delete data success'
const DELETE_TERM_ERROR = '[term] delete data ERROR'
const SET_TERMTABLE_EDITKEY = '[term] current editkey'

export const createTermAction = createAction(CREATE_TERM_REQUEST)
export const createTermSuccessAction = createAction(CREATE_TERM_SUCCESS)
export const createTermErrorAction = createAction(CREATE_TERM_ERROR)
export const receiveTermAction = createAction(RECEIVE_TERM_REQUEST)
export const receiveTermSuccessAction = createAction(RECEIVE_TERM_SUCCESS)
export const receiveTermErrorAction = createAction(RECEIVE_TERM_ERROR)
export const updateTermAction = createAction(UPDATE_TERM_REQUEST)
export const updateTermSuccessAction = createAction(UPDATE_TERM_SUCCESS)
export const updateTermErrorAction = createAction(UPDATE_TERM_ERROR)
export const deleteTermAction = createAction(DELETE_TERM_REQUEST)
export const deleteTermSuccessAction = createAction(DELETE_TERM_SUCCESS)
export const deleteTermErrorAction = createAction(DELETE_TERM_ERROR)
export const setEditKeyAction = createAction(SET_TERMTABLE_EDITKEY)
// reducers
const initialState = {
  data: {},
  error: null,
  loading: false,
  updating: false,
  update: null,
  updateError: null,
  creating: false,
  create: { data: {}, key: -1 },
  createError: null,
  deleting: false,
  deleteError: null,
  editingKey: '',
}

export const reducer = createReducer(initialState, {
  [CREATE_TERM_REQUEST]: (state) => {
    state.creating = true
  },
  [CREATE_TERM_SUCCESS]: (state, { payload }) => {
    state.creating = false
    state.create = payload
    const createdData = []
    createdData.push({
      key: payload.key,
      name: payload.data.name,
      startDate: payload.data.startDate,
      endDate: payload.data.endDate,
      startDateVisible: moment(payload.data.startDate)
        .utc()
        .format('DD MMM YYYY'),
      endDateVisible: moment(payload.data.endDate).utc().format('DD MMM YYYY'),
      _id: payload.data._id,
    })
    state.data = createdData.concat(state.data)
  },
  [CREATE_TERM_ERROR]: (state, { payload }) => {
    state.creating = false
    state.createError = payload.error
  },
  [RECEIVE_TERM_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_TERM_SUCCESS]: (state, { payload }) => {
    state.loading = false
    const receivedTerm = []
    for (let i = 0; i < payload.length; i++) {
      receivedTerm.push({
        key: i,
        name: payload[i].name,
        startDate: payload[i].startDate,
        endDate: payload[i].endDate,
        startDateVisible: moment(payload[i].startDate)
          .utc()
          .format('DD MMM YYYY'),
        endDateVisible: moment(payload[i].endDate).utc().format('DD MMM YYYY'),
        _id: payload[i]._id,
      })
    }
    state.data = receivedTerm.sort((a, b) => b.startDate - a.startDate)
  },
  [RECEIVE_TERM_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [UPDATE_TERM_REQUEST]: (state) => {
    state.updating = true
  },
  [UPDATE_TERM_SUCCESS]: (state, { payload }) => {
    const updatedTerm = {
      name: payload.name,
      startDate: payload.startDate,
      endDate: payload.endDate,
      startDateVisible: moment(payload.startDate).utc().format('DD MMM YYYY'),
      endDateVisible: moment(payload.endDate).utc().format('DD MMM YYYY'),
      _id: payload._id,
    }
    const termData = []
    for (let i = 0; i < state.data.length; i++) {
      if (state.data[i]._id === payload._id)
        termData.push({ ...state.data[i], ...updatedTerm })
      else termData.push(state.data[i])
    }
    state.update = payload
    state.data = termData
    state.updating = false
  },
  [UPDATE_TERM_ERROR]: (state, { payload }) => {
    state.updating = false
    state.updateError = payload.error
  },
  [DELETE_TERM_REQUEST]: (state) => {
    state.deleting = true
  },
  [DELETE_TERM_SUCCESS]: (state, { payload }) => {
    state.deleting = false
    state.data = state.data.filter((term) => term._id !== payload)
  },
  [DELETE_TERM_ERROR]: (state, { payload }) => {
    state.deleting = false
    state.deleteError = payload.error
  },
  [SET_TERMTABLE_EDITKEY]: (state, { payload }) => {
    state.editingKey = payload
  },
})

// sagas
function* receiveTermeSaga({ payload }) {
  try {
    const term = yield call(settingsApi.getTerm, payload)
    yield put(receiveTermSuccessAction(term))
  } catch (err) {
    const errorMessage = 'Unable to retrieve term info.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveTermErrorAction({ error: errorMessage }))
  }
}

function* createTermSaga({ payload }) {
  try {
    const createTerm = yield call(settingsApi.createTerm, {
      body: payload.body,
    })
    const key = payload.key
    yield put(createTermSuccessAction({ data: createTerm, key }))
  } catch (err) {
    const errorMessage = 'Unable to create the term.'
    notification({ type: 'error', msg: errorMessage })
    yield put(createTermErrorAction({ error: errorMessage }))
  }
}

function* updateTermSaga({ payload }) {
  try {
    const updateTerm = yield call(settingsApi.updateTerm, payload)
    yield put(updateTermSuccessAction(updateTerm))
  } catch (err) {
    const errorMessage = 'Unable to update term.'
    notification({ type: 'error', msg: errorMessage })
    yield put(updateTermErrorAction({ error: errorMessage }))
  }
}

function* deleteTermSaga({ payload }) {
  try {
    yield call(settingsApi.deleteTerm, payload)
    yield put(deleteTermSuccessAction(payload.body.termId))
  } catch (err) {
    const errorMessage = 'Unable to remove term.'
    notification({ type: 'error', msg: errorMessage })
    yield put(deleteTermErrorAction({ deleteError: errorMessage }))
  }
}

export function* watcherSaga() {
  yield all([takeEvery(RECEIVE_TERM_REQUEST, receiveTermeSaga)])
  yield all([takeEvery(CREATE_TERM_REQUEST, createTermSaga)])
  yield all([takeEvery(UPDATE_TERM_REQUEST, updateTermSaga)])
  yield all([takeEvery(DELETE_TERM_REQUEST, deleteTermSaga)])
}
