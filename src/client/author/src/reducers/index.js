import authorUi from './authorUi';
import view from './view';
import group from './group';
import items from './items';
import tests from './tests';
import preview from './preview';
import question from './question';
import testItem from './testItem';
import testItems from './testItems';
import itemDetail from './itemDetail';
import dictionaries from './dictionaries';
import author_assignments from './assignments';
import author_classboard_gradebook from './gradeBook';
import author_classboard_testActivity from './testActivity';
import { testList } from '../../TestList';

const authorReducers = {
  authorUi,
  view,
  items,
  tests,
  group,
  preview,
  question,
  testItem,
  testItems,
  itemDetail,
  dictionaries,
  author_assignments,
  author_classboard_gradebook,
  author_classboard_testActivity,
  testList
};

export default authorReducers;
