import itemsSaga from './items';
import itemDetailSaga from './itemDetail';
import testItemSaga from './testItem';
import questionSaga from './question';
import dictionariesSaga from './dictionaries';
import { classBoardSaga } from '../../ClassBoard';
import { classResponsesSaga } from '../../ClassResponses';
import { testsListSaga } from '../../TestList';
import { testPageSaga } from '../../TestPage';
import { testsAddItemsSaga } from '../../TestPage/components/AddItems';
import { testsAssignSaga } from '../../TestPage/components/Assign';
import assignmentsSaga from './assignments';

const authorSagas = [
  itemsSaga(),
  itemDetailSaga(),
  testItemSaga(),
  questionSaga(),
  dictionariesSaga(),
  classBoardSaga(),
  assignmentsSaga(),
  classResponsesSaga(),
  testsListSaga(),
  testPageSaga(),
  testsAddItemsSaga(),
  testsAssignSaga()
];

export default authorSagas;
