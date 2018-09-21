import { createSelector } from 'reselect';

import config from '../config';

const { appName } = config;

const initialState = {
  view: 'edit',
  showAnswers: false,
};

export const moduleName = 'view';
export const CHANGE_VIEW = `${appName}/${moduleName}/CHANGE_VIEW`;

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case CHANGE_VIEW:
      return { ...state, view: payload.view };

    default:
      return state;
  }
}

/**
|--------------------------------------------------
| Actions
|--------------------------------------------------
*/

export function changeViewAction(view) {
  return {
    type: CHANGE_VIEW,
    payload: { view },
  };
}

/**
|--------------------------------------------------
| Selectors
|--------------------------------------------------
*/

export const stateSelector = state => state[moduleName];

export const getViewSelector = createSelector(stateSelector, state => state.view);
