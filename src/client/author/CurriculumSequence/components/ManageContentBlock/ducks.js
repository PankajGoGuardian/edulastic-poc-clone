import { createSlice } from "redux-starter-kit";
import { delay } from "redux-saga";
import { takeEvery, takeLatest, put, call, all, select } from "redux-saga/effects";
import { testsApi } from "@edulastic/api";
import { set } from "lodash";
import nanoid from "nanoid";

export const sliceName = "playlistTestBox";
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
    externalLTIResources: [],
    status: "",
    authoredBy: "",
    subject: "",
    grades: [],
    collection: "",
    sources: [],
    isLoading: false,
    loadedPage: 0,
    filter: "ENTIRE_LIBRARY",
    searchString: null,
    externalLTIModal: {}
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
      if (state.loadedPage === 0) {
        state.tests = payload.items;
      } else {
        state.tests.push(...payload.items);
      }
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
      state.loadedPage = 0;
      state.tests = [];
    },
    setTestSearchAction: (state, { payload }) => {
      state.searchString = payload;
    },
    changeExternalLTIModalAction: (state, { payload }) => {
      const { key, value } = payload;
      set(state.externalLTIModal, key, value);
    },
    addExternalLTIResourceAction: state => {
      const data = state.externalLTIModal;
      data.contentType = "LTI_RESOURCE";
      data.contentId = nanoid();
      state.externalLTIResources.unshift(data);
      state.externalLTIModal = {};
    }
  }
});

export default slice;

function* fetchTestsSaga({ payload }) {
  try {
    const { status, subject, grades, loadedPage, filter, collection } = yield select(state => state[sliceName]);
    const { items, count } = yield call(testsApi.getAll, {
      search: {
        status,
        subject,
        grades,
        filter,
        collections: collection === "" ? [] : [collection]
      },
      page: loadedPage + 1,
      limit: LIMIT
    });
    yield put(slice.actions.fetchTestsSuccess({ items, count }));
  } catch (e) {
    console.error("Error Occured: fetchTestsSaga ", e);
  }
}

function* fetchTestsBySearchString({ payload }) {
  try {
    yield delay(600);
    yield put(slice.actions?.resetLoadedPage());
    const { status, subject, grades, loadedPage, filter, collection, searchString } = yield select(
      state => state[sliceName]
    );
    const { items, count } = yield call(testsApi.getAll, {
      search: {
        status,
        subject,
        grades,
        filter,
        collections: collection === "" ? [] : [collection],
        searchString
      },
      page: loadedPage + 1,
      limit: LIMIT
    });
    yield put(slice.actions.fetchTestsSuccess({ items, count }));
  } catch (e) {
    console.error("Error Occured: fetchTestsBySearchParam ", e);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.fetchTests, fetchTestsSaga),
    yield takeEvery(slice.actions.resetAndFetchTests, fetchTestsSaga),
    yield takeLatest(slice.actions.setTestSearchAction, fetchTestsBySearchString)
  ]);
}
