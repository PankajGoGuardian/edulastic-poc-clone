import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import { userContextApi } from '@edulastic/api'
import { keyBy } from 'lodash'

const maxPins = 50
const maxAutoPins = 5
const slice = createSlice({
  initialState: {
    pins: [],
    pinsKeyed: {},
    autoPins: sessionStorage.autoPins
      ? JSON.parse(sessionStorage.autoPins)
      : [],
    loading: false,
    showPinBoard: false,
  },
  reducers: {
    _addPin: (state, { payload }) => {
      if (!(payload.contentId in state.pinsKeyed)) {
        if (state.pins.length + 1 > maxPins) {
          const lastItem = state.pins.pop()
          delete state.pinsKeyed[lastItem]
        }
        state.pinsKeyed[payload.contentId] = payload
        state.pins.unshift(payload.contentId)
      }
    },
    _removePin: (state, { payload }) => {
      if (payload in state.pinsKeyed) {
        delete state.pinsKeyed[payload]
      }
      state.pins = state.pins.filter((x) => x != payload)
    },
    _setItems: (state, { payload }) => {
      state.pins = payload.map((x) => x.contentId)
      state.pinsKeyed = keyBy(payload, 'contentId')
    },
    addPin: () => {},
    removePin: () => {},
    setItems: () => {},
    loadItems: () => {},
    addAutoPins: (state, { payload }) => {
      if (state.autoPins.find((x) => x.contentId === payload.contentId)) {
        return state
      }
      if (state.autoPins.length + 1 > maxAutoPins) {
        state.autoPins.pop()
      }
      state.autoPins.unshift(payload)
    },
  },
})

export { slice }

const getCurrentItemsSelector = createSelector((state) =>
  state.pinned.pins.map((x) => state.pinned.pinsKeyed[x])
)

function* saveCurrentSaga() {
  const currentItems = yield select(getCurrentItemsSelector)
  window.sessionStorage.pinnedItems = JSON.stringify(currentItems)
  yield call(userContextApi.setPinData, currentItems)
}

function* addPinSaga({ payload }) {
  const oldData = yield select(getCurrentItemsSelector)
  try {
    yield put(slice.actions._addPin(payload))
    yield call(saveCurrentSaga)
  } catch (e) {
    yield put(slice.actions._setItems(oldData))
  }
}

function* removePinSaga({ payload }) {
  const oldData = yield select(getCurrentItemsSelector)
  try {
    yield put(slice.actions._removePin(payload))
    yield call(saveCurrentSaga)
  } catch (e) {
    console.warn('removePin error', e)
    yield put(slice.actions._setItems(oldData))
  }
}

function* setItemsSaga({ payload }) {
  const oldData = yield select(getCurrentItemsSelector)
  try {
    yield put(slice.actions._setItems(payload))
    yield call(saveCurrentSaga)
  } catch (e) {
    console.warn('setItems err', e)
    yield put(slice.actions._setItems(oldData))
  }
}

function* loadItemsSaga() {
  if (sessionStorage.pinnedItems) {
    yield put(slice.actions._setItems(JSON.parse(sessionStorage.pinnedItems)))
  }
  try {
    const items = yield call(userContextApi.getPinData)
    sessionStorage.pinnedItems = JSON.stringify(items)
    yield put(slice.actions._setItems(items))
  } catch (e) {
    console.warn('loading pinnedItems error', e)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.addPin, addPinSaga),
    yield takeEvery(slice.actions.removePin, removePinSaga),
    yield takeEvery(slice.actions.setItems, setItemsSaga),
    yield takeEvery(slice.actions.loadItems, loadItemsSaga),
  ])
}
