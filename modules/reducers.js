import { combineReducers } from 'redux';

import questions from './author/src/reducers/questions';
import view from './author/src/reducers/view';
import preview from './author/src/reducers/preview';
import questionsOrderList from './author/src/reducers/questionsOrderList';
import items from './author/src/reducers/items';
import assessment from './student/src/reducers/assessment';
import studentQuestions from './student/src/reducers/questions';

const rootReducer = combineReducers({
  questions,
  assessment,
  questionsOrderList,
  view,
  preview,
  items,
  studentQuestions,
});

export default rootReducer;
