import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../common/reportsRedux'

const SET_MAR_SETTINGS = '[MAR settings] get mar settings'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setMARSettingsAction = createAction(SET_MAR_SETTINGS)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportMARSettingsReducer

export const getReportsMARSettings = createSelector(
  stateSelector,
  (state) => state
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  selectedTest: [{ key: '', title: '' }],
  requestFilters: {
    termId: '',
    subject: '',
    grade: '',
    courseId: '',
    groupId: '',
    schoolId: '',
    teacherId: '',
    assessmentType: '',
    testIds: '',
  },
}

export const reportMARSettingsReducer = createReducer(initialState, {
  [SET_MAR_SETTINGS]: (state, { payload }) => (state = { ...payload }),
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
