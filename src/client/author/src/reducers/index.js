import authorUi from './authorUi';
import view from './view';
import items from './items';
import preview from './preview';
import question from './question';
import testItem from './testItem';
import itemDetail from './itemDetail';
import dictionaries from './dictionaries';
import author_assignments from './assignments';
import author_classboard_gradebook from './gradeBook';
import author_classboard_testActivity from './testActivity';
import classResponse from './classResponse';
import studentResponse from './studentResponse';
import feedbackResponse from './feedbackResponse';
import { testList } from '../../TestList';
import { tests } from '../../TestPage';
import { testsAddItems } from '../../TestPage/components/AddItems';
import { testsAssign } from '../../TestPage/components/Assign';

const authorReducers = {
  authorUi,
  view,
  items,
  testsAddItems,
  testsAssign,
  preview,
  question,
  testItem,
  itemDetail,
  dictionaries,
  author_assignments,
  author_classboard_gradebook,
  author_classboard_testActivity,
  classResponse,
  studentResponse,
  feedbackResponse,
  tests,
  testList
};

export default authorReducers;
