import { createSlice } from 'redux-starter-kit'
import { takeEvery, call, put, all } from 'redux-saga/effects'
import { studentPlaylistApi, recommendationsApi } from '@edulastic/api'
import { createSelector } from 'reselect'
import moment from 'moment'
import { keyBy, groupBy } from 'lodash'

const slice = createSlice({
  name: 'studentPlaylist', //! FIXME key should be `slice` not `name`
  initialState: {
    isLoading: false,
    playlists: [],
    recommendations: [],
    error: '',
  },
  reducers: {
    fetchStudentPlaylist: (state) => {
      state.isLoading = true
    },
    fetchStudentPlaylistSuccess: (state, { payload }) => {
      state.isLoading = false
      state.playlists = payload
      state.error = ''
    },
    fetchStudentPlaylistFailure: (state, { payload }) => {
      state.isLoading = false
      state.playlists = []
      state.error = payload
    },
    fetchRecommendations: (state) => {
      state.isLoading = true
    },
    fetchRecommendationsSuccess: (state, { payload }) => {
      state.isLoading = false
      state.recommendations = payload
    },
    fetchRecommendationsError: (state, { payload }) => {
      state.isLoading = false
      state.error = payload
    },
  },
})

export { slice }

function* fetchPlaylist() {
  try {
    const apiResponse = yield call(studentPlaylistApi.fetchStudentPlaylists)
    yield put(slice.actions.fetchStudentPlaylistSuccess(apiResponse))
  } catch (err) {
    yield put(slice.actions.fetchStudentPlaylistFailure(err?.data?.message))
    console.error('ERROR WHILE FETCHING STUDENT PLAYLIST : ', err)
  }
}

function* fetchRecommendations() {
  try {
    const res = yield call(recommendationsApi.fetchRecommendations)
    yield put(slice.actions.fetchRecommendationsSuccess(res))
  } catch (err) {
    yield put(slice.actions.fetchRecommendationsError(err?.data))
    console.error('ERROR WHILE FETCHING STUDENT PLAYLIST : ', err)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.fetchStudentPlaylist, fetchPlaylist),
    yield takeEvery(slice.actions.fetchRecommendations, fetchRecommendations),
  ])
}

const stateSelector = (state) => state.studentPlaylist

export const getIsLoadingSelector = createSelector(
  stateSelector,
  (state) => state.isLoading
)

export const getRecommendationsSelector = createSelector(
  stateSelector,
  (state) => state.recommendations
)

const formatDate = (timeStamp) => {
  // As the moment doesnt apply super script suffix for date do it manually here
  const formated = moment(parseInt(timeStamp)).format('ddd, MMMM Do , YYYY')
  const splitted = formated.split(' ')
  const [, , Do] = splitted
  const date = parseInt(Do)
  const [_, suffix] = Do.split(date)
  splitted[2] = `${date}<sup>${suffix}</sup>`
  return splitted.join(' ')
}

export const getTransformedRecommendations = createSelector(
  getRecommendationsSelector,
  (state) => {
    return (
      state.map((item) => ({
        ...item,
        updatedAt: formatDate(item.updatedAt),
        createdAt: formatDate(item.createdAt),
        createdAtTemp: item.createdAt,
      })) || []
    )
  }
)

export const recommendationsTimed = createSelector(
  getTransformedRecommendations,
  (state) =>
    groupBy(state, (item) => {
      return moment(item.createdAtTemp).startOf('day').valueOf()
    })
)

export const getDateKeysSelector = createSelector(
  recommendationsTimed,
  (state) => {
    return Object.keys(state).sort((a, b) => b - a)
  }
)

export const userRecommenendationActivities = createSelector(
  getTransformedRecommendations,
  (state = []) => keyBy(state, '_id')
)

export const getActivitiesByResourceId = createSelector(
  getRecommendationsSelector,
  (state) => {
    const studentTestActivitiesById = {}
    for (const item of state) {
      studentTestActivitiesById[item._id] = item.studentTestActivities
    }
    return studentTestActivitiesById
  }
)
