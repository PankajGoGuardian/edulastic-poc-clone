import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import uuidv4 from "uuid/v4";
import { playlists, test } from "@edulastic/constants";
import { call, put, all, takeEvery, select } from "redux-saga/effects";
import { push, replace } from "connected-react-router";
import { message } from "antd";
import { keyBy as _keyBy, omit, get } from "lodash";
import { testsApi, assignmentApi } from "@edulastic/api";
import produce from "immer";
import { SET_MAX_ATTEMPT, UPDATE_TEST_IMAGE, SET_SAFE_BROWSE_PASSWORD } from "../src/constants/actions";
import { loadQuestionsAction } from "../sharedDucks/questions";

// constants

const testsStatusConstants = test.type;

export const SET_ASSIGNMENT = "[assignments] set assignment"; // TODO remove cyclic dependency
export const CREATE_TEST_REQUEST = "[tests] create playlist request";
export const CREATE_TEST_SUCCESS = "[tests] create playlist success";
export const CREATE_TEST_ERROR = "[tests] create playlist error";

export const UPDATE_TEST_REQUEST = "[tests] update playlist request";
export const UPDATE_TEST_SUCCESS = "[tests] update playlist success";
export const UPDATE_TEST_ERROR = "[tests] update playlist error";
export const UPDATE_PLAYLIST = "[playlists] update playlist ";

export const RECEIVE_TEST_BY_ID_REQUEST = "[tests] receive playlist by id request";
export const RECEIVE_TEST_BY_ID_SUCCESS = "[tests] receive playlist by id success";
export const RECEIVE_TEST_BY_ID_ERROR = "[tests] receive playlist by id error";

export const SET_TEST_DATA = "[tests] set playlist data";
export const SET_DEFAULT_TEST_DATA = "[tests] set default playlist data";
export const SET_TEST_EDIT_ASSIGNED = "[tests] set edit assigned";
export const REGRADE_TEST = "[regrade] set regrade data";
export const TEST_SHARE = "[test] send playlist share request";
export const TEST_PUBLISH = "[test] publish playlist";
export const UPDATE_TEST_STATUS = "[test] update playlist status";
export const CLEAR_TEST_DATA = "[test] clear playlist data";
export const TEST_CREATE_SUCCESS = "[test] create playlist succes";
export const SET_REGRADE_OLD_TESTID = "[test] set regrade old test_id";
export const UPDATE_ENTITY_DATA = "[test] update entity data";
export const RECEIVE_SHARED_USERS_LIST = "[test] receive shared users list";
export const UPDATE_SHARED_USERS_LIST = "[test] update shared with users list";
export const DELETE_SHARED_USER = "[test] delete share user from list";
export const ADD_MODULE = "[playlist] Add new module";
export const ADD_TEST_IN_PLAYLIST = "[playlist] add test to module";
export const SET_USER_CUSTOMIZE = "[playlist] set user customize";
export const REMOVE_TEST_FROM_PLAYLIST = "[playlist] remove test from module";
// actions

export const receiveTestByIdAction = id => ({
  type: RECEIVE_TEST_BY_ID_REQUEST,
  payload: { id }
});

export const receiveTestByIdSuccess = entity => ({
  type: RECEIVE_TEST_BY_ID_SUCCESS,
  payload: { entity }
});

export const receiveTestByIdError = error => ({
  type: RECEIVE_TEST_BY_ID_ERROR,
  payload: { error }
});

export const createTestAction = (data, toReview = false) => ({
  type: CREATE_TEST_REQUEST,
  payload: { data, toReview }
});

export const createTestSuccessAction = entity => ({
  type: CREATE_TEST_SUCCESS,
  payload: { entity }
});

export const createTestErrorAction = error => ({
  type: CREATE_TEST_ERROR,
  payload: { error }
});

export const updateTestAction = (id, data, updateLocal) => ({
  type: UPDATE_TEST_REQUEST,
  payload: { id, data, updateLocal }
});

export const updateTestSuccessAction = entity => ({
  type: UPDATE_TEST_SUCCESS,
  payload: { entity }
});

export const updateTestErrorAction = error => ({
  type: UPDATE_TEST_ERROR,
  payload: { error }
});

export const setTestDataAction = data => ({
  type: SET_TEST_DATA,
  payload: { data }
});
export const clearTestDataAction = () => ({
  type: CLEAR_TEST_DATA
});

export const setDefaultTestDataAction = () => ({
  type: SET_DEFAULT_TEST_DATA
});

export const setCreateSuccessAction = () => ({
  type: TEST_CREATE_SUCCESS
});

export const setTestEditAssignedAction = createAction(SET_TEST_EDIT_ASSIGNED);
export const setRegradeSettingsDataAction = payload => ({
  type: REGRADE_TEST,
  payload
});

