import itemsSaga from './items';
import itemDetailSaga from './itemDetail';
import testItemsSaga from './testItems';
import testItemSaga from './testItem';
import questionSaga from './question';
import testsSaga from './tests';
import dictionariesSaga from './dictionaries';
import assignmentSaga from './assignment';
import groupSaga from './group';

const authorSagas = [
  itemsSaga(),
  itemDetailSaga(),
  testItemsSaga(),
  testItemSaga(),
  questionSaga(),
  testsSaga(),
  dictionariesSaga(),
  assignmentSaga(),
  groupSaga(),
];

export default authorSagas;
