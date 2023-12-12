import { takeEvery, all, call, select, put } from 'redux-saga/effects'
import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { captureSentryException, notification } from '@edulastic/common'
import { reportsApi } from '@edulastic/api'
import { getUser, getUserOrgId } from '../src/selectors/user'
import { actions as GIActions } from '../Reports/subPages/dataWarehouseReports/GoalsAndInterventions/ducks/actionReducers'
import { initTutorMeService } from './service'
import { setInterventionDataInUtaAction } from '../src/reducers/testActivity'

const reduxNamespaceKey = 'tutorMe'
const initialState = {
  assigning: false,
  isTutorMeServiceInitialized: false,
  // TODO: un-used state, to be rethought once SDK is provided
  // tutorMeStandardsDetails: {
  //   // tutorMeSubject, tutorMeSubjectArea, tutorMeGrade
  // },
}

const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState,
  reducers: {
    initializeTutorMeService: () => {
      // no state change required
    },
    setIsTutorMeServiceInitialized: (state, payload) => {
      state.isTutorMeServiceInitialized = payload
    },
    assignTutorRequest: (state) => {
      state.assigning = true
    },
    assignTutorSuccess: (state) => {
      state.assigning = false
    },
    // TODO: un-used action, to be rethough once SDK is done
    // getTutorMeStandardsDetails: (state) => {
    //   state.tutorMeStandardsDetails
    // },
  },
})

export const { actions, reducer } = slice

export { reduxNamespaceKey }

const stateSelector = (state) => state.tutorMeReducer

const isTutorMeServiceInitializedSelector = createSelector(
  stateSelector,
  (state) => state.isTutorMeServiceInitialized
)

function* assignTutorForStudentsSaga({ payload }) {
  try {
    const intervention = yield call(reportsApi.createIntervention, payload)
    yield put(GIActions.setIntervention(intervention))
    if (payload.testActivityId) {
      yield put(
        setInterventionDataInUtaAction({
          testActivityId: payload.testActivityId,
          intervention: [{ _id: intervention._id, type: intervention.type }],
        })
      )
    }
    yield put(actions.assignTutorSucces())
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

// TODO: un-used saga, to be rethought once SDK is done
// function* getTutorMeStandardsDetailsSaga({ payload }) {
//   try {
//     const tutorMeStandardsDetails = yield call(
//       tutorMeApi.getTutorMeStandards,
//       payload
//     )
//     yield put(actions.tutorMeStandardsDetails, { tutorMeStandardsDetails })
//     notification({
//       type: 'success',
//       msg: 'TutorMe standards fetched successfully',
//     })
//   } catch (err) {
//     captureSentryException(err)
//     notification({
//       type: 'error',
//       msg: 'Unable to fetch tutorMe standards',
//     })
//   }
// }

export function* watcherSaga() {
  yield all([
    takeEvery(actions.assignTutorRequest, assignTutorForStudentsSaga),
    takeEvery(actions.initializeTutorMeService, initializeTutorMeServiceSaga),
    // takeLatest(
    //   actions.getTutorMeStandardsDetails,
    //   getTutorMeStandardsDetailsSaga
    // ),
  ])
}

// TODO: un-used selectors, to be rethough once SDK is done
// const stateSelector = (state) => state.tutorMeReducer

// export const getTutorMeStandardsDetailsSelector = createSelector(
//   stateSelector,
//   (state) => state.tutorMeStandardsDetails
// )

export const getIsTutorMeVisibleToDistrictSelector = createSelector(
  getUserOrgId,
  (districtId) => {
    const ASSIGN_TUTOR_DISABLED_DISTRICTS =
      process.env.REACT_APP_ASSIGN_TUTOR_DISABLED_DISTRICTS || []
    return !ASSIGN_TUTOR_DISABLED_DISTRICTS.includes(districtId)
  }
)