export const sendTestShareAction = createAction(TEST_SHARE);
export const publishTestAction = createAction(TEST_PUBLISH);
export const updateTestStatusAction = createAction(UPDATE_TEST_STATUS);
export const setRegradeOldIdAction = createAction(SET_REGRADE_OLD_TESTID);
export const updateSharedWithListAction = createAction(UPDATE_SHARED_USERS_LIST);
export const receiveSharedWithListAction = createAction(RECEIVE_SHARED_USERS_LIST);
export const deleteSharedUserAction = createAction(DELETE_SHARED_USER);
export const createNewModuleAction = createAction(ADD_MODULE);
export const createTestInModuleAction = createAction(ADD_TEST_IN_PLAYLIST);
export const setUserCustomizeAction = createAction(SET_USER_CUSTOMIZE);
export const removeTestFromModuleAction = createAction(REMOVE_TEST_FROM_PLAYLIST);

// reducer

const initialPlaylistState = {
  title: "New Playlist",
  description: "",
  status: "draft",
  createdBy: {
    _id: "",
    name: ""
  },
  thumbnail: "https://fakeimg.pl/500x135/",
  derivedFrom: {
    _id: "",
    name: ""
  },
  // FIXME: define schema for modules
  modules: [],
  type: "content",
  // collectionName: "",
  grades: [],
  subjects: [],
  // versionId: "",
  version: 1,
  tags: [],
  active: 1,
  customize: true,
  authors: [
    {
      _id: "",
      name: ""
    }
  ],
  sharedType: "",
  sharedWith: [
    {
      _id: "",
      name: ""
    }
  ]
};

const initialState = {
  entity: initialPlaylistState,
  error: null,
  page: 1,
  limit: 20,
  count: 0,
  loading: false,
  creating: false,
  sharedUsersList: []
};

const createNewModuleState = title => ({
  id: uuidv4(),
  title,
  data: []
});

const createNewTestInModule = test => ({
  contentId: test._id,
  contentTitle: test.title,
  contentType: "test"
});

const removeTestFromPlaylist = (playlist, payload) => {
  const newPlaylist = produce(playlist, draft => {
    draft.modules[payload.moduleIndex].data = draft.modules[payload.moduleIndex].data.filter(
      content => content.contentId !== payload.itemId
    );
  });
  message.success("Test removed from playlist");
  return newPlaylist;
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_MODULE: {
      const newEntity = addModuleToPlaylist(state.entity, payload);
      return { ...state, entity: newEntity };
    }
    case ADD_TEST_IN_PLAYLIST: {
      const newEntity = addTestToModule(state.entity, payload);
      return {
        ...state,
        entity: newEntity
      };
    }
    case REMOVE_TEST_FROM_PLAYLIST: {
      const newEntity = removeTestFromPlaylist(state.entity, payload);
      return { ...state, entity: newEntity };
    }
    case UPDATE_PLAYLIST: {
      return { ...state, entity: payload.updatedModule };
    }
    case SET_DEFAULT_TEST_DATA:
      return { ...state, entity: initialPlaylistState };
    case RECEIVE_TEST_BY_ID_REQUEST:
      return { ...state, loading: true };
    case SET_TEST_EDIT_ASSIGNED:
      return { ...state, editAssigned: true };
    case SET_REGRADE_OLD_TESTID:
      return { ...state, regradeTestId: payload };
    case RECEIVE_TEST_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        entity: {
          ...payload.entity
        }
      };
    case RECEIVE_TEST_BY_ID_ERROR:
      return { ...state, loading: false, error: payload.error };

    case CREATE_TEST_REQUEST:
    case UPDATE_TEST_REQUEST:
      return { ...state, creating: true };
    case CREATE_TEST_SUCCESS:
    case UPDATE_TEST_SUCCESS:
      const { testItems, ...entity } = payload.entity;
      return {
        ...state,
        entity: { ...state.entity, ...entity },
        creating: false
      };
    case UPDATE_ENTITY_DATA:
      const { testItems: items, ...dataRest } = payload.entity;
      return {
        ...state,
        entity: { ...state.entity, ...dataRest }
      };
    case CREATE_TEST_ERROR:
    case UPDATE_TEST_ERROR:
      return { ...state, creating: false, error: payload.error };
    case SET_TEST_DATA:
      return {
        ...state,
        entity: {
          ...state.entity,
          ...payload.data
        }
      };
    case UPDATE_TEST_IMAGE:
      return {
        ...state,
        entity: {
          ...state.entity,
          thumbnail: payload.fileUrl
        }
      };
    case SET_MAX_ATTEMPT:
      return {
        ...state,
        entity: {
          ...state.entity,
          maxAttempts: payload.data
        }
      };
    case SET_SAFE_BROWSE_PASSWORD:
      return {
        ...state,
        entity: {
          ...state.entity,
          sebPassword: payload.data
        }
      };
    case UPDATE_TEST_STATUS:
      return {
        ...state,
        entity: {
          ...state.entity,
          status: payload
        }
      };
    case CLEAR_TEST_DATA:
      return {
        ...state,
        entity: {
          ...state.entity,
          testItems: [],
          grades: [],
          subjects: []
        },
        sharedUsersList: []
      };
    case TEST_CREATE_SUCCESS:
      return {
        ...state,
        creating: false
      };
    case UPDATE_SHARED_USERS_LIST:
      return {
        ...state,
        sharedUsersList: payload
      };
    case SET_USER_CUSTOMIZE:
      return {
        ...state,
        customize: payload
      };
    default:
      return state;
  }
};

