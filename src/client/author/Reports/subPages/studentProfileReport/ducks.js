import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../common/reportsRedux'

const SET_SPR_SETTINGS = '[SPR settings] set spr settings'
const SET_SPR_TAGS_DATA = '[SPR settings] set spr tags data'

export const setSPRSettingsAction = createAction(SET_SPR_SETTINGS)
export const setSPRTagsDataAction = createAction(SET_SPR_TAGS_DATA)

export const stateSelector = (state) =>
  state.reportReducer.reportSPRSettingsReducer

export const getReportsSPRSettings = createSelector(
  stateSelector,
  (state) => state
)

const initialState = {
  selectedStudent: { key: '', title: '' },
  requestFilters: {
    termId: '',
    reportId: '',
    courseId: '',
    grade: '',
    subject: '',
    performanceBandProfileId: '',
    standardsProficiencyProfileId: '',
    assignedBy: 'anyone',
  },
  standardFilters: {
    domainIds: '',
    standardIds: '',
  },
  tagsData: {},
}

export const reportSPRSettingsReducer = createReducer(initialState, {
  [SET_SPR_TAGS_DATA]: (state, { payload }) => {
    state.tagsData = { ...payload }
  },
  [SET_SPR_SETTINGS]: (state, { payload }) => {
    state.selectedStudent = payload.selectedStudent
    state.requestFilters = payload.requestFilters
    state.standardFilters = payload.standardFilters
  },
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
})
