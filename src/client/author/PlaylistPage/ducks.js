import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import { call, put, all, takeEvery, select } from "redux-saga/effects";
import { push, replace } from "connected-react-router";
import { message } from "antd";
import { omit, get } from "lodash";
import { curriculumSequencesApi, contentSharingApi } from "@edulastic/api";
import produce from "immer";
import { white, themeColor } from "@edulastic/colors";
import { SET_MAX_ATTEMPT, UPDATE_TEST_IMAGE, SET_SAFE_BROWSE_PASSWORD } from "../src/constants/actions";
import { getUserFeatures } from "../src/selectors/user";

// constants
const playlistStatusConstants = {
  INREVIEW: "inreview",
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived"
};

export const SET_ASSIGNMENT = "[assignments] set assignment"; // TODO remove cyclic dependency
export const CREATE_PLAYLIST_REQUEST = "[playlist] create playlist request";
export const CREATE_PLAYLIST_SUCCESS = "[playlists] create playlist success";
export const CREATE_PLAYLIST_ERROR = "[playlists] create playlist error";

export const UPDATE_PLAYLIST_REQUEST = "[playlists] update playlist request";
export const UPDATE_PLAYLIST_SUCCESS = "[playlists] update playlist success";
export const UPDATE_PLAYLIST_ERROR = "[playlists] update playlist error";
export const UPDATE_PLAYLIST = "[playlists] update playlist ";

export const RECEIVE_PLAYLIST_BY_ID_REQUEST = "[playlists] receive playlist by id request";
export const RECEIVE_PLAYLIST_BY_ID_SUCCESS = "[playlists] receive playlist by id success";
export const RECEIVE_PLAYLIST_BY_ID_ERROR = "[playlists] receive playlist by id error";

export const SET_TEST_DATA = "[playlists] set playlist data";
export const SET_DEFAULT_TEST_DATA = "[playlists] set default playlist data";
export const SET_TEST_EDIT_ASSIGNED = "[playlists] set edit assigned";
export const TEST_SHARE = "[playlists] send playlist share request";
export const PLAYLIST_PUBLISH = "[playlists] publish playlist";
export const UPDATE_TEST_STATUS = "[playlists] update playlist status";
export const CLEAR_TEST_DATA = "[playlists] clear playlist data";
export const TEST_CREATE_SUCCESS = "[playlists] create playlist succes";
export const SET_REGRADE_OLD_TESTID = "[playlists] set regrade old test_id";
export const UPDATE_ENTITY_DATA = "[playlists] update entity data";
export const RECEIVE_SHARED_USERS_LIST = "[playlists] receive shared users list";
export const UPDATE_SHARED_USERS_LIST = "[playlists] update shared with users list";
export const DELETE_SHARED_USER = "[playlists] delete share user from list";
export const ADD_MODULE = "[playlists] Add new module";
export const UPDATE_MODULE = "[playlists] Update module data";
export const DELETE_MODULE = "[playlists] Delete module";
export const ORDER_MODULES = "[playlists] Resequence modules";
export const ORDER_TESTS = "[playlists] Resequence tests in module";
export const ADD_TEST_IN_PLAYLIST = "[playlists] add test to module";
export const ADD_TEST_IN_PLAYLIST_BULK = "[playlists] add tests to module in bulk";
export const DELETE_TEST_FROM_PLAYLIST_BULK = "[playlists] remove test from module in Bulk";
export const SET_USER_CUSTOMIZE = "[playlists] set user customize";
export const REMOVE_TEST_FROM_MODULE = "[playlists] remove test from module";
export const REMOVE_TEST_FROM_PLAYLIST = "[playlists] remove test from playlist";
export const MOVE_CONTENT = "[playlists] move content in playlist";
export const CHANGE_PLAYLIST_THEME = "[playlists] change playlist theme";
// actions

export const receivePlaylistByIdAction = id => ({
  type: RECEIVE_PLAYLIST_BY_ID_REQUEST,
  payload: { id }
});

export const receivePlaylistByIdSuccess = entity => ({
  type: RECEIVE_PLAYLIST_BY_ID_SUCCESS,
  payload: { entity }
});

export const receivePlaylistByIdError = error => ({
  type: RECEIVE_PLAYLIST_BY_ID_ERROR,
  payload: { error }
});

