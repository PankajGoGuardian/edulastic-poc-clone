import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const SET_FILTERS = '[reports] set er filters'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setFiltersAction = createAction(SET_FILTERS)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportERFilterDataReducer

export const getFiltersSelector = createSelector(
  stateSelector,
  (state) => state.filters
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  prevERFilterData: null,
  ERFilterData: {},
  filters: {
    reportId: '',
    termId: '',
    schoolIds: '',
    teacherIds: '',
    grade: 'All',
    subject: 'All',
    assessmentTypes: '',
  },
  loading: false,
}

export const reportERFilterDataReducer = createReducer(initialState, {
  [SET_FILTERS]: (state, { payload }) => {
    state.filters = payload
  },
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
