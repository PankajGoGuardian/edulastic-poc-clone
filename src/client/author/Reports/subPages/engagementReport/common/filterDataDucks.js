import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

import staticDropDownData from './static/staticDropDownData.json'

const SET_FILTERS = '[reports] set er filters'
const SET_TAGS_DATA = '[reports] set spr tags data'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setFiltersAction = createAction(SET_FILTERS)
export const setTagsDataAction = createAction(SET_TAGS_DATA)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportERFilterDataReducer

export const getFiltersSelector = createSelector(
  stateSelector,
  (state) => state.filters
)

export const getTagsDataSelector = createSelector(
  stateSelector,
  (state) => state.tagsData
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  filters: {
    ...staticDropDownData.initialFilters,
  },
  tagsData: {},
}

export const reportERFilterDataReducer = createReducer(initialState, {
  [SET_FILTERS]: (state, { payload }) => {
    state.filters = payload
  },
  [SET_TAGS_DATA]: (state, { payload }) => {
    state.tagsData = payload
  },
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
