import answerSaga from './answer';
import questionSaga from './question';
import itemsSaga from './items';
import itemDetailSaga from './itemDetail';

const authorSagas = [answerSaga(), questionSaga(), itemsSaga(), itemDetailSaga()];

export default authorSagas;
