import questionSaga from './question';
import itemsSaga from './items';
import testSaga from './test';
import evaluationSaga from './evaluation';
import viewSaga from './view';

const assessmentSagas = [questionSaga(), itemsSaga(), testSaga(), evaluationSaga(), viewSaga()];

export default assessmentSagas;
