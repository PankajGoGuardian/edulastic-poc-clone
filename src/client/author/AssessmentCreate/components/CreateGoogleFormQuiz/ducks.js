import { testImportApi } from '@edulastic/api'
import { all, call, put, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'

export const namespaceKey = 'importGoogleFormReducer'

// actions constants
export const IMPORT_GOOGLE_FORM_TEST = `[google form test] import test`
export const SET_IMPORT_GOOGLE_FORM_TEST_STATE = `[google form test] set state`

// actions
export const importGoogleFormTestAction = (payload) => ({
  type: IMPORT_GOOGLE_FORM_TEST,
  payload,
})

export const setImportGoogleFormTestStateAction = (payload) => ({
  type: SET_IMPORT_GOOGLE_FORM_TEST_STATE,
  payload,
})

// selectors
export const stateSelector = (state) => state?.[namespaceKey]

export const getImportGoogleFormTestSelector = createSelector(
  stateSelector,
  (state) => state || {}
)

// initial state
const initialState = {
  apiStatus: false,
  result: {},
  errorMessage: '',
}

// reducer
export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_IMPORT_GOOGLE_FORM_TEST_STATE:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}

// sagas
function* importGoogleFormTestSaga({ payload }) {
  const generalErrorMessage =
    'Apologies for the inconvenience. We encountered an issue while importing test from Google Form. Please try again'

  try {
    yield put(
      setImportGoogleFormTestStateAction({
        apiStatus: 'INITIATED',
        result: [],
        errorMessage: '',
      })
    )
    const { result } = yield call(testImportApi.importGoogleFormTest, payload)
    yield put(
      setImportGoogleFormTestStateAction({
        apiStatus: 'SUCCESS',
        result,
        errorMessage: '',
      })
    )
  } catch (err) {
    yield put(
      setImportGoogleFormTestStateAction({
        apiStatus: 'FAILED',
        result: [],
        errorMessage: err?.message || generalErrorMessage,
      })
    )
  }
}

export function* watcherSaga() {
  yield all([takeEvery(IMPORT_GOOGLE_FORM_TEST, importGoogleFormTestSaga)])
}
