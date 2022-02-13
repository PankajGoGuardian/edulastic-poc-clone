import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import _ from 'lodash'
import {
  dashboardApi,
  curriculumSequencesApi,
  reportsApi,
  recommendationsApi,
} from '@edulastic/api'
import { captureSentryException, notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import configurableTilesApi from '@edulastic/api/src/configurableTiles'
import { getUserDetails, setClassToUserAction } from '../../student/Login/ducks'
import { getUserId, getUserOrgId } from '../src/selectors/user'

const RECEIVE_TEACHER_DASHBOARD_REQUEST =
  '[dashboard teacher] receive data request'
const RECEIVE_TEACHER_DASHBOARD_SUCCESS =
  '[dashboard teacher] receive data success'
const RECEIVE_TEACHER_DASHBOARD_ERROR = '[dashboard teacher] receive data error'
const SET_TOTAL_ASSIGNMENT_COUNT =
  '[dashboard teacher] set total assignment count'
const LAUNCH_HANGOUT_OPEN = '[dashboard teacher] launch hangouts open'
const LAUNCH_HANGOUT_CLOSE = '[dashboard teacher] launch hangouts close'

const FETCH_DASHBOARD_TILES = '[dashboard teacher] fetch tiles data'
const SET_DASHBOARD_TILES = '[dashboard teacher] set tiles data'
const SET_TRIAL = '[dashboard teacher] set trial'
const FETCH_PLAYLIST = '[dashboard teacher] fetch playlists'
const FETCH_PLAYLIST_SUCCESS = '[dashboard teacher] fetch playlists success'
const UPDATE_FAVORITE_CLASSES = '[dashboard teacher] update favorite classes'
const TOGGLE_FAVORITE_CLASS = '[dashboard teacher] toggle favorite classes'
export const LOAD_PERFORMANCE_GOALS_REPORT =
  '[studentReports] load performance goals report'
export const LOAD_DIFFERENCIATION_DATA =
  '[studentReports] load differenciation data'
export const SET_DIFFERENCIATION_DATA =
  '[studentReports] set diffreciation data'
export const SET_PERFORMANCE_GOALS = '[studentReports] set performance goals'

export const receiveTeacherDashboardAction = createAction(
  RECEIVE_TEACHER_DASHBOARD_REQUEST
)
export const receiveTeacherDashboardSuccessAction = createAction(
  RECEIVE_TEACHER_DASHBOARD_SUCCESS
)
export const receiveTeacherDashboardErrorAction = createAction(
  RECEIVE_TEACHER_DASHBOARD_ERROR
)
export const setTotalAssignmentConutAction = createAction(
  SET_TOTAL_ASSIGNMENT_COUNT
)
export const launchHangoutOpen = createAction(LAUNCH_HANGOUT_OPEN)
export const launchHangoutClose = createAction(LAUNCH_HANGOUT_CLOSE)

export const fetchDashboardTiles = createAction(FETCH_DASHBOARD_TILES)
export const setDashboardTiles = createAction(SET_DASHBOARD_TILES)

export const setTrial = createAction(SET_TRIAL)

export const fetchPlaylistsAction = createAction(FETCH_PLAYLIST)
export const fetchPlaylistsSuccessAction = createAction(FETCH_PLAYLIST_SUCCESS)

export const updatefavoriteClassesAction = createAction(UPDATE_FAVORITE_CLASSES)
export const togglefavoriteClassAction = createAction(TOGGLE_FAVORITE_CLASS)
export const loadPerformanceGoalsReportAction = createAction(
  LOAD_PERFORMANCE_GOALS_REPORT
)
export const loadDifferenciationDataAction = createAction(
  LOAD_DIFFERENCIATION_DATA
)
export const stateSelector = (state) => state.dashboardTeacher

export const getLaunchHangoutStatus = createSelector(
  stateSelector,
  (state) => state.isLaunchHangoutOpen
)
export const getDashboardTilesSelector = createSelector(
  stateSelector,
  (state) => state.configurableTiles
)

export const getDashboardPlaylists = createSelector(
  stateSelector,
  (state) => state.playlists
)

export const getDashboardClasses = createSelector(
  stateSelector,
  (state) => state.data
)

export const getPerformanceGoalsSelector = createSelector(
  stateSelector,
  (state) => state.performanceGoals
)

const initialState = {
  data: [],
  error: null,
  loading: false,
  isLaunchHangoutOpen: false,
  isAddingTrial: false,
  configurableTiles: JSON.parse(
    localStorage.getItem('author:dashboard:tiles') || '[]'
  ),
  allAssignmentCount: 0,
  performanceGoals: {},
}

const updateDifferenciationData = (state, payload) => {
  const data = state?.dashboardTeacher?.performanceGoals?.differenciations || {}
  data[`${payload.studentId}`] = _.isEmpty(payload.review)
    ? []
    : payload.review.map((k) => {
        return {
          name: k.standardIdentifier,
          standardName: k.description,
        }
      })
  return data
}

const translatePerformanceGoalsData = (payload) => {
  const { metricInfo, skillInfo, stdInfo } = payload
  const studentsNameMap = stdInfo.reduce((acc, data) => {
    acc[data._id] = [data.firstName, data.middleName, data.lastName].join(' ')
    return acc
  }, {})
  const standardsNameMap = skillInfo.reduce((acc, data) => {
    acc[data.standardId] = {
      id: data.standardId,
      name: data.standard,
      domainName: data.domainName,
      standardName: data.standardName,
    }
    return acc
  }, {})
  const eachStdInfo = _.map(_.groupBy(metricInfo, 'studentId'), (data) => {
    const totalOS = _.sumBy(data, 'obtainedScore')
    const totalMS = _.sumBy(data, 'maxScore')
    // standards < 60%
    const standards = []
    data.forEach((o) => {
      const standardScore = Math.ceil((o.obtainedScore / o.maxScore) * 100)
      if (standardScore < 60) {
        standards.push(standardsNameMap[o.standardId])
      }
    })
    return {
      studentId: data?.[0]?.studentId,
      score: Math.ceil((totalOS / totalMS) * 100),
      name: studentsNameMap[data?.[0]?.studentId],
      standards,
    }
  })

  const countBelow60 = eachStdInfo.filter((o) => o.score < 60).length
  const countAbove60 = eachStdInfo.filter((o) => o.score >= 60).length

  return {
    eachStdInfo: eachStdInfo.filter((o) => o.score < 60),
    countBelow60,
    countAbove60,
  }
}

export const reducer = createReducer(initialState, {
  [RECEIVE_TEACHER_DASHBOARD_REQUEST]: (state, { payload }) => {
    state.loading = !payload?.background
  },
  [RECEIVE_TEACHER_DASHBOARD_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.data = payload
  },
  [SET_TOTAL_ASSIGNMENT_COUNT]: (state, { payload }) => {
    state.loading = false
    state.allAssignmentCount = payload
  },
  [RECEIVE_TEACHER_DASHBOARD_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [LAUNCH_HANGOUT_OPEN]: (state) => {
    state.isLaunchHangoutOpen = true
  },
  [LAUNCH_HANGOUT_CLOSE]: (state) => {
    state.isLaunchHangoutOpen = false
  },
  [SET_DASHBOARD_TILES]: (state, { payload }) => {
    state.configurableTiles = payload
  },
  [SET_TRIAL]: (state, { payload }) => {
    state.isAddingTrial = payload
  },
  [FETCH_PLAYLIST_SUCCESS]: (state, { payload }) => {
    state.playlists = payload
  },
  [SET_PERFORMANCE_GOALS]: (state, { payload }) => {
    state.performanceGoals = translatePerformanceGoalsData(payload)
  },
  [SET_DIFFERENCIATION_DATA]: (state, { payload }) => {
    state.performanceGoals.differenciations = updateDifferenciationData(
      state,
      payload
    )
  },
  [UPDATE_FAVORITE_CLASSES]: (state, { payload }) => {
    state.data = state.data.map((item) => {
      if (item._id === payload.groupId) {
        item.isFavourite = payload.isFavourite
      }
      return item
    })
  },
})

function* receiveTeacherDashboardSaga({ payload }) {
  try {
    const userId = yield select(getUserId)
    const districtId = yield select(getUserOrgId)
    const { classDetails, totalAssignmentCount = 0 } = yield call(
      dashboardApi.getTeacherDashboardDetails,
      localStorage.getItem(
        `author:dashboard:classFilter:${userId}:${districtId}`
      )
    )
    yield put(receiveTeacherDashboardSuccessAction(classDetails))
    if (payload?.updateUserClassList) {
      yield put(setClassToUserAction(classDetails))
    }
    yield put(setTotalAssignmentConutAction(totalAssignmentCount))
    payload?.setClassType?.()
  } catch (err) {
    const errorMessage = 'Unable to fetch dashboard details.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveTeacherDashboardErrorAction({ error: errorMessage }))
  }
}

function* toggleFavoriteClassSaga({ payload }) {
  try {
    yield put(
      updatefavoriteClassesAction({
        groupId: payload.groupId,
        isFavourite: payload.toggleValue,
      })
    )
    const result = yield call(dashboardApi.toggleFavouriteClass, {
      groupId: payload.groupId,
      toggleValue: payload.toggleValue,
    })
    if (result.success) {
      notification({ type: 'success', duration: 1.5, msg: result.message })
      if (payload.removeClassFromList) {
        const dashboardClasses = yield select(getDashboardClasses)
        yield put(
          receiveTeacherDashboardSuccessAction(
            dashboardClasses.filter((x) => x._id !== payload.groupId)
          )
        )
      }
    } else {
      yield put(
        updatefavoriteClassesAction({
          groupId: payload.groupId,
          isFavourite: !payload.toggleValue,
        })
      )
      notification({
        type: 'error',
        duration: 1.5,
        msg: 'Failed to mark class as favourite.',
      })
    }
  } catch (e) {
    captureSentryException(e)
    yield put(
      updatefavoriteClassesAction({
        groupId: payload.groupId,
        isFavourite: !payload.toggleValue,
      })
    )
    notification({
      type: 'error',
      duration: 1.5,
      msg: 'Failed to mark class as favourite.',
    })
  }
}

function* fetchDashboardTilesSaga() {
  try {
    const version = localStorage.getItem('author:dashboard:version')
    const state = yield select(
      (s) => s.user.user?.orgData?.districts?.[0]?.districtState || ''
    )
    const user = yield select(getUserDetails) || {}
    const result = yield call(
      configurableTilesApi.fetchTiles,
      +version,
      state.toUpperCase(),
      user.utm_source === 'singapore' ? true : undefined
    )
    if (!version || version !== result.version) {
      yield put(setDashboardTiles(result.data))
      localStorage.setItem(
        'author:dashboard:tiles',
        JSON.stringify(result.data)
      )
      localStorage.setItem('author:dashboard:version', +result.version)
    }
  } catch (err) {
    console.log(err)
    const errorMessage = 'Unable to fetch dashboard details.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveTeacherDashboardErrorAction({ error: errorMessage }))
  }
}

function* fetchPlaylistsSaga({ payload }) {
  try {
    const result = yield call(
      curriculumSequencesApi.searchCurriculumSequences,
      payload
    )
    yield put(fetchPlaylistsSuccessAction(result.hits.hits))
  } catch (err) {
    notification({ type: 'error', msg: 'Unable to fetch playlists details.' })
  }
}

function* loadPerformanceGoalsDetails({ payload }) {
  try {
    const { termId } = payload
    const result = yield call(reportsApi.fetchPerformanceGoalsDetails, termId)
    yield put({ type: SET_PERFORMANCE_GOALS, payload: result })
  } catch (e) {
    if (e.status === 404) {
      return notification({
        msg: e?.response?.data?.message || 'No data found',
      })
    }
    return notification({
      msg: e?.response?.data?.message || 'Something went wrong',
    })
  }
}

function* loadDifferenciationDetails({ payload }) {
  try {
    const studentId = payload.studentId
    delete payload.studentId
    const result = yield call(
      recommendationsApi.getRecommendedReviewStandards,
      payload
    )
    yield put({
      type: SET_DIFFERENCIATION_DATA,
      payload: { ...result, studentId },
    })
  } catch (e) {
    return notification({
      msg: e?.response?.data?.message || 'No data found',
    })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(
      RECEIVE_TEACHER_DASHBOARD_REQUEST,
      receiveTeacherDashboardSaga
    ),
    yield takeEvery(FETCH_DASHBOARD_TILES, fetchDashboardTilesSaga),
    yield takeEvery(FETCH_PLAYLIST, fetchPlaylistsSaga),
    yield takeEvery(TOGGLE_FAVORITE_CLASS, toggleFavoriteClassSaga),
    yield takeEvery(LOAD_PERFORMANCE_GOALS_REPORT, loadPerformanceGoalsDetails),
    yield takeEvery(LOAD_DIFFERENCIATION_DATA, loadDifferenciationDetails),
  ])
}
