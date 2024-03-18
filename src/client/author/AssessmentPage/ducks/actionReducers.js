import { createSlice } from 'redux-starter-kit'

const reduxNamespaceKey = 'assessmentPageReducer'

const initialState = {
  isVideoEnded: {},
}

const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState: { ...initialState },
  reducers: {
    setIsVideoEnded: (state, { payload }) => {
      if (payload) {
        state.isVideoEnded[payload] = true
      }
    },
  },
})

const { setIsVideoEnded } = slice.actions

export const actions = { setIsVideoEnded }

export const { reducer } = slice

export { reduxNamespaceKey }
