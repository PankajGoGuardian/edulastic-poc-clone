import { combineReducers } from 'redux';

import questions from './questions';
import assessment from './assessment';

import questionsOrderList, { moduleName as questionsOrderListModule } from '../ducks/questionsOrderList';
import view, { moduleName as viewModule } from '../ducks/view';
import preview, { moduleName as previewModule } from '../ducks/preview';

const rootReducer = combineReducers({
  questions,
  assessment,
  [questionsOrderListModule]: questionsOrderList,
  [viewModule]: view,
  [previewModule]: preview,
});

export default rootReducer;
