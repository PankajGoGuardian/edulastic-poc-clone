import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../common/reportsRedux'

const SET_SMR_SETTINGS = '[SMR settings] set smr settings'
const SET_SMR_TAGS_DATA = '[SMR settings] set smr tags data'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setSMRSettingsAction = createAction(SET_SMR_SETTINGS)
export const setSMRTagsDataAction = createAction(SET_SMR_TAGS_DATA)

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
    classIds: '',
    groupIds: '',
    testSubject: '',
    testGrade: '',
    assessmentTypes: '',
    tagIds: '',
    testIds: '',
    curriculumId: '',
    standardGrade: '',
    profileId: '',
    domainIds: '',
    assignedBy: 'anyone',
  },
  tagsData: {},
}

export const reportSMRSettingsReducer = createReducer(initialState, {
  [SET_SMR_TAGS_DATA]: (state, { payload }) => {
    state.tagsData = { ...payload }
  },
  [SET_SMR_SETTINGS]: (state, { payload }) => {
    state.requestFilters = payload.requestFilters
  },
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
