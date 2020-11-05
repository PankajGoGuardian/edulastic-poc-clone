import { createAction } from 'redux-starter-kit'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { assignmentApi, testsApi } from '@edulastic/api'
import { roleuser } from '@edulastic/constants'
import { getClasses, getUserRole, getUserDetails } from '../student/Login/ducks'

export const FETCH_ASSIGNMENTS_BY_TEST_ID =
  '[assignmentEmbedLink] fetch assignments by testId'

export const fetchAssignmentsByTestIdAction = createAction(
  FETCH_ASSIGNMENTS_BY_TEST_ID
)

function* fetchAssignmentsByTestIdSaga({ payload }) {
  try {
    const assignments = yield call(assignmentApi.fetchByTestId, payload) || []
    const userRole = yield select(getUserRole)
    const districtId = (yield select(getUserDetails)).districtIds[0]
    if (assignments.length > 0) {
      assignments.sort((a, b) => b.createdAt - a.createdAt)
      if (roleuser.DA_SA_ROLE_ARRAY.includes(userRole)) {
        const assignmentFilters = JSON.parse(
          sessionStorage.getItem('filters[Assignments]') || '{}'
        )
        assignmentFilters.termId = assignments[0].termId
        sessionStorage.setItem(
          'filters[Assignments]',
          JSON.stringify(assignmentFilters)
        )
        yield put(
          push(
            `/author/assignments/${districtId}/${payload}?testType=${assignments[0].testType}`
          )
        )
      } else if (userRole === roleuser.TEACHER) {
        let userClasses = yield select(getClasses)
        userClasses = userClasses
          .filter((c) => c.active === 1)
          .map((c) => c._id)
        const classId = assignments[0].class.find((c) =>
          userClasses.includes(c._id)
        )._id
        yield put(push(`/author/classboard/${assignments[0]?._id}/${classId}`))
      }
    } else {
      try {
        yield call(testsApi.getById, payload)
        yield put(push(`/author/tests/tab/review/id/${payload}`))
      } catch (err) {
        yield put(push('/author/assignments'))
      }
    }
  } catch (err) {
    console.error(err)
  }
}

export function* watcherSaga() {
  yield takeLatest(FETCH_ASSIGNMENTS_BY_TEST_ID, fetchAssignmentsByTestIdSaga)
}
