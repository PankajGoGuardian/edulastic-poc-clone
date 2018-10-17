import questionSaga from './question';
import itemsSaga from './items';
import testSaga from './test';
const assessmentSagas = [questionSaga(), itemsSaga(), testSaga()];

export default assessmentSagas;
