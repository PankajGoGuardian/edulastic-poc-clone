import { combineReducers } from 'redux';

import assessmentReducers from './assessment/src/reducers';
import authorReducers from './author/src/reducers';
import studentReducers from './student/reducers';
import { LOGOUT } from './student/constants/actions';

const rootReducer = combineReducers({
  ...assessmentReducers,
  ...authorReducers,
  ...studentReducers
});

export default (state, action) =>
  (action.type === LOGOUT
    ? rootReducer(undefined, action)
    : rootReducer(state, action));
