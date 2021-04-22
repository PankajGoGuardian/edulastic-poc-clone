import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../common/reportsRedux'

const SET_ER_SETTINGS = '[ER settings] set er settings'
const SET_ER_TAGS_DATA = '[ER settings] set er tags data'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setERSettingsAction = createAction(SET_ER_SETTINGS)
export const setERTagsDataAction = createAction(SET_ER_TAGS_DATA)

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
  tagsData: {},
}

export const reportERSettingsReducer = createReducer(initialState, {
  [SET_ER_TAGS_DATA]: (state, { payload }) => {
    state.tagsData = { ...payload }
  },
  [SET_ER_SETTINGS]: (state, { payload }) => {
    state.requestFilters = payload.requestFilters
  },
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
