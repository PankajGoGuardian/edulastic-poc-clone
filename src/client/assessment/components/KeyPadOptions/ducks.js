import { createAction } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import get from 'lodash/get'
import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'

import { userContextApi } from '@edulastic/api'
import { math } from '@edulastic/constants'
import notification from '@edulastic/common/src/components/Notification'

import { getTestEntitySelector } from '../../../author/TestPage/ducks'

const { symbols: predefinedKeypads } = math

const STORE_USER_CUSTOM_KEYPAD = '[customkeypad] store customkeypad request'
export const storeCustomKeypadAction = createAction(STORE_USER_CUSTOM_KEYPAD)

const RETRIEVE_USER_CUSTOM_KEYPAD = '[customkeypad] fetch customkeypad request'
export const fetchCustomKeypadAction = createAction(RETRIEVE_USER_CUSTOM_KEYPAD)

const UPDATE_USER_CUSTOM_KEYPAD = '[customkeypad] update customkeypad request'
export const updateCustomKeypadAction = createAction(UPDATE_USER_CUSTOM_KEYPAD)

const SET_CUSTOM_KEYPADS = '[customkeypad] set customkeypad to redux'

const DELETE_CUSTOM_KEYPAD = '[customkeypad] delete a custom keypad'
export const deleteCustomKeypadAction = createAction(DELETE_CUSTOM_KEYPAD)

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

const stateSelector = (state) => state.customKeypad

export const customKeypadSelector = createSelector(
  stateSelector,
  (state) => state.keypads
)

const currentKeypadDocIdSelector = createSelector(
  stateSelector,
  (customKeypad) => customKeypad.docId
)

export const allKeypadSelector = createSelector(
  customKeypadSelector,
  (customKeypads) => customKeypads.concat(predefinedKeypads)
)

export const testKeyboardSelector = createSelector(
  getTestEntitySelector,
  (test) => get(test, ['keypad', 'value'], {})
)

export const allKeypadForTestSelector = createSelector(
  customKeypadSelector,
  testKeyboardSelector,
  (customKeypads, testKeyboard) => {
    let keypads = [
      ...predefinedKeypads,
      {
        type: 'item-level',
        value: 'item-level-keypad',
        label: 'Keypad set at item level',
      },
    ]
    const customKeypadClone = [...customKeypads]
    // to remove duplicate between the current test keypad selected and user custom keypad
    if (isPlainObject(testKeyboard) && !isEmpty(testKeyboard)) {
      const sameId = (obj) => obj._id === testKeyboard._id
      const includedInCustom = customKeypadClone.find(sameId)
      if (!includedInCustom) {
        customKeypadClone.push(testKeyboard)
      }
    }
    keypads = keypads.concat(customKeypadClone)
    return keypads
  }
)

function* storeCustomKeypadSaga({ payload }) {
  try {
    const previousKeypads = yield select(customKeypadSelector)
    const { label } = payload || {}
    const hasSameLabel = (keypad) => keypad.label?.trim() === label?.trim()
    if (previousKeypads.find(hasSameLabel)) {
      notification({
        type: 'warn',
        msg: `Keyboard name already exists`,
      })
      return
    }
    yield call(userContextApi.storeCustomKeypad, payload)
    yield put({
      type: RETRIEVE_USER_CUSTOM_KEYPAD,
    })
  } catch (error) {
    console.error(error)
  }
}

function getActiveKeypadsFromList(keypads) {
  const isActive = ({ active = true }) => active
  return keypads.filter(isActive)
}

function* fetchCustomKeypadSaga() {
  try {
    const results = yield call(userContextApi.getCustomKeypad)

    yield put({
      type: SET_CUSTOM_KEYPADS,
      payload: {
        keypads: getActiveKeypadsFromList(results?.value || []),
        docId: results?._id,
      },
    })
  } catch (error) {
    console.error(error)
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
        payload: {
          keypads: getActiveKeypadsFromList(results?.value || []),
          docId: results?._id,
        },
      })
    }
  } catch (error) {
    console.error(error)
  }
}

function* deleteCustomKeypadSaga({ payload }) {
  try {
    const customKeypads = [...(yield select(customKeypadSelector))]
    const hasSameId = (keypad) => keypad._id === payload._id
    const keypadIndex = customKeypads.findIndex(hasSameId)
    if (keypadIndex !== -1) {
      customKeypads.splice(keypadIndex, 1)
      const docId = yield select(currentKeypadDocIdSelector)
      yield userContextApi.deleteCustomKeypad(docId, {
        filter: { _id: payload._id },
      })
      yield put({
        type: SET_CUSTOM_KEYPADS,
        payload: { keypads: customKeypads, docId },
      })
      notification({
        type: 'success',
        msg: 'Keypad removed successfully',
      })
    }
  } catch (error) {
    console.error('error')
    notification({
      type: 'erorr',
      msg: 'Failed to remove keypad',
    })
  }
}

export function* customKeypadSaga() {
  yield all(
    yield takeLatest(STORE_USER_CUSTOM_KEYPAD, storeCustomKeypadSaga),
    yield takeLatest(RETRIEVE_USER_CUSTOM_KEYPAD, fetchCustomKeypadSaga),
    yield takeLatest(UPDATE_USER_CUSTOM_KEYPAD, updateCustomKeypadSaga),
    yield takeLatest(DELETE_CUSTOM_KEYPAD, deleteCustomKeypadSaga)
  )
}

export const getCustomKeypads = (state) => state.customKeypad.keypads

export default customKeypadReducer
