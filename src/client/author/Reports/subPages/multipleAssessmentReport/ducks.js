import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../common/reportsRedux'

const SET_MAR_SETTINGS = '[MAR settings] set mar settings'
const SET_MAR_TAGS_DATA = '[MAR settings] set mar tags data'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setMARSettingsAction = createAction(SET_MAR_SETTINGS)
export const setMARTagsDataAction = createAction(SET_MAR_TAGS_DATA)

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
  requestFilters: {
    reportId: '',
    termId: '',
    testSubjects: '',
    testGrades: '',
    assessmentTypes: '',
    tagIds: '',
    testIds: '',
    schoolIds: '',
    teacherIds: '',
    subjects: '',
    grades: '',
    courseId: '',
    classIds: '',
    groupIds: '',
    assignedBy: 'anyone',
    preTestId: '',
    postTestId: '',
    selectedCompareBy: {},
  },
  tagsData: {},
}

export const reportMARSettingsReducer = createReducer(initialState, {
  [SET_MAR_TAGS_DATA]: (state, { payload }) => {
    state.tagsData = { ...payload }
  },
  [SET_MAR_SETTINGS]: (state, { payload }) => {
    state.requestFilters = payload.requestFilters
  },
  [RESET_ALL_REPORTS]: () => initialState,
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