/**
 * Return all question of a test.
 * @param {Object} testItems - list of test items
 *
 */
const getQuestions = (testItems = []) => {
  const allQuestions = [];
  for (const item of testItems) {
    const { questions = [], resources = [] } = item.data || {};
    allQuestions.push(...questions, ...resources);
  }
  return allQuestions;
};

// saga
function* receiveTestByIdSaga({ payload }) {
  try {
    const entity = yield call(testsApi.getById, payload.id, { data: true });
    const questions = getQuestions(entity.testItems);
    yield put(loadQuestionsAction(_keyBy(questions, "id")));
    yield put(receiveTestByIdSuccess(entity));
  } catch (err) {
    const errorMessage = "Receive test by id is failing";
    yield call(message.error, errorMessage);
    yield put(receiveTestByIdError(errorMessage));
  }
}

function* createTestSaga({ payload }) {
  const { _id: oldId, versioned: regrade = false } = payload.data;
  try {
    const dataToSend = omit(payload.data, ["assignments", "createdDate", "updatedDate"]);
    const entity = yield call(testsApi.create, dataToSend);
    yield put({
      type: UPDATE_ENTITY_DATA,
      payload: {
        entity
      }
    });

    if (regrade) {
      yield put(setCreateSuccessAction());
      yield put(push(`/author/assignments/regrade/new/${entity._id}/old/${oldId}`));
    } else {
      const hash = payload.toReview ? "#review" : "";

      yield put(createTestSuccessAction(entity));
      yield put(replace(`/author/tests/${entity._id}${hash}`));

      yield call(message.success, "Test created");
    }
  } catch (err) {
    const errorMessage = "Failed to create test!";
    yield call(message.error, errorMessage);
    yield put(createTestErrorAction(errorMessage));
  }
}

function* updateTestSaga({ payload }) {
  try {
    // remove createdDate and updatedDate
    const oldId = payload.data._id;
    delete payload.data.updatedDate;
    delete payload.data.createdDate;
    delete payload.data.assignments;
    delete payload.data.authors;

    const pageStructure = get(payload.data, "pageStructure", []).map(page => ({
      ...page,
      _id: undefined
    }));

    payload.data.pageStructure = pageStructure.length ? pageStructure : undefined;

    const entity = yield call(testsApi.update, payload);

    yield put(updateTestSuccessAction(entity));
    const newId = entity._id;
    if (oldId != newId && newId) {
      yield call(message.success, "Test versioned");
      yield put(push(`/author/tests/${newId}/versioned/old/${oldId}`));
    } else {
      yield call(message.success, "Update Successful");
    }

    if (payload.updateLocal) {
      yield put(setTestDataAction(payload.data));
    }
  } catch (err) {
    const errorMessage = "Update test is failing";
    yield call(message.error, errorMessage);
    yield put(updateTestErrorAction(errorMessage));
  }
}

function* updateRegradeDataSaga({ payload }) {
  try {
    yield call(assignmentApi.regrade, payload);
    yield call(message.success, "Success update");
  } catch (e) {
    const errorMessage = "Update test is failing";
    yield call(message.error, errorMessage);
  }
}

function* shareTestSaga({ payload }) {
  try {
    yield call(testsApi.shareTest, payload);
    yield put(receiveSharedWithListAction(payload.testId));
    yield call(message.success, "Successfully shared");
  } catch (e) {
    const errorMessage = "Sharing failed";
    yield call(message.error, errorMessage);
  }
}

