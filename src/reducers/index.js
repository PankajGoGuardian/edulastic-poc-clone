import { combineReducers } from 'redux';

import questions from './questions';
import assessment from './assessment';

const rootReducer = combineReducers({
  questions,
  assessment
});

export default rootReducer;
