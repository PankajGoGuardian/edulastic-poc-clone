import { createSlice } from 'redux-starter-kit'
import { STATUS, formFields } from './constants'

const reduxNamespaceKey = 'aiTestDetails'

const initialState = {
  status: STATUS.DRAFT,
  aiGeneratedTestItems: [],
  testDetails: {
    [formFields.testName]: '',
    [formFields.itemTypes]: [],
    [formFields.numberOfItems]: 0,
    [formFields.difficulty]: [],
    [formFields.dok]: [],
    [formFields.description]: '',
  },
}

const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState: { ...initialState },
  reducers: {
    setTestDetails: (state, { payload }) => {
      state.testDetails = payload
    },
    resetTestDetails: (state) => {
      state.testDetails = initialState.testDetails
    },
    getAiGeneratedTestItems: (state) => {
      state.status = STATUS.INPROGRESS
    },
    setAiGeneratedTestItems: (state, { payload }) => {
      state.aiGeneratedTestItems = payload
    },
    resetAiGeneratedTestItems: (state) => {
      state.aiGeneratedTestItems = []
    },
    setStatus: (state, { payload }) => {
      state.status = { payload }
    },
  },
})

const {
  getAiGeneratedTestItems,
  setTestDetails,
  resetTestDetails,
  setAiGeneratedTestItems,
  resetAiGeneratedTestItems,
  setStatus,
} = slice.actions

export const actions = {
  getAiGeneratedTestItems,
  setTestDetails,
  resetTestDetails,
  setAiGeneratedTestItems,
  resetAiGeneratedTestItems,
  setStatus,
}

export const { reducer } = slice

export { reduxNamespaceKey }
