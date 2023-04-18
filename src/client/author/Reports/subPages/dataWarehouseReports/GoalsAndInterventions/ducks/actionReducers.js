import { createSlice } from 'redux-starter-kit'

const reduxNamespaceKey = 'reportDwGoalsAndInterventions'

const initialState = {
  form: {
    status: 'init',
    isSaving: false,
  },
  goals: {
    isLoading: false,
    list: [],
  },
  group: {
    isLoading: false,
    list: [],
  },
}

const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState: { ...initialState },
  reducers: {
    resetFormData: (state) => {
      state.form.status = 'init'
    },
    saveFormDataRequest: (state) => {
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
  },
})

const {
  saveFormDataRequest,
  saveFormDataComplete,
  getGoalsList,
  getGoalsListComplete,
  setGoalsList,
  resetFormData,
} = slice.actions

export const actions = {
  saveFormDataRequest,
  saveFormDataComplete,
  getGoalsList,
  getGoalsListComplete,
  setGoalsList,
  resetFormData,
}

export const { reducer } = slice

export { reduxNamespaceKey }
