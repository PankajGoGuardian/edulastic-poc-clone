import itemsSaga from './items';
import itemDetailSaga from './itemDetail';
import testItemsSaga from './testItems';
import testItemSaga from './testItem';
import questionSaga from './question';
import testsSaga from './tests';

const authorSagas = [
  itemsSaga(),
  itemDetailSaga(),
  testItemsSaga(),
  testItemSaga(),
  questionSaga(),
  testsSaga(),
];

export default authorSagas;
