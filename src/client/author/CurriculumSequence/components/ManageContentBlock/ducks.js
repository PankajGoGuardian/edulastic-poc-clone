import { createSlice } from "redux-starter-kit";
import { takeEvery, put, call, all, select } from "redux-saga/effects";
import { testsApi } from "@edulastic/api";

const sliceName = "playlistTestBox";
const LIMIT = 20;

export const FILTERS = [
  { icon: "book", filter: "ENTIRE_LIBRARY", path: "all", text: "Entire Library" },
  { icon: "folder", filter: "AUTHORED_BY_ME", path: "by-me", text: "Authored by me" },
  { icon: "share-alt", filter: "SHARED_WITH_ME", path: "shared", text: "Shared with me" },
  { icon: "reload", filter: "PREVIOUS", path: "previous", text: "Previously Used" },
  { icon: "heart", filter: "FAVORITES", path: "favourites", text: "My Favorites" }
];

const slice = createSlice({
  slice: sliceName,
  initialState: {
    tests: [],
    status: "",
    authoredBy: "",
    subject: "",
    grades: [],
    collection: "",
    sources: [],
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
    },
    setFilterAction: (state, { payload }) => {
      state.filter = payload;
    },
    setStatusAction: (state, { payload }) => {
      state.status = payload;
    },
    setAuthoredAction: (state, { payload }) => {
      state.authoredBy = payload;
    },
    setGradesAction: (state, { payload }) => {
      state.grades = payload;
    },
    setSubjectAction: (state, { payload }) => {
      state.subject = payload;
    },
    setCollectionAction: (state, { payload }) => {
      state.subject = payload;
    },
    setSourcesAction: (state, { payload }) => {
      state.sources = payload;
    },
    resetLoadedPage: state => {
      state.loadedPage = 0;
    },
    resetAndFetchTests: state => {
      state.isLoading = true;
      state.tests = [];
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
  yield all([
    yield takeEvery(slice.actions.fetchTests, fetchTestsSaga),
    yield takeEvery(slice.actions.resetAndFetchTests, fetchTestsSaga)
  ]);
}
