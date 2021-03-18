import { createAction } from 'redux-starter-kit'
import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import { userContextApi } from '@edulastic/api'

const STORE_USER_CUSTOM_KEYPAD = '[customkeypad] store customkeypad request'
export const storeCustomKeypadAction = createAction(STORE_USER_CUSTOM_KEYPAD)

const RETRIEVE_USER_CUSTOM_KEYPAD = '[customkeypad] fetch customkeypad request'
export const fetchCustomKeypadAction = createAction(RETRIEVE_USER_CUSTOM_KEYPAD)

const UPDATE_USER_CUSTOM_KEYPAD = '[customkeypad] update customkeypad request'
export const updateCustomKeypadAction = createAction(UPDATE_USER_CUSTOM_KEYPAD)

const SET_CUSTOM_KEYPADS = '[customkeypad] set customkeypad to redux'

const initialState = { keypads: [], docId: '' }
export function customKeypadReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_CUSTOM_KEYPADS: {
      return {
        ...state,
        keypads: payload.keypads,
        docId: payload.docId,
      }
    }
    default:
      return state
  }
}

export default customKeypadReducer

function* storeCustomKeypadSaga({ payload }) {
  try {
    yield call(userContextApi.storeCustomKeypad, payload)
    yield put({
      type: RETRIEVE_USER_CUSTOM_KEYPAD,
    })
  } catch (error) {
    console.log(error)
  }
}

function* fetchCustomKeypadSaga() {
  try {
    const results = yield call(userContextApi.getCustomKeypad)

    yield put({
      type: SET_CUSTOM_KEYPADS,
      payload: { keypads: results?.value || [], docId: results?._id },
    })
  } catch (error) {
    console.log(error)
  }
}

function* updateCustomKeypadSaga({ payload }) {
  try {
    const docId = yield select((state) => state.customKeypad.docId)

    if (docId) {
      const results = yield call(
        userContextApi.updateCustomKeypad,
        payload,
        docId
      )
      yield put({
        type: SET_CUSTOM_KEYPADS,
        payload: { keypads: results?.value || [], docId: results?._id },
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export function* customKeypadSaga() {
  yield all(
    yield takeLatest(STORE_USER_CUSTOM_KEYPAD, storeCustomKeypadSaga),
    yield takeLatest(RETRIEVE_USER_CUSTOM_KEYPAD, fetchCustomKeypadSaga),
    yield takeLatest(UPDATE_USER_CUSTOM_KEYPAD, updateCustomKeypadSaga)
  )
}

export const getCustomKeypads = (state) => state.customKeypad.keypads
