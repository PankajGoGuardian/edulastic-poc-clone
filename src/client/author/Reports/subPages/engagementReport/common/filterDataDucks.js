import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

import staticDropDownData from './static/staticDropDownData.json'

export const SET_FILTERS = '[reports] set er filters'
const SET_TEMP_TAGS_DATA = '[reports] set spr temp tags data'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setFiltersAction = createAction(SET_FILTERS)
export const setTempTagsDataAction = createAction(SET_TEMP_TAGS_DATA)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportERFilterDataReducer

export const getFiltersSelector = createSelector(
  stateSelector,
  (state) => state.filters
)

export const getTempTagsDataSelector = createSelector(
  stateSelector,
  (state) => state.tempTagsData
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  filters: {
    ...staticDropDownData.initialFilters,
  },
  tempTagsData: {},
}

export const reportERFilterDataReducer = createReducer(initialState, {
  [SET_FILTERS]: (state, { payload }) => {
    state.filters = payload
  },
  [SET_TEMP_TAGS_DATA]: (state, { payload }) => {
    state.tempTagsData = payload
  },
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
