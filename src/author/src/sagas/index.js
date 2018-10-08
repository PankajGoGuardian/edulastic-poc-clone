import answerSaga from './answer';
import itemsSaga from './items';
import itemDetailSaga from './itemDetail';

const authorSagas = [answerSaga(), itemsSaga(), itemDetailSaga()];

export default authorSagas;
