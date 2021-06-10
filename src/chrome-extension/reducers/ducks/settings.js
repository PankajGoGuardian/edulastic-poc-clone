export const updateSettingsAction = (payload) => ({
  type: 'UPDATE_SETTINGS',
  payload,
})

export const setBroadcastModalAction = (payload) => ({
  type: 'TOGGLE_BROADCAST_MODAL',
  payload,
})

export const setAuthModalAction = (payload) => ({
  type: 'SET_AUTH_MODAL',
  payload,
})

const iniialState = {
  notifications: false,
  muteAll: false,
  engagementTracking: true,
  isBroadcastModalVisible: false,
  isAuthModal: false,
}

const settingsReducer = (state = { ...iniialState }, { type, payload }) => {
  switch (type) {
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        ...payload,
      }

    case 'SET_AUTH_MODAL':
      return {
        ...state,
        classData: payload,
      }

    case 'TOGGLE_BROADCAST_MODAL':
      return {
        ...state,
        isBroadcastModalVisible: payload,
      }

    default:
      return state
  }
}

export default settingsReducer