export const createPlaylistAction = (data, toReview = false) => ({
  type: CREATE_PLAYLIST_REQUEST,
  payload: { data, toReview }
});

export const createPlaylistSuccessAction = entity => ({
  type: CREATE_PLAYLIST_SUCCESS,
  payload: { entity }
});

export const createPlaylistErrorAction = error => ({
  type: CREATE_PLAYLIST_ERROR,
  payload: { error }
});

export const updatePlaylistAction = (id, data, updateLocal) => ({
  type: UPDATE_PLAYLIST_REQUEST,
  payload: { id, data, updateLocal }
});

export const updatePlaylistSuccessAction = entity => ({
  type: UPDATE_PLAYLIST_SUCCESS,
  payload: { entity }
});

export const updatePlaylistErrorAction = error => ({
  type: UPDATE_PLAYLIST_ERROR,
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

export const changePlaylistThemeAction = (payload = {}) => ({
  type: CHANGE_PLAYLIST_THEME,
  payload
});

export const setTestEditAssignedAction = createAction(SET_TEST_EDIT_ASSIGNED);

export const sendTestShareAction = createAction(TEST_SHARE);
export const publishPlaylistAction = createAction(PLAYLIST_PUBLISH);
export const updatePlaylistStatusAction = createAction(UPDATE_TEST_STATUS);
export const setRegradeOldIdAction = createAction(SET_REGRADE_OLD_TESTID);
export const updateSharedWithListAction = createAction(UPDATE_SHARED_USERS_LIST);
export const receiveSharedWithListAction = createAction(RECEIVE_SHARED_USERS_LIST);
export const deleteSharedUserAction = createAction(DELETE_SHARED_USER);
export const createNewModuleAction = createAction(ADD_MODULE);
export const updateModuleAction = createAction(UPDATE_MODULE);
export const deleteModuleAction = createAction(DELETE_MODULE);
export const resequenceModulesAction = createAction(ORDER_MODULES);
export const resequenceTestsAction = createAction(ORDER_TESTS);
export const createTestInModuleAction = createAction(ADD_TEST_IN_PLAYLIST);
export const addTestToModuleInBulkAction = createAction(ADD_TEST_IN_PLAYLIST_BULK);
export const deleteTestFromModuleInBulkAction = createAction(DELETE_TEST_FROM_PLAYLIST_BULK);
export const setUserCustomizeAction = createAction(SET_USER_CUSTOMIZE);
export const removeTestFromModuleAction = createAction(REMOVE_TEST_FROM_MODULE);
export const removeTestFromPlaylistAction = createAction(REMOVE_TEST_FROM_PLAYLIST);
export const moveContentInPlaylistAction = createAction(MOVE_CONTENT);
// reducer

const initialPlaylistState = {
  title: undefined,
  description: "",
  status: "draft",
  createdBy: {
    _id: "",
    name: ""
  },
  thumbnail: "https://cdn2.edulastic.com/default/default-test-1.jpg",
  derivedFrom: {
    name: ""
  },
  // FIXME: define schema for modules
  modules: [],
  type: "content",
  collections: [],
  grades: [],
  subjects: [],
  version: 1,
  tags: [],
  active: 1,
  customize: false,
  bgColor: themeColor,
  textColor: white
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

const createNewModuleState = (title, description) => ({
  title,
  description,
  data: []
});

const createNewTestInModule = test => ({
  contentId: test._id,
  contentTitle: test.title,
  contentType: "test",
  standardIdentifiers: test.standardIdentifiers
});

const removeTestFromPlaylist = (playlist, payload) => {
  const { moduleIndex, itemId } = payload;
  let newPlaylist;
  if (moduleIndex >= 0) {
    newPlaylist = produce(playlist, draft => {
      draft.modules[payload.moduleIndex].data = draft.modules[payload.moduleIndex].data.filter(
        content => content.contentId !== payload.itemId
      );
    });
  } else {
    newPlaylist = produce(playlist, draft => {
      draft.modules.map(mod => {
        mod.data = mod.data.filter(data => data.contentId !== itemId);
        return mod;
      });
    });
  }
  message.success("Test removed from playlist");
  return newPlaylist;
};

const removeTestFromPlaylistBulk = (playlist, payload) => {
  const { testIds } = payload;
  const newPlaylist = produce(playlist, draft => {
    draft.modules.forEach((obj, key) => {
      draft.modules[key].data = draft.modules[key].data.filter(content => !testIds.includes(content.contentId));
    });
  });
  return newPlaylist;
};

const moveContentInPlaylist = (playlist, payload) => {
  const { toModuleIndex, toContentIndex, fromModuleIndex, fromContentIndex } = payload;
  let newPlaylist;
  if (!toContentIndex) {
    newPlaylist = produce(playlist, draft => {
      if (toModuleIndex !== 0 && !toModuleIndex) {
        return message.error("Invalid module selected");
      }
      draft.modules[toModuleIndex].data.push(draft.modules[fromModuleIndex].data[fromContentIndex]);
      draft.modules[fromModuleIndex].data.splice(fromContentIndex, 1);
    });
  } else {
    newPlaylist = produce(playlist, draft => {
      if (toModuleIndex !== 0 && !toModuleIndex) {
        return message.error("Invalid module selected");
      }
      draft.modules[toModuleIndex].data.splice(
        toContentIndex,
        0,
        draft.modules[fromModuleIndex].data[fromContentIndex]
      );
      draft.modules[fromModuleIndex].data.splice(fromContentIndex, 1);
    });
  }
  return newPlaylist;
};

function addModuleToPlaylist(playlist, payload) {
  const newPlaylist = produce(playlist, draft => {
    const newModule = createNewModuleState(payload.title || payload.moduleName, payload.description);
    if (payload.afterModuleIndex !== undefined) {
      draft.modules.splice(payload.afterModuleIndex, 0, newModule);
    } else {
      draft.modules.push(newModule);
    }
    return draft;
  });
  message.success("Module Added to playlist");
  return newPlaylist;
}

function updateModuleInPlaylist(playlist, payload) {
  const { id, title, description } = payload;
  const newPlaylist = produce(playlist, draft => {
    if (payload !== undefined) {
      if (title) {
        draft.modules[id].title = title;
        draft.modules[id].description = description;
        message.success("Module updated successfully");
      } else {
        message.error("Module name cannot be empty");
      }
    } else {
      message.error("Error updating module in playlist");
    }
    return draft;
  });
  return newPlaylist;
}

function deleteModuleFromPlaylist(playlist, payload) {
  const newPlaylist = produce(playlist, draft => {
    if (payload !== undefined) {
      draft.modules.splice(payload, 1);
      message.success("Module Removed from playlist");
    } else {
      message.error("Error removing module from playlist");
    }
    return draft;
  });
  return newPlaylist;
}

function resequenceModulesInPlaylist(playlist, payload) {
  const { oldIndex, newIndex } = payload;
  const newPlaylist = produce(playlist, draft => {
    const obj = draft.modules.splice(oldIndex, 1);
    draft.modules.splice(newIndex, 0, obj[0]);
    return draft;
  });
  return newPlaylist;
}

function resequenceTestsInModule(playlist, payload) {
  const { oldIndex, newIndex, mIndex } = payload;
  console.log("playlist", playlist);
  const newPlaylist = produce(playlist, draft => {
    const obj = draft.modules[mIndex].data.splice(oldIndex, 1);
    draft.modules[mIndex].data.splice(newIndex, 0, obj[0]);
    return draft;
  });
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

function addTestToModuleInBulk(entity, payload) {
  const { tests, moduleIndex } = payload;
  entity.modules[moduleIndex] = produce(entity.modules[moduleIndex], draft => {
    tests.forEach(test => draft.data.push(createNewTestInModule(test)));
    return draft;
  });
  return entity;
}

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_MODULE: {
      const newEntity = addModuleToPlaylist(state.entity, payload);
      return { ...state, entity: newEntity };
    }
    case UPDATE_MODULE: {
      const newEntity = updateModuleInPlaylist(state.entity, payload);
      return { ...state, entity: newEntity };
    }
    case DELETE_MODULE: {
      const newEntity = deleteModuleFromPlaylist(state.entity, payload);
      return { ...state, entity: newEntity };
    }
    case ORDER_MODULES: {
      const newEntity = resequenceModulesInPlaylist(state.entity, payload);
      return { ...state, entity: newEntity };
    }
    case ORDER_TESTS: {
      const newEntity = resequenceTestsInModule(state.entity, payload);
      return { ...state, entity: newEntity };
    }
    case ADD_TEST_IN_PLAYLIST: {
      const newEntity = addTestToModule(state.entity, payload);
      return {
        ...state,
        entity: newEntity
      };
    }
    case ADD_TEST_IN_PLAYLIST_BULK: {
      const newEntity = addTestToModuleInBulk(state.entity, payload);
      return {
        ...state,
        entity: newEntity
      };
    }
    case DELETE_TEST_FROM_PLAYLIST_BULK: {
      const newEntity = removeTestFromPlaylistBulk(state.entity, payload);
      return { ...state, entity: newEntity };
    }
    case REMOVE_TEST_FROM_MODULE: {
      const newEntity = removeTestFromPlaylist(state.entity, payload);
      return { ...state, entity: newEntity };
    }
    case MOVE_CONTENT: {
      const newEntity = moveContentInPlaylist(state.entity, payload);
      return { ...state, entity: newEntity };
    }
    case REMOVE_TEST_FROM_PLAYLIST: {
      const newEntity = removeTestFromPlaylist(state.entity, payload);
      return { ...state, entity: newEntity };
    }
    case UPDATE_PLAYLIST: {
      return { ...state, entity: payload.updatedModule };
    }
    case SET_DEFAULT_TEST_DATA:
      return { ...state, entity: { ...initialPlaylistState } };
    case RECEIVE_PLAYLIST_BY_ID_REQUEST:
      return { ...state, loading: true };
    case SET_TEST_EDIT_ASSIGNED:
      return { ...state, editAssigned: true };
    case SET_REGRADE_OLD_TESTID:
      return { ...state, regradeTestId: payload };
    case RECEIVE_PLAYLIST_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        entity: {
          ...payload.entity
        }
      };
    case RECEIVE_PLAYLIST_BY_ID_ERROR:
      return { ...state, loading: false, error: payload.error };

    case CREATE_PLAYLIST_REQUEST:
    case UPDATE_PLAYLIST_REQUEST:
      return { ...state, creating: true };
    case CREATE_PLAYLIST_SUCCESS:
    case UPDATE_PLAYLIST_SUCCESS: {
      const { testItems, ...entity } = payload.entity;
      return {
        ...state,
        entity: { ...state.entity, ...entity },
        creating: false
      };
    }
    case UPDATE_ENTITY_DATA: {
      const { testItems: items, ...dataRest } = payload.entity;
      return {
        ...state,
        entity: { ...state.entity, ...dataRest }
      };
    }
    case CREATE_PLAYLIST_ERROR:
    case UPDATE_PLAYLIST_ERROR:
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
        entity: {
          ...state.entity,
          customize: payload
        }
      };
    case CHANGE_PLAYLIST_THEME: {
      const { bgColor = themeColor, textColor = white } = payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          bgColor,
          textColor
        }
      };
    }
    default:
      return state;
  }
};

