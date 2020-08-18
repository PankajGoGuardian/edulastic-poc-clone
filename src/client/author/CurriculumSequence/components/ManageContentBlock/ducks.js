import { createSlice } from "redux-starter-kit";
import { delay } from "redux-saga";
import { takeEvery, takeLatest, put, call, all, select } from "redux-saga/effects";
import { testsApi, settingsApi, resourcesApi } from "@edulastic/api";
import { notification } from "@edulastic/common";

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
    resources: [],
    status: "",
    authoredBy: "",
    subject: "",
    grades: [],
    collection: "",
    sources: [],
    isLoading: false,
    loadedPage: 0,
    filter: "ENTIRE_LIBRARY",
    searchString: undefined,
    testPreviewModalVisible: false,
    selectedTestForPreview: "",
    externalToolsProviders: [],
    searchResourceBy: "tests"
  },
  reducers: {
    setDefaults: (state, { payload }) => {
      const { subject = "", grades = [], collection = "" } = payload;
      state.subject = subject;
      state.grades = grades;
      state.collection = collection;
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
      state.collection = payload;
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
    showTestPreviewModal: (state, { payload }) => {
      state.selectedTestForPreview = payload;
      state.testPreviewModalVisible = true;
    },
    closeTestPreviewModal: state => {
      state.selectedTestForPreview = "";
      state.testPreviewModalVisible = false;
    },
    fetchExternalToolProvidersAction: state => {
      state.externalToolsProviders = [];
    },
    fetchExternalToolProvidersSuccess: (state, { payload }) => {
      state.externalToolsProviders = payload;
    },
    setSearchByTab: (state, { payload }) => {
      state.searchResourceBy = payload;
    },
    addResource: state => {
      state.searchResourceBy = "resources";
    },
    fetchResource: state => {
      state.isLoading = true;
    },
    fetchResourceResult: (state, { payload }) => {
      state.isLoading = false;
      state.resources = payload;
    },
    resetAndFetchResources: state => {
      state.isLoading = true;
      state.loadedPage = 0;
      state.resources = [];
    }
  }
});

export default slice;

function* fetchTestsSaga() {
  try {
    const { status, subject, grades, loadedPage, filter, collection, searchString } = yield select(
      state => state[sliceName]
    );
    // Add authoredBy and sources once BE is fixed

    const { items, count } =
      status === "draft" && filter === "ENTIRE_LIBRARY"
        ? { items: [], count: 0 }
        : yield call(testsApi.getAll, {
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
    console.error("Error Occured: fetchTestsSaga ", e);
  }
}

function* fetchTestsBySearchString() {
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

function* fetchExternalToolsSaga({ payload }) {
  try {
    const result = yield call(settingsApi.getExternalTools, { orgId: payload.districtId });
    yield put(slice.actions.fetchExternalToolProvidersSuccess(result));
  } catch (e) {
    console.error("Error Occured: fetchExternalTools ", e);
  }
}

function* fetchDataSaga({ payload }) {
  try {
    if (payload === "tests") {
      yield put(slice.actions.resetAndFetchTests());
    } else {
      yield put(slice.actions.resetAndFetchResources());
    }
  } catch (e) {
    console.error("Error Occured: fetchDataSaga ", e);
  }
}

function* addResourceSaga({ payload }) {
  try {
    yield call(resourcesApi.addResource, payload);
    yield put(slice.actions.resetAndFetchResources());
  } catch (e) {
    console.error("Error Occured: addResourceSaga ", e);
  }
}

function* fetchResourceSaga() {
  try {
    const result = yield call(resourcesApi.fetchResources);
    if (!result) {
      notification({ msg: result.error });
      yield put(slice.actions.fetchResourceResult([]));
    } else {
      yield put(slice.actions.fetchResourceResult(result));
    }
  } catch (e) {
    console.error("Error Occured: fetchResourceSaga ", e);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.fetchTests, fetchTestsSaga),
    yield takeEvery(slice.actions.resetAndFetchTests, fetchTestsSaga),
    yield takeLatest(slice.actions.setTestSearchAction, fetchTestsBySearchString),
    yield takeEvery(slice.actions.fetchExternalToolProvidersAction, fetchExternalToolsSaga),
    yield takeEvery(slice.actions.setSearchByTab, fetchDataSaga),
    yield takeEvery(slice.actions.addResource, addResourceSaga),
    yield takeEvery(slice.actions.fetchResource, fetchResourceSaga),
    yield takeEvery(slice.actions.resetAndFetchResources, fetchResourceSaga)
  ]);
}
