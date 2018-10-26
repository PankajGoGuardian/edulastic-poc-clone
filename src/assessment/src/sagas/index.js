import questionSaga from './question';
import itemsSaga from './items';
import testSaga from './test';
import evaluationSaga from './evaluation';

const assessmentSagas = [
  questionSaga(),
  itemsSaga(),
  testSaga(),
  evaluationSaga()
];

export default assessmentSagas;