// selectors

export const stateSelector = state => state.playlist;

export const getPlaylistSelector = createSelector(
  stateSelector,
  state => state.entity
);

export const getPlaylistEntitySelector = createSelector(
  stateSelector,
  state => state.entity
);

export const getTestStatusSelector = createSelector(
  getPlaylistEntitySelector,
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
  state => get(state.entity, "customize", true)
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
            sharedType,
            permission,
            sharedId
          });
        });
      } else {
        flattenUsers.push({
          userName: sharedType,
          sharedType,
          permission,
          sharedId
        });
      }
    });
    return flattenUsers;
  }
);

export const getTestItemsRowsSelector = createSelector(
  getPlaylistSelector,
  state => state
);

// saga
function* receivePlaylistByIdSaga({ payload }) {
  try {
    const entity = yield call(curriculumSequencesApi.getCurriculums, payload.id, { data: true });
    yield put(receivePlaylistByIdSuccess(entity));
  } catch (err) {
    const errorMessage = "Receive playlist by id is failing";
    yield call(message.error, errorMessage);
    yield put(receivePlaylistByIdError(errorMessage));
  }
}

function* createPlaylistSaga({ payload }) {
  const { title } = payload.data;
  try {
    if (title !== undefined && !title.trim().length) {
      return yield call(message.error(" Name field cannot be empty "));
    }
    const dataToSend = omit(payload.data, ["sharedWith", "createdDate", "updatedDate"]);

    const entity = yield call(curriculumSequencesApi.create, { data: dataToSend });
    const hash = payload.toReview ? "#review" : "";
    yield put(createPlaylistSuccessAction(entity));
    yield put(replace(`/author/playlists/${entity._id}/edit${hash}`));

    yield call(message.success, "Playlist created");
  } catch (err) {
    const errorMessage = "Failed to create playlist!";
    yield call(message.error, errorMessage);
    yield put(createPlaylistErrorAction(errorMessage));
  }
}

