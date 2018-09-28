import { all } from 'redux-saga/effects';

import { questionSaga, answerSaga } from './student/src/sagas';
import authorSagas from './author/src/sagas';

export default function* () {
  yield all([questionSaga(), answerSaga(), ...authorSagas]);
}
