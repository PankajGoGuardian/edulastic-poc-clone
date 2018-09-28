import answerSaga from './answer';
import questionSaga from './question';
import itemsSaga from './items';

const authorSagas = [answerSaga(), questionSaga(), itemsSaga()];

export default authorSagas;
