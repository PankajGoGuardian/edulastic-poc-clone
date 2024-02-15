import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { all, takeLatest, call, put } from 'redux-saga/effects'
import { publisherApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

// CONSTANTS
export const GET_COLLECTIONS_DATA_REQUEST =
  '[publisherDashboard] get collections data request'
export const GET_COLLECTIONS_DATA_SUCCESS =
  '[publisherDashboard] get collections data success'

// Actions
export const getCollectionsDataAction = createAction(
  GET_COLLECTIONS_DATA_REQUEST
)
export const setCollectionsDataAction = createAction(
  GET_COLLECTIONS_DATA_SUCCESS
)

const initialState = { collectionsData: {} }

// Reducer
export const reducer = createReducer(initialState, {
  [GET_COLLECTIONS_DATA_SUCCESS]: (state, { payload }) => {
    state.collectionsData = payload
  },
})

// Selectors
export const stateSelector = (state) => state.publisherDashboard

export const getCollectionsDataSelector = createSelector(
  stateSelector,
  (state) => state.collectionsData
)

// Sagas
function* getCollectionsDataSaga({ payload }) {
  try {
    const collectionData = yield call(publisherApi.getCollectionsData, payload)
    yield put(setCollectionsDataAction(collectionData))
  } catch (err) {
    console.error(err)
    notification({ messageKey: 'failedToLoadCollectionData' })
  }
}

export function* watcherSaga() {
  yield all([takeLatest(GET_COLLECTIONS_DATA_REQUEST, getCollectionsDataSaga)])
}

export const sagas = [watcherSaga()]
export default reducer
