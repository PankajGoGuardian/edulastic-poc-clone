import { takeLatest, all, call, select, put } from 'redux-saga/effects'
import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { captureSentryException, notification } from '@edulastic/common'
import { reportsApi, tutorMeApi } from '@edulastic/api'
import { getUser, getUserOrgId } from '../src/selectors/user'
import { initTutorMeService } from './service'
import { setInterventionDataInUtaAction } from '../src/reducers/testActivity'
import { invokeTutorMeSDKtoAssignTutor } from './helper'

const reduxNamespaceKey = 'tutorMe'
const initialState = {
  isSessionRequestActive: false,
  isTutorMeModalOpen: false,
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
    setIsTutorMeModalOpen: (state, { payload }) => {
      state.isTutorMeModalOpen = payload
    },
  },
})

export const { actions, reducer } = slice

export { reduxNamespaceKey }

const stateSelector = (state) => state.tutorMeReducer

export const tutorMeServiceInitializingSelector = createSelector(
  stateSelector,
  (state) => state.tutorMeServiceInitializing
)

export const isSessionRequestActiveSelector = createSelector(
  stateSelector,
  (state) => state.isSessionRequestActive
)

const isTutorMeModalOpenSelector = createSelector(
  stateSelector,
  (state) => state.isTutorMeModalOpen
)

export const isTutorMeModalLoadingSelector = createSelector(
  isSessionRequestActiveSelector,
  isTutorMeModalOpenSelector,
  (isSessionRequestActive, isTutorMeModalOpen) =>
    isSessionRequestActive && !isTutorMeModalOpen
)

function* createTutorMeInterventionSaga(payload) {
  try {
    const intervention = yield call(reportsApi.createIntervention, payload)
    if (payload.testActivityId) {
      yield put(
        setInterventionDataInUtaAction({
          testActivityId: payload.testActivityId,
          intervention: { _id: intervention._id, type: intervention.type },
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

function* initializeTutorMeServiceSaga(student) {
  try {
    const authCredentials = yield call(tutorMeApi.authorizeTutorme)
    const user = yield select(getUser)
    yield call(initTutorMeService, [student], authCredentials, user)
  } catch (err) {
    captureSentryException(err)
    notification({ msg: 'Authentication failed. Please contact support.' })
  }
}

function* tutorMeRequestSesssionSaga({ payload }) {
  try {
    const [, tutorMeStandards] = yield all([
      call(initializeTutorMeServiceSaga, payload.student),
      call(tutorMeApi.getTutorMeStandards, {
        standardIds: payload.standardsMasteryData
          .map(({ standardId }) => standardId)
          .filter(Boolean)
          .join(','),
      }),
    ])
    yield put(actions.setIsTutorMeModalOpen(true))
    const tutorMeInterventionResponse = yield call(
      invokeTutorMeSDKtoAssignTutor,
      {
        ...payload,
        tutorMeStandards,
      }
    )
    yield put(actions.setIsTutorMeModalOpen(false))
    if (tutorMeInterventionResponse) {
      yield* createTutorMeInterventionSaga(tutorMeInterventionResponse)
    }
  } finally {
    yield put(actions.setIsTutorMeModalOpen(false))
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
