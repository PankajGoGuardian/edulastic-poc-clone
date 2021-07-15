import { all } from 'redux-saga/effects'
import { combineReducers } from 'redux-starter-kit'

import uploadAnswerSheetsSaga, {
  reducer as uploadAnswerSheetsReducer,
} from './uploadAnswerSheets/ducks'

export const scanStoreReducer = combineReducers({
  uploadAnswerSheets: uploadAnswerSheetsReducer,
})

export default function* watcherSaga() {
  yield all([uploadAnswerSheetsSaga()])
}
