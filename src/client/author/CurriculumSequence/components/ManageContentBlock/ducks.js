import { createSlice } from "redux-starter-kit";
import { takeEvery, put, call, all, select } from "redux-saga/effects";
import { testsApi } from "@edulastic/api";

const sliceName = "playlistTestBox";
const LIMIT = 20;

const slice = createSlice({
  slice: sliceName,
  initialState: {
    tests: [],
    subject: "",
    grades: [],
    isLoading: false,
    loadedPage: 0,
    filter: "ENTIRE_LIBRARY"
  },
  reducers: {
    setDefaults: (state, { payload }) => {
      const { subject = "", grades = [] } = payload;
      state.subject = subject;
      state.grades = grades;
    },
    fetchTests: state => {
      state.isLoading = true;
    },
    fetchTestsSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.tests = payload.items;
      state.loadedPage += 1;
    }
  }
});

export default slice;

function* fetchTestsSaga({ payload }) {
  try {
    const { subject, grades, loadedPage, filter } = yield select(state => state[sliceName]);
    const { items, count } = yield call(testsApi.getAll, {
      search: { subject, grades, filter },
      page: loadedPage + 1,
      limit: LIMIT
    });
    yield put(slice.actions.fetchTestsSuccess({ items, count }));
  } catch (e) {
    console.error("Error Occured: fetchTestsSaga ", e);
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(slice.actions.fetchTests, fetchTestsSaga)]);
}
