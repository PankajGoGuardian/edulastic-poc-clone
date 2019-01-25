import { createAction, createReducer } from 'redux-starter-kit';
import { createSelector } from 'reselect';

// types
export const SET_TEST_ITEM = '[studentTestItem] set test item';
export const SET_CURRENT_ITEM = '[studentTestItem] set current item';

// actions
export const setTestItemsAction = createAction(SET_TEST_ITEM);
export const setCurrentItemAction = createAction(SET_CURRENT_ITEM);

// initial state
const initialState = {
  items: [],
  current: 0
};

// set test items
const setTestItems = (state, { payload }) => {
  let prev = state.items;
  state.items = payload;
};

// set current item
const setCurrentItem = (state, { payload }) => {
  state.current = payload;
};

// reducer
export default createReducer(initialState, {
  [SET_TEST_ITEM]: setTestItems,
  [SET_CURRENT_ITEM]: setCurrentItem
});

// get testITem questions
export const getTestItemQuestions = item => {
  let widgets = [];
  let questionList = [];
  if (item && item.rows) {
    item.rows.forEach(row => {
      widgets = [...widgets, ...row.widgets];
    });
    widgets.forEach(widget => {
      questionList = [...questionList, widget.entity];
    });
  }
  return questionList;
};
// selectors
const module = 'studentTestItems';
export const getCurrentItemSelector = state => state[module].current;
export const getItemCountSelector = state => state[module].items.length;
export const getItemsSelector = state => state[module].items;

export const getItemSelector = createSelector(
  getItemsSelector,
  getCurrentItemSelector,
  (items, current) => items[current]
);

export const getQuestionsSelector = createSelector(
  getItemSelector,
  item => getTestItemQuestions(item)
);