function* publishTestSaga({ payload }) {
  try {
    const { _id: id } = payload;
    yield call(testsApi.publishTest, id);
    yield put(updateTestStatusAction(testItemStatusConstants.PUBLISHED));
    yield call(message.success, "Successfully published");
    const oldId = yield select(state => state.tests.regradeTestId);
    if (oldId) {
      yield put(push(`/author/assignments/regrade/new/${id}/old/${oldId}`));
      yield put(setRegradeOldIdAction(undefined));
    }
  } catch (e) {
    const errorMessage = "publish failed";
    yield call(message.error, errorMessage);
  }
}

function* receiveSharedWithListSaga({ payload }) {
  try {
    const result = yield call(testsApi.getSharedUsersList, payload);
    const coAuthors = result.map(({ permission, sharedWith, sharedType, _id }) => ({
      permission,
      sharedWith,
      sharedType,
      sharedId: _id
    }));
    yield put(updateSharedWithListAction(coAuthors));
  } catch (e) {
    const errorMessage = "receive share with users list is failing";
    yield call(message.error, errorMessage);
  }
}

function* deleteSharedUserSaga({ payload }) {
  try {
    const authors = yield call(testsApi.deleteSharedUser, payload);
    yield put(receiveSharedWithListAction(payload.testId));
  } catch (e) {
    const errorMessage = "delete shared user is failing";
    yield call(message.error, errorMessage);
  }
}

function addModuleToPlaylist(playlist, payload) {
  const newPlaylist = produce(playlist, draft => {
    const newModule = createNewModuleState(payload.moduleName);
    draft.modules.splice(payload.afterModuleIndex || 0, 0, newModule);
    return draft;
  });
  message.success("Module Added to playlist");
  return newPlaylist;
}

function addTestToModule(entity, payload) {
  const { testAdded, moduleIndex } = payload;
  entity.modules[moduleIndex] = produce(entity.modules[moduleIndex], draft => {
    const newTest = createNewTestInModule(testAdded);
    draft.data.push(newTest);
    return draft;
  });
  message.success("Test Added in playlist");
  return entity;
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_TEST_BY_ID_REQUEST, receiveTestByIdSaga),
    yield takeEvery(CREATE_TEST_REQUEST, createTestSaga),
    yield takeEvery(UPDATE_TEST_REQUEST, updateTestSaga),
    yield takeEvery(REGRADE_TEST, updateRegradeDataSaga),
    yield takeEvery(TEST_SHARE, shareTestSaga),
    yield takeEvery(TEST_PUBLISH, publishTestSaga),
    yield takeEvery(RECEIVE_SHARED_USERS_LIST, receiveSharedWithListSaga),
    yield takeEvery(DELETE_SHARED_USER, deleteSharedUserSaga)
  ]);
}

// selectors

export const stateSelector = state => state.playlist;

export const getTestSelector = createSelector(
  stateSelector,
  state => state.entity
);

export const getTestEntitySelector = createSelector(
  stateSelector,
  state => state.entity
);

export const getTestStatusSelector = createSelector(
  getTestEntitySelector,
  state => state.status
);

export const getTestIdSelector = createSelector(
  stateSelector,
  state => state.entity && state.entity._id
);

export const getTestsCreatingSelector = createSelector(
  stateSelector,
  state => state.creating
);

export const getTestsLoadingSelector = createSelector(
  stateSelector,
  state => state.loading
);

export const getUserCustomizeSelector = createSelector(
  stateSelector,
  state => get(state, "customize", true)
);

export const getUserListSelector = createSelector(
  stateSelector,
  state => {
    const usersList = state.sharedUsersList;
    const flattenUsers = [];
    usersList.forEach(({ permission, sharedType, sharedWith, sharedId }) => {
      if (sharedType === "INDIVIDUAL" || sharedType === "SCHOOL") {
        sharedWith.forEach(user => {
          flattenUsers.push({
            userName: user.name,
            email: user.email || "",
            _userId: user._id,
            permission,
            sharedId
          });
        });
      } else {
        flattenUsers.push({
          userName: sharedType,
          permission,
          sharedId
        });
      }
    });
    return flattenUsers;
  }
);

export const getTestItemsRowsSelector = createSelector(
  getTestSelector,
  state => state
  // state.testItems.map(item => {
  //     if (!item || !item.rows) return [];
  //     return item.rows.map(row => ({
  //         ...row,
  //         widgets: row.widgets.map(widget => {
  //             let referencePopulate = {
  //                 data: null
  //             };

  //             if (item.data && item.data.questions && item.data.questions.length) {
  //                 referencePopulate = item.data.questions.find(q => q._id === widget.reference);
  //             }

  //             if (!referencePopulate && item.data && item.data.resources && item.data.resources.length) {
  //                 referencePopulate = item.data.resources.find(r => r._id === widget.reference);
  //             }

  //             return {
  //                 ...widget,
  //                 referencePopulate
  //             };
  //         })
  //     }));
  // })
);
