import { takeEvery, all, call, put } from 'redux-saga/effects'
import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { captureSentryException, notification } from '@edulastic/common'
import { reportsApi } from '@edulastic/api'
import { getUserOrgId } from '../src/selectors/user'
import { actions as GIActions } from '../Reports/subPages/dataWarehouseReports/GoalsAndInterventions/ducks/actionReducers'

const reduxNamespaceKey = 'tutorMe'
const initialState = {
  assigning: false,
  // TODO: un-used state, to be rethought once SDK is provided
  // tutorMeStandardsDetails: {
  //   // tutorMeSubject, tutorMeSubjectArea, tutorMeGrade
  // },
}
const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState,
  reducers: {
    assignTutorRequest: (state) => {
      state.assigning = true
    },
    assignTutorSucces: (state) => {
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

function* assignTutorForStudentsSaga({ payload }) {
  try {
    const intervention = yield call(reportsApi.createIntervention, payload)
    yield put(GIActions.setIntervention(intervention))
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