function* updatePlaylistSaga({ payload }) {
  try {
    // remove createdDate and updatedDate
    const oldId = payload.data._id;
    const dataToSend = omit(payload.data, [
      "updatedDate",
      "createdDate",
      "sharedWith",
      "authors",
      "sharedType",
      "_id",
      "__v"
    ]);

    dataToSend.modules = dataToSend.modules.map(mod => {
      mod.data = mod.data.map(test => omit(test, ["standards", "alignment", "assignments"]));
      return mod;
    });

    const entity = yield call(curriculumSequencesApi.update, { id: oldId, data: dataToSend });

    yield put(updatePlaylistSuccessAction(entity));
    const newId = entity._id;
    if (oldId !== newId && newId) {
      yield call(message.success, "Playlist versioned");
      yield put(push(`/author/playlists/${newId}/versioned/old/${oldId}`));
    } else {
      yield call(message.success, "Update Successful");
    }
  } catch (err) {
    const errorMessage = "Update playlist is failing";
    yield call(message.error, errorMessage);
    yield put(updatePlaylistErrorAction(errorMessage));
  }
}

function* shareTestSaga({ payload }) {
  try {
    yield call(contentSharingApi.shareContent, payload);
    yield put(receiveSharedWithListAction(payload.testId));
    yield call(message.success, "Successfully shared");
  } catch (e) {
    const errorMessage = "Sharing failed";
    yield call(message.error, errorMessage);
  }
}

