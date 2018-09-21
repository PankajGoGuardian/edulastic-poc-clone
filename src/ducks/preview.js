import { createSelector } from 'reselect';
import config from '../config';
import { getQuestionsListSelector } from './questionsOrderList';

const { appName } = config;

const initialState = {
  list: [], // array of indexes,
  previewTab: 'clear',
};

export const moduleName = 'preview';
export const UPDATE_LIST = `${appName}/${moduleName}/UPDATE_LIST`;
export const CHANGE_PREVIEW_TAB = `${appName}/${moduleName}/CHANGE_PREVIEW_TAB`;

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_LIST:
      return { ...state, list: payload.list };
    case CHANGE_PREVIEW_TAB:
      return { ...state, previewTab: payload.previewTab };

    default:
      return state;
  }
}

/**
|--------------------------------------------------
| Actions
|--------------------------------------------------
*/

export const updatePreviewListAction = list => ({
  type: UPDATE_LIST,
  payload: { list },
});

export const changePreviewTabAction = previewTab => ({
  type: CHANGE_PREVIEW_TAB,
  payload: { previewTab },
});

/**
|--------------------------------------------------
| Selectors
|--------------------------------------------------
*/

export const stateSelector = state => state[moduleName];
export const getPreviewIndexesListSelector = createSelector(stateSelector, state => state.list);
export const getPreviewListSelector = createSelector(
  stateSelector,
  getQuestionsListSelector,
  (state, questions) => state.list.map(val => questions[val]),
);
export const getPreivewTabSelector = createSelector(stateSelector, state => state.previewTab);
