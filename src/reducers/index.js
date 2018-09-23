import { combineReducers } from 'redux';

import questions from './questions';
import assessment from './assessment';
import view from './view';
import preview from './preview';
import questionsOrderList from './questionsOrderList';

const rootReducer = combineReducers({
  questions,
  assessment,
  questionsOrderList,
  view,
  preview,
});

export default rootReducer;
