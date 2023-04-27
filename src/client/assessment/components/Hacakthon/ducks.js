import { getGptResponse } from '@edulastic/api/src/hackathon'
import { notification } from '@edulastic/common'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import { createSlice } from 'redux-starter-kit'

const initialState = {
  data: {},
  loading: false,
  error: null,
}

const slice = createSlice({
  slice: 'gradeWithGpt',
  initialState: { ...initialState },
  reducers: {
    fetchData: (state) => {
      state.loading = true
    },
    fetchDataSuccess: (state, { payload }) => {
      state.loading = false
      state.data = payload.data
      state.error = null
    },
    fetchDataError: (state, { payload }) => {
      state.loading = false
      state.error = payload.error
    },
  },
})

export const { actions, reducer } = slice

function* fetchDataSaga({ payload }) {
  try {
    const data = yield call(getGptResponse, payload)
    yield put(actions.fetchDataSuccess({ data }))
  } catch (error) {
    const msg = 'Error fetching data. Please try again after a few minutes.'
    notification({ msg })
    yield put(actions.fetchDataError({ error: msg }))
  }
}

export function* watcherSaga() {
  yield all([takeLatest(actions.fetchData, fetchDataSaga)])
}

export const gptResponse = (state) => state.data
