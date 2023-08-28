import { createSlice } from 'redux-starter-kit'
import { STATUS } from './constants'

const reduxNamespaceKey = 'aiTestDetails'

const initialState = {
  status: STATUS.INIT,
}

const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState: { ...initialState },
  reducers: {
    getAiGeneratedTestItems: (state) => {
      state.status = STATUS.INPROGRESS
    },
    regenerateAiTestItems: (state) => {
      state.status = STATUS.INPROGRESS
    },
    setStatus: (state, { payload }) => {
      state.status = payload
    },
    resetTestDetails: (state) => {
      state.status = STATUS.INIT
    },
  },
})

const {
  getAiGeneratedTestItems,
  setStatus,
  resetTestDetails,
  regenerateAiTestItems,
} = slice.actions

export const actions = {
  getAiGeneratedTestItems,
  setStatus,
  resetTestDetails,
  regenerateAiTestItems,
}

export const { reducer } = slice

export { reduxNamespaceKey }
