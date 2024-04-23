import { takeLatest, takeEvery, call, put, all } from 'redux-saga/effects'
// import { dictionariesApi } from '@edulastic/api'
import dictionariesApi from '@edulastic/api/src/dictionaries'
import { captureSentryException } from '@edulastic/common/src/sentryHelpers'
import notification from '@edulastic/common/src/components/Notification'
import _ from 'lodash'
import { dictionaries } from '@edulastic/constants'
import {
  RECEIVE_DICT_CURRICULUMS_REQUEST,
  RECEIVE_DICT_CURRICULUMS_SUCCESS,
  RECEIVE_DICT_CURRICULUMS_ERROR,
  RECEIVE_DICT_STANDARDS_REQUEST,
  RECEIVE_DICT_STANDARDS_SUCCESS,
  RECEIVE_DICT_STANDARDS_ERROR,
  ADD_NEW_ALIGNMENT,
  ADD_DICT_ALIGNMENT,
  REMOVE_EXISTED_ALIGNMENT,
  REMOVE_DICT_ALINMENT,
  RECEIVE_TLO_STANDARDS_REQUEST,
  RECEIVE_TLO_STANDARDS_SUCCESS,
  RECEIVE_ELO_STANDARDS_REQUEST,
  RECEIVE_ELO_STANDARDS_SUCCESS,
} from '../constants/actions'
import { ADD_ALIGNMENT, REMOVE_ALIGNMENT } from '../../sharedDucks/questions'
import { INTERESTED_STANDARD_SETS } from '../../TestPage/components/AddItems/ducks'

function* receiveCurriculumsSaga() {
  try {
    const items = yield call(dictionariesApi.receiveCurriculums)

    yield put({
      type: RECEIVE_DICT_CURRICULUMS_SUCCESS,
      payload: { items },
    })
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage = 'Unable to retrive curriculums.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: RECEIVE_DICT_CURRICULUMS_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveStandardsTloSaga({ payload }) {
  try {
    if (payload.curriculumId) {
      const tloResults = yield call(dictionariesApi.receiveStandards, {
        ...payload,
        levels: dictionaries.TLO_LEVELS,
      })
      yield put({
        type: RECEIVE_TLO_STANDARDS_SUCCESS,
        payload: tloResults,
      })
    } else {
      yield put({
        type: RECEIVE_TLO_STANDARDS_SUCCESS,
        payload: [],
      })
    }
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage = 'Unable to retrieve standards.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: RECEIVE_DICT_STANDARDS_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveStandardsEloSaga({ payload }) {
  try {
    if (payload.curriculumId) {
      const eloResults = yield call(dictionariesApi.receiveStandards, {
        ...payload,
        levels: dictionaries.ELO_LEVELS,
      })
      yield put({
        type: RECEIVE_ELO_STANDARDS_SUCCESS,
        payload: eloResults,
      })
    } else {
      yield put({
        type: RECEIVE_ELO_STANDARDS_SUCCESS,
        payload: [],
      })
    }
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage = 'Unable to retrieve standards.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: RECEIVE_DICT_STANDARDS_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveStandardsSaga({ payload }) {
  try {
    if (
      payload.curriculumId &&
      payload.curriculumId !== INTERESTED_STANDARD_SETS // Avoid browse standards when user is querying all interested standards.
    ) {
      const result = yield call(dictionariesApi.receiveStandards, {
        ...payload,
        limit: dictionaries.STANDARD_DROPDOWN_LIMIT_1000,
      })
      yield put({
        type: RECEIVE_DICT_STANDARDS_SUCCESS,
        payload: result,
      })
    } else {
      yield put({
        type: RECEIVE_DICT_STANDARDS_SUCCESS,
        payload: [],
      })
    }
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage = 'Unable to retrieve standards.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: RECEIVE_DICT_STANDARDS_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* addNewAlignmentSaga({ payload }) {
  yield put({
    type: ADD_ALIGNMENT,
    payload,
  })
  const newPayload = _.cloneDeep(payload)
  newPayload.standards = []
  delete newPayload.domains
  yield put({
    type: ADD_DICT_ALIGNMENT,
    payload: newPayload,
  })
}

function* removeExistedAlignmentSaga({ payload }) {
  yield put({
    type: REMOVE_ALIGNMENT,
    payload,
  })
  yield put({ type: REMOVE_DICT_ALINMENT, payload })
}

export default function* watcherSaga() {
  yield all([
    yield takeLatest(RECEIVE_DICT_CURRICULUMS_REQUEST, receiveCurriculumsSaga),
    yield takeLatest(RECEIVE_TLO_STANDARDS_REQUEST, receiveStandardsTloSaga),
    yield takeLatest(RECEIVE_ELO_STANDARDS_REQUEST, receiveStandardsEloSaga),
    yield takeLatest(RECEIVE_DICT_STANDARDS_REQUEST, receiveStandardsSaga),
    yield takeEvery(ADD_NEW_ALIGNMENT, addNewAlignmentSaga),
    yield takeEvery(REMOVE_EXISTED_ALIGNMENT, removeExistedAlignmentSaga),
  ])
}
