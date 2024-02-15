import { createAction, createReducer } from 'redux-starter-kit'
import { skillReportApi } from '@edulastic/api'
import { takeLatest, call, all, put } from 'redux-saga/effects'
import { createSelector } from 'reselect'

// actions
export const GET_SKILL_REPORT_BY_CLASSID =
  '[reports] get skill reports by class id'
export const LOAD_SKILL_REPORT_BY_CLASSID_SUCCESS =
  '[reports] load skill report by class id success'
export const LOAD_SKILL_REPORT_BY_CLASSID_FAILED =
  '[reports] load skill report by class id failed'

const initialState = {
  reports: null,
  loading: false,
}

const reducer = createReducer(initialState, {
  [GET_SKILL_REPORT_BY_CLASSID]: (state) => {
    state.loading = true
  },
  [LOAD_SKILL_REPORT_BY_CLASSID_SUCCESS]: (state, action) => {
    state.reports = action.payload.reports
    state.loading = false
  },
  [LOAD_SKILL_REPORT_BY_CLASSID_FAILED]: (state) => {
    state.loading = false
  },
})

export default reducer

// action creators
export const fetchSkillReportByClassID = createAction(
  GET_SKILL_REPORT_BY_CLASSID
)

// sagas
function* fetchSkillReport(action) {
  const data = action.payload
  try {
    const reports = yield call(skillReportApi.fetchSkillReport, data)
    yield put({
      type: LOAD_SKILL_REPORT_BY_CLASSID_SUCCESS,
      payload: { reports },
    })
  } catch (err) {
    yield put({ type: LOAD_SKILL_REPORT_BY_CLASSID_FAILED, payload: err })
    console.error(err)
  }
}

export function* watcherSaga() {
  yield all([takeLatest(GET_SKILL_REPORT_BY_CLASSID, fetchSkillReport)])
}

// selectors
export const stateSelector = (state) => state.skillReport

export const getSkillReportLoaderSelector = createSelector(
  stateSelector,
  (state) => state.loading
)
