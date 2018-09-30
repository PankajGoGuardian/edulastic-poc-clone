import { combineReducers } from 'redux';

import assessmentReducers from './assessment/src/reducers';
import authorReducers from './author/src/reducers';
import studentReducers from './student/src/reducers';

const rootReducer = combineReducers({
  ...assessmentReducers,
  ...authorReducers,
  ...studentReducers,
});

export default rootReducer;
