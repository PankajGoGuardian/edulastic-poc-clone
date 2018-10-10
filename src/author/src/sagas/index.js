import answerSaga from './answer';
import itemsSaga from './items';
import itemDetailSaga from './itemDetail';
import testItemsSaga from './testItems';
import testItemSaga from './testItem';

const authorSagas = [answerSaga(), itemsSaga(), itemDetailSaga(), testItemsSaga(), testItemSaga()];

export default authorSagas;
