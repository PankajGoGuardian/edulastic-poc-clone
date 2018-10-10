import answerSaga from './answer';
import itemsSaga from './items';
import itemDetailSaga from './itemDetail';
import testItemsSaga from './testItems';
import testItemSaga from './testItem';
import questionsSaga from './questions';

const authorSagas = [
  answerSaga(),
  itemsSaga(),
  itemDetailSaga(),
  testItemsSaga(),
  testItemSaga(),
  questionsSaga(),
];

export default authorSagas;
