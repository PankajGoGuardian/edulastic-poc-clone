import { createAction, createReducer } from 'redux-starter-kit';
import { schema } from 'normalizr';

// assignments schema
export const assignmentSchema = new schema.Entity(
  'assignments',
  {},
  { idAttribute: '_id' }
);

// types
export const SET_LOADING = '[studentAssignment] fetch assignments';
export const SET_ASSIGNMENTS = '[studentAssignment] set assignments';

// action dispatchers
export const setAssignmentsLoadingAction = createAction(SET_LOADING);
export const setAssignmentsAction = createAction(SET_ASSIGNMENTS);

// initial State
const initialState = {
  isLoading: false,
  byId: [],
  allIds: [],
  error: {},
  isStale: false
};

// reducers

// fetching assignments
const setLoading = (state) => {
  state.isLoading = true;
};

// load assignments to store
const setAssignments = (state, { payload }) => {
  state.byId = payload.assignmentObj;
  state.allIds = payload.allAssignments;
  state.isLoading = false;
};

export default createReducer(initialState, {
  [SET_LOADING]: setLoading,
  [SET_ASSIGNMENTS]: setAssignments
});
