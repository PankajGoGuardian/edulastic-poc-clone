import { combineReducers } from 'redux';

import questions from './questions';
import assessment from './assessment';
import view from './view';
import preview from './preview';
import questionsOrderList from './questionsOrderList';
import items from './items';

const rootReducer = combineReducers({
  questions,
  assessment,
  questionsOrderList,
  view,
  preview,
  items,
});

export default rootReducer;
