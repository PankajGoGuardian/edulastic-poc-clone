import { createSlice } from 'redux-starter-kit'

const reduxNamespaceKey = 'reportDwGoalsAndInterventions'

const initialState = {
  form: {
    isSaving: false,
  },
}

const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState: { ...initialState },
  reducers: {
    saveFormDataRequest: (state) => {
      state.form.isSaving = true
    },
    saveFormDataComplete: (state) => {
      state.form.isSaving = false
    },
  },
})

const { saveFormDataRequest, saveFormDataComplete } = slice.actions

export const actions = {
  saveFormDataRequest,
  saveFormDataComplete,
}

export const { reducer } = slice

export { reduxNamespaceKey }
