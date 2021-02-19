import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../common/reportsRedux'

const SET_ER_SETTINGS = '[SAR settings] get er settings'
const RESET_ER_SETTINGS = '[SAR settings] reset er settings'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setERSettingsAction = createAction(SET_ER_SETTINGS)
export const resetERSettingsAction = createAction(RESET_ER_SETTINGS)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportERSettingsReducer

export const getReportsERSettings = createSelector(
  stateSelector,
  (state) => state
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  requestFilters: {
    reportId: '',
    termId: '',
    schoolIds: '',
    teacherIds: '',
    grade: '',
    subject: '',
    assessmentTypes: '',
  },
}

export const reportERSettingsReducer = createReducer(initialState, {
  [SET_ER_SETTINGS]: (state, { payload }) => (state = { ...payload }),
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
