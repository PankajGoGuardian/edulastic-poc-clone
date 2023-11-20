import { createSlice } from 'redux-starter-kit'
import {
  ADVANCED_SEARCH_DATA,
  ADVANCED_SEARCH_DETAILS,
  INITIAL_STATE_ADV_SEARCH,
  fieldKey,
} from './constants'
import {
  resetAdvancedSearchDetailsHelper,
  setAdvanceSearchDataHelper,
  setAdvancedSearchDetailsHelper,
  setAdvancedSearchQueryHelper,
  setGroupDetailsHelper,
} from './helpers'

const reduxNamespaceKey = 'reportDwGoalsAndInterventions'

const initialState = {
  form: {
    status: 'init',
    isSaving: false,
  },
  goals: {
    isLoading: false,
    list: [],
    interventions: null,
  },
  interventions: {
    isLoading: false,
    list: [],
  },
  attendanceBand: {
    isLoading: false,
    list: [],
  },
}

const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState: { ...initialState, ...INITIAL_STATE_ADV_SEARCH },
  reducers: {
    resetFormData: (state) => {
      state.form.status = 'init'
    },
    saveFormDataRequest: (state) => {
      state.form.isSaving = true
    },
    updateGIDataRequest: (state) => {
      state.form.isSaving = true
    },
    saveFormDataComplete: (state) => {
      state.form.isSaving = false
      state.form.status = 'finished'
    },
    getGoalsList: (state) => {
      state.goals.isLoading = true
    },
    getGoalsListComplete: (state) => {
      state.goals.isLoading = false
    },
    setGoalsList: (state, { payload }) => {
      state.goals.list = payload
    },
    setRelatedInterventions: (state, { payload }) => {
      state.goals.interventions = { ...state.goals.interventions, ...payload }
    },
    getInterventionsList: (state) => {
      state.interventions.isLoading = true
    },
    getInterventionsListComplete: (state) => {
      state.interventions.isLoading = false
    },
    setInterventionsList: (state, { payload }) => {
      state.interventions.list = payload
    },
    setIntervention: (state, { payload }) => {
      state.interventions.list = [...state.interventions.list, payload]
    },

    getAttendanceBandList: (state) => {
      state.attendanceBand.isLoading = true
    },
    getAttendanceBandListComplete: (state) => {
      state.attendanceBand.isLoading = false
    },
    setAttendanceBandList: (state, { payload }) => {
      state.attendanceBand.list = payload
    },
    getAdvancedSearchClasses: (state) => {
      state[ADVANCED_SEARCH_DETAILS][fieldKey.classes].isLoading = true
    },
    getAdvancedSearchGroups: (state) => {
      state[ADVANCED_SEARCH_DETAILS][fieldKey.groups].isLoading = true
    },
    getAdvancedSearchSchools: (state) => {
      state[ADVANCED_SEARCH_DETAILS][fieldKey.schools].isLoading = true
    },
    getAdvancedSearchCourses: (state) => {
      state[ADVANCED_SEARCH_DETAILS][fieldKey.courses].isLoading = true
    },
    getAdvancedSearchAttendanceBands: (state) => {
      state[ADVANCED_SEARCH_DETAILS][fieldKey.attendanceBands].isLoading = true
    },
    getAdvancedSearchData: (state) => {
      state[ADVANCED_SEARCH_DATA].isLoading = true
    },
    setOnGroupEditIsLoading: (state, { payload }) => {
      state[ADVANCED_SEARCH_DATA].isLoadingOnGroupEdit = payload
    },
    resetGroupStatus: (state) => {
      state.group.status = 'init'
      state.advancedSearchData.data = []
    },
    resetAdvancedSearchData: (state) => {
      state.advancedSearchData.data = []
      state.advancedSearchData.isLoading = false
    },
    saveGroup: (state) => {
      state.group.isLoading = true
    },
    setAdvancedSearchDataComplete: setAdvanceSearchDataHelper,
    setAdvancedSearchDetails: setAdvancedSearchDetailsHelper,
    setAdvancedSearchQuery: setAdvancedSearchQueryHelper,
    saveGroupComplete: setGroupDetailsHelper,
    resetAdvancedSearchDetails: resetAdvancedSearchDetailsHelper,
    deleteGI: () => {},
    deleteGroup: () => {},
  },
})

const {
  saveFormDataRequest,
  saveFormDataComplete,
  getGoalsList,
  getGoalsListComplete,
  setGoalsList,
  getInterventionsList,
  getInterventionsListComplete,
  setInterventionsList,
  setIntervention,
  resetFormData,
  getAttendanceBandList,
  getAttendanceBandListComplete,
  setAttendanceBandList,
  setRelatedInterventions,
  getAdvancedSearchClasses,
  getAdvancedSearchGroups,
  getAdvancedSearchSchools,
  getAdvancedSearchCourses,
  getAdvancedSearchAttendanceBands,
  getAdvancedSearchData,
  saveGroup,
  setAdvancedSearchDetails,
  setAdvancedSearchQuery,
  setAdvancedSearchDataComplete,
  resetGroupStatus,
  saveGroupComplete,
  resetAdvancedSearchData,
  resetAdvancedSearchDetails,
  deleteGI,
  updateGIDataRequest,
  deleteGroup,
  setOnGroupEditIsLoading,
} = slice.actions

export const actions = {
  saveFormDataRequest,
  saveFormDataComplete,
  getGoalsList,
  getGoalsListComplete,
  setGoalsList,
  getInterventionsList,
  getInterventionsListComplete,
  setInterventionsList,
  setIntervention,
  resetFormData,
  getAttendanceBandList,
  getAttendanceBandListComplete,
  setAttendanceBandList,
  setRelatedInterventions,
  getAdvancedSearchClasses,
  getAdvancedSearchGroups,
  getAdvancedSearchSchools,
  getAdvancedSearchCourses,
  getAdvancedSearchAttendanceBands,
  getAdvancedSearchData,
  saveGroup,
  setAdvancedSearchDetails,
  setAdvancedSearchQuery,
  setAdvancedSearchDataComplete,
  resetGroupStatus,
  saveGroupComplete,
  resetAdvancedSearchData,
  resetAdvancedSearchDetails,
  deleteGI,
  updateGIDataRequest,
  deleteGroup,
  setOnGroupEditIsLoading,
}

export const { reducer } = slice

export { reduxNamespaceKey }
