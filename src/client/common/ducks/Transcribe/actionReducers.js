import { createSlice } from 'redux-starter-kit'
import { FAILED, GENERATED, NOT_STARTED } from './constants'

const reduxNamespaceKey = 'transcribe'

const initialState = {
  tempCredentials: {
    status: NOT_STARTED,
    data: {
      accessKeyId: '',
      secretAccessKey: '',
      sessionToken: '',
      expiration: '',
    },
  },
  activeTranscribeSessionId: null,
  currentToolBarId: null,
}

// TODO: cannot reset credentials always.
const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState: { ...initialState },
  reducers: {
    generateTempCredentials: (state, { payload }) => {
      state.currentToolBarId = payload.toolbarId
    },
    updateTempCredentialsAPIStatus: (state, { payload }) => {
      state.tempCredentials.status = payload
    },
    updateTempCredentials: (state, { payload }) => {
      state.tempCredentials.data = payload
      state.tempCredentials.status = GENERATED
    },
    failedToGeneratedCredentials: (state) => {
      state.tempCredentials.status = FAILED
      state.tempCredentials.data = initialState.tempCredentials.data
      state.activeTranscribeSessionId = null
    },
    updateActiveTranscribeSessionId: (state, { payload }) => {
      state.activeTranscribeSessionId = payload
    },
    stopTranscribeAndResetDataInStore: (state) => {
      state.tempCredentials.status = NOT_STARTED
      state.activeTranscribeSessionId = null
      state.currentToolBarId = null
    },
  },
})

const {
  generateTempCredentials,
  updateTempCredentials,
  failedToGeneratedCredentials,
  stopTranscribeAndResetDataInStore,
  updateActiveTranscribeSessionId,
  updateTempCredentialsAPIStatus,
} = slice.actions

export const actions = {
  generateTempCredentials,
  updateTempCredentials,
  failedToGeneratedCredentials,
  stopTranscribeAndResetDataInStore,
  updateActiveTranscribeSessionId,
  updateTempCredentialsAPIStatus,
}

export const { reducer } = slice

export { reduxNamespaceKey }
