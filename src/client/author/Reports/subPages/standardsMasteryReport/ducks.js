import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../common/reportsRedux'

const SET_SMR_SETTINGS = '[SMR settings] get smr settings'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setSMRSettingsAction = createAction(SET_SMR_SETTINGS)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportSMRSettingsReducer

export const getReportsSMRSettings = createSelector(
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
    subject: '',
    grade: '',
    courseId: '',
    classId: '',
    groupId: '',
    testSubject: '',
    testGrade: '',
    assessmentTypes: '',
    testIds: '',
    curriculumId: '',
    standardGrade: '',
    profileId: '',
    domainIds: '',
  },
}

export const reportSMRSettingsReducer = createReducer(initialState, {
  [SET_SMR_SETTINGS]: (state, { payload }) => (state = { ...payload }),
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
