import { createSlice } from 'redux-starter-kit'
import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import firebase from 'firebase/app';
import 'firebase/auth';
import { FireBaseService } from '@edulastic/common';
import { keyBy, omitBy, isUndefined } from 'lodash'

function getCurrentUserId(state){
    return state.user?.user?._id;
};

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
      } else {
          state.pinsKeyed[payload.contentId] = payload;
      }
    },
    _removePin: (state, { payload }) => {
      if (payload in state.pinsKeyed) {
        delete state.pinsKeyed[payload]
      }
      const pins = state.pins.filter((x) => x != payload)
      Object.assign(state,{pins});
    },
    _setItems: (state, { payload }) => {
      state.pins = payload.map((x) => x.contentId)
      state.pinsKeyed = keyBy(payload, 'contentId')
    },
    addPin: () => {},
    removePin: () => {},
    setItems: () => {},
    loadItems: () => {},
    _addAutoPins: (state, { payload }) => {
      const index = state.autoPins.findIndex((x) => x.contentId === payload.contentId);
      if (index != -1) {
        state.autoPins[index] = payload;
      }
      if (state.autoPins.length + 1 > maxAutoPins) {
        state.autoPins.pop()
      }
      state.autoPins.unshift(payload)
      sessionStorage.autoPins = JSON.stringify(state.autoPins);
    },
    _setAutoPins: (state,{payload}) =>{
        state.autoPins = payload;
    },
    addAutoPins: () =>{

    }
  },
})

export { slice }

const collectionName = "PinBoard";

export const getCurrentItemsSelector = (state) => state.pinned.pins.map((x) => ({...state.pinned.pinsKeyed[x],_id: state.pinned.pinsKeyed[x]?.contentId})).filter(x => x)

function* saveCurrentSaga() {
  const currentItems = yield select(getCurrentItemsSelector)
  window.sessionStorage.pinnedItems = JSON.stringify(currentItems)
  const currentUserId = yield select(getCurrentUserId);
  const itemsWithoutUndefined = currentItems.map(x => omitBy(x,isUndefined));
  return FireBaseService.db.collection(collectionName).doc(currentUserId).set({v:itemsWithoutUndefined});
//   return yield call(userContextApi.setPinData, currentItems)
}

function* addPinSaga({ payload }) {
  const oldData = yield select(getCurrentItemsSelector)

  try {
    yield put(slice.actions._addPin(payload))
    const res =  yield call(saveCurrentSaga);
  } catch (e) {
    console.log('err',e);
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
    const userId = yield select(getCurrentUserId);
    const [data,autoPinData] = yield all([FireBaseService.db.collection(collectionName).doc(userId).get(),FireBaseService.db.collection(collectionName).doc(`auto_${userId}`).get()]);
    if(data.data()){
        sessionStorage.pinnedItems = JSON.stringify(data.data()?.v)
        yield put(slice.actions._setItems(data.data().v))
    }
    if(autoPinData.data()){
        sessionStorage.autoPins = JSON.stringify(autoPinData.data()?.v);
        yield put(slice.actions._setAutoPins(autoPinData.data()?.v));
    }
  } catch (e) {
    console.warn('loading pinnedItems error', e)
  }
}


function* addAutoPinsSaga({payload}){
    try{
        yield put(slice.actions._addAutoPins(payload));
        const currentItems = yield select(state => state.pinned?.autoPins);
        const itemsWithoutUndefined = (currentItems||[]).map(x => omitBy(x,isUndefined));
        const currentUserId = yield select(getCurrentUserId);
        console.log('v utopins',itemsWithoutUndefined);
        return FireBaseService.db.collection(collectionName).doc(`auto_${currentUserId}`).set({v:itemsWithoutUndefined});
    } catch(e){
        console.warn('autoPinadd error',e);
    }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(`${slice.actions.addPin}`, addPinSaga),
    yield takeEvery(slice.actions.removePin, removePinSaga),
    yield takeEvery(slice.actions.setItems, setItemsSaga),
    yield takeEvery(slice.actions.loadItems, loadItemsSaga),
    yield takeEvery(`${slice.actions.addAutoPins}`,addAutoPinsSaga),
  ])
}
