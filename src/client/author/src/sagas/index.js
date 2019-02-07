import itemsSaga from './items';
import itemDetailSaga from './itemDetail';
import testItemsSaga from './testItems';
import testItemSaga from './testItem';
import questionSaga from './question';
import testsSaga from './tests';
import dictionariesSaga from './dictionaries';
import assignmentSaga from './assignment';
import { classBoardSaga } from '../ClassBoard';
import { testsListSaga } from '../../TestList';
import groupSaga from './group';
import assignmentsSaga from './assignments';

const authorSagas = [
  itemsSaga(),
  itemDetailSaga(),
  testItemsSaga(),
  testItemSaga(),
  questionSaga(),
  testsSaga(),
  dictionariesSaga(),
  assignmentSaga(),
  classBoardSaga(),
  groupSaga(),
  assignmentsSaga(),
	testsListSaga()
];

export default authorSagas;
