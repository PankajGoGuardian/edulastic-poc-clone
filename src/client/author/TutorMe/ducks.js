import {
  takeEvery,
  takeLatest,
  all,
  call,
  select,
  put,
} from 'redux-saga/effects'
import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { captureSentryException, notification } from '@edulastic/common'
import { reportsApi } from '@edulastic/api'
import { getUser, getUserOrgId } from '../src/selectors/user'
import { actions as GIActions } from '../Reports/subPages/dataWarehouseReports/GoalsAndInterventions/ducks/actionReducers'
import { initTutorMeService } from './service'

const reduxNamespaceKey = 'tutorMe'
const initialState = {
  assigning: false,
  tutorMeServiceInitializing: false,
  isTutorMeServiceInitialized: false,
}

const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState,
  reducers: {
    initializeTutorMeService: (state) => {
      state.tutorMeServiceInitializing = true
    },
    setIsTutorMeServiceInitialized: (state, payload) => {
      state.isTutorMeServiceInitialized = payload
      state.tutorMeServiceInitializing = false
    },
    assignTutorRequest: (state) => {
      state.assigning = true
    },
    assignTutorSuccess: (state) => {
      state.assigning = false
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

function* assignTutorForStudentsSaga({ payload }) {
  try {
    const intervention = yield call(reportsApi.createIntervention, payload)
    yield put(GIActions.setIntervention(intervention))
    yield put(actions.assignTutorSuccess())
    notification({ type: 'success', msg: 'Tutoring Assigned Successfully' })
  } catch (err) {
    captureSentryException(err)
    notification({
      type: 'error',
      msg: 'Unable to assign tutoring to students',
    })
  }
}

function* initializeTutorMeServiceSaga({ payload: { callback } }) {
  try {
    const isTutorMeServiceInitialized = yield select(
      isTutorMeServiceInitializedSelector
    )
    if (!isTutorMeServiceInitialized) {
      const user = yield select(getUser)
      yield call(initTutorMeService, user)
      yield put(actions.setIsTutorMeServiceInitialized(true))
    }
    yield call(callback)
  } catch (err) {
    captureSentryException(err)
    notification({ msg: 'Unable to initialize TutorMe SDK' })
    yield put(actions.setIsTutorMeServiceInitialized(false))
  }
}

export function* watcherSaga() {
  yield all([
    takeEvery(actions.assignTutorRequest, assignTutorForStudentsSaga),
    takeLatest(actions.initializeTutorMeService, initializeTutorMeServiceSaga),
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
