import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../common/reportsRedux'

const SET_NAR_SETTINGS = '[NAR settings] set nar settings'
const SET_NAR_TAGS_DATA = '[NAR settings] set nar tags data'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setNARSettingsAction = createAction(SET_NAR_SETTINGS)
export const setNARTagsDataAction = createAction(SET_NAR_TAGS_DATA)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportNARSettingsReducer

export const getReportsNARSettings = createSelector(
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

export const reportNARSettingsReducer = createReducer(initialState, {
  [SET_NAR_TAGS_DATA]: (state, { payload }) => {
    state.tagsData = { ...payload }
  },
  [SET_NAR_SETTINGS]: (state, { payload }) => {
    state.requestFilters = payload.requestFilters
  },
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
