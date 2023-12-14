import { takeLatest, all, call, select, put } from 'redux-saga/effects'
import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { captureSentryException, notification } from '@edulastic/common'
import { reportsApi } from '@edulastic/api'
import { getUser, getUserOrgId } from '../src/selectors/user'
import { initTutorMeService } from './service'
import { setInterventionDataInUtaAction } from '../src/reducers/testActivity'
import { invokeTutorMeSDKtoAssignTutor } from './helper'

const reduxNamespaceKey = 'tutorMe'
const initialState = {
  isTutorMeServiceInitialized: false,
  isSessionRequestActive: false,
}

const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState,
  reducers: {
    tutorMeRequestSession: (state) => {
      state.isSessionRequestActive = true
    },
    tutorMeRequestSessionComplete: (state) => {
      state.isSessionRequestActive = false
    },
    setIsTutorMeServiceInitialized: (state, payload) => {
      state.isTutorMeServiceInitialized = payload
    },
  },
})

export const { actions, reducer } = slice

export { reduxNamespaceKey }

const stateSelector = (state) => state.tutorMeReducer

const isTutorMeServiceInitializedSelector = createSelector(
  stateSelector,
  (state) => state.isTutorMeServiceInitialized
)

export const tutorMeServiceInitializingSelector = createSelector(
  stateSelector,
  (state) => state.tutorMeServiceInitializing
)

export const isSessionRequestActiveSelector = createSelector(
  stateSelector,
  (state) => state.isSessionRequestActive
)

function* createTutorMeInterventionSaga(payload) {
  try {
    const intervention = yield call(reportsApi.createIntervention, payload)
    if (payload.testActivityId) {
      yield put(
        setInterventionDataInUtaAction({
          testActivityId: payload.testActivityId,
          intervention: [{ _id: intervention._id, type: intervention.type }],
        })
      )
    }
    notification({ type: 'success', msg: 'Tutoring Assigned Successfully' })
  } catch (err) {
    captureSentryException(err)
    notification({
      type: 'error',
      msg: 'Unable to assign tutoring to students',
    })
  }
}

function* initializeTutorMeServiceSaga() {
  try {
    const isTutorMeServiceInitialized = yield select(
      isTutorMeServiceInitializedSelector
    )
    if (!isTutorMeServiceInitialized) {
      const user = yield select(getUser)
      yield call(initTutorMeService, user)
      yield put(actions.setIsTutorMeServiceInitialized(true))
    }
  } catch (err) {
    captureSentryException(err)
    notification({ msg: 'Unable to initialize TutorMe SDK' })
    yield put(actions.setIsTutorMeServiceInitialized(false))
  }
}

function* tutorMeRequestSesssionSaga({ payload }) {
  try {
    yield* initializeTutorMeServiceSaga()
    const isTutorMeServiceInitialized = yield select(
      isTutorMeServiceInitializedSelector
    )
    if (!isTutorMeServiceInitialized) {
      return
    }
    const tutorMeInterventionResponse = yield call(
      invokeTutorMeSDKtoAssignTutor,
      payload
    )
    yield* createTutorMeInterventionSaga(tutorMeInterventionResponse)
  } finally {
    yield put(actions.tutorMeRequestSessionComplete())
  }
}

export function* watcherSaga() {
  yield all([
    takeLatest(actions.tutorMeRequestSession, tutorMeRequestSesssionSaga),
  ])
}

export const getIsTutorMeVisibleToDistrictSelector = createSelector(
  getUserOrgId,
  (districtId) => {
    const ASSIGN_TUTOR_DISABLED_DISTRICTS =
      process.env.REACT_APP_ASSIGN_TUTOR_DISABLED_DISTRICTS || []
    return !ASSIGN_TUTOR_DISABLED_DISTRICTS.includes(districtId)
  }
)