function* publishPlaylistSaga({ payload }) {
  try {
    const { _id: id } = payload;
    const data = yield select(getPlaylistSelector);
    const features = yield select(getUserFeatures);
    if ((features.isCurator || features.isPublisherAuthor) && !get(data, "collections", []).length) {
      yield call(message.error, "Playlist is not associated with any collection.");
      return;
    }
    const dataToSend = omit(data, ["updatedDate", "createdDate", "sharedWith", "authors", "sharedType", "_id", "__v"]);
    dataToSend.modules = dataToSend.modules.map(mod => {
      mod.data = mod.data.map(test => omit(test, ["standards", "alignment", "assignments"]));
      return mod;
    });

    const updatedEntityData = yield call(curriculumSequencesApi.update, { id, data: dataToSend });
    yield put(updatePlaylistSuccessAction(updatedEntityData));

    yield call(message.success, "Update Successful");

    if (features.isPublisherAuthor) {
      yield call(curriculumSequencesApi.updatePlaylistStatus, {
        playlistId: id,
        status: playlistStatusConstants.INREVIEW
      });
      yield put(updatePlaylistStatusAction(playlistStatusConstants.INREVIEW));
      yield call(message.success, "Review request is submitted successfully.");
    } else {
      yield call(curriculumSequencesApi.publishPlaylist, id);
      yield put(updatePlaylistStatusAction(playlistStatusConstants.PUBLISHED));
      yield call(message.success, "Successfully published");
    }
    yield put(push(`/author/playlists/${id}`));
  } catch (error) {
    yield call(message.error, error?.data?.message || "publish failed");
  }
}

function* receiveSharedWithListSaga({ payload }) {
  try {
    const result = yield call(contentSharingApi.getSharedUsersList, payload);
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
    yield call(contentSharingApi.deleteSharedUser, payload);
    yield put(receiveSharedWithListAction(payload.testId));
  } catch (e) {
    const errorMessage = "delete shared user is failing";
    yield call(message.error, errorMessage);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_PLAYLIST_BY_ID_REQUEST, receivePlaylistByIdSaga),
    yield takeEvery(CREATE_PLAYLIST_REQUEST, createPlaylistSaga),
    yield takeEvery(UPDATE_PLAYLIST_REQUEST, updatePlaylistSaga),
    yield takeEvery(TEST_SHARE, shareTestSaga),
    yield takeEvery(PLAYLIST_PUBLISH, publishPlaylistSaga),
    yield takeEvery(RECEIVE_SHARED_USERS_LIST, receiveSharedWithListSaga),
    yield takeEvery(DELETE_SHARED_USER, deleteSharedUserSaga)
  ]);
}
