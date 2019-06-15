import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import { test } from "@edulastic/constants";
import { call, put, all, takeEvery, select } from "redux-saga/effects";
import { push, replace } from "connected-react-router";
import { message } from "antd";
import { keyBy as _keyBy, omit, get } from "lodash";
import { testsApi, assignmentApi, contentSharingApi } from "@edulastic/api";
import moment from "moment";
import { SET_MAX_ATTEMPT, UPDATE_TEST_IMAGE, SET_SAFE_BROWSE_PASSWORD } from "../src/constants/actions";
import { loadQuestionsAction } from "../sharedDucks/questions";

// constants

const testItemStatusConstants = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived"
};

export const SET_ASSIGNMENT = "[assignments] set assignment"; // TODO remove cyclic dependency
export const CREATE_TEST_REQUEST = "[tests] create test request";
export const CREATE_TEST_SUCCESS = "[tests] create test success";
export const CREATE_TEST_ERROR = "[tests] create test error";

export const UPDATE_TEST_REQUEST = "[tests] update test request";
export const UPDATE_TEST_SUCCESS = "[tests] update test success";
export const UPDATE_TEST_ERROR = "[tests] update test error";

export const RECEIVE_TEST_BY_ID_REQUEST = "[tests] receive test by id request";
export const RECEIVE_TEST_BY_ID_SUCCESS = "[tests] receive test by id success";
export const RECEIVE_TEST_BY_ID_ERROR = "[tests] receive test by id error";

export const SET_TEST_DATA = "[tests] set test data";
export const SET_DEFAULT_TEST_DATA = "[tests] set default test data";
export const SET_TEST_EDIT_ASSIGNED = "[tests] set edit assigned";
export const REGRADE_TEST = "[regrade] set regrade data";
export const TEST_SHARE = "[test] send test share request";
export const TEST_PUBLISH = "[test] publish test";
export const UPDATE_TEST_STATUS = "[test] update test status";
export const CLEAR_TEST_DATA = "[test] clear test data";
export const TEST_CREATE_SUCCESS = "[test] create test succes";
export const SET_REGRADE_OLD_TESTID = "[test] set regrade old test_id";
export const UPDATE_ENTITY_DATA = "[test] update entity data";
export const RECEIVE_SHARED_USERS_LIST = "[test] receive shared users list";
export const UPDATE_SHARED_USERS_LIST = "[test] update shared with users list";
export const DELETE_SHARED_USER = "[test] delete share user from list";
export const SET_TEST_DATA_AND_SAVE = "[test] set test data and update test";
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

export const setTestDataAndUpdateAction = data => ({
  type: SET_TEST_DATA_AND_SAVE,
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
// reducer

export const createBlankTest = () => ({
  title: `Untitled Test - ${moment().format("MM/DD/YYYY HH:mm")}`,
  description: "",
  releaseScore: test.releaseGradeLabels.DONT_RELEASE,
  maxAttempts: 1,
  testType: test.type.ASSESSMENT,
  markAsDone: test.completionTypes.AUTOMATICALLY,
  generateReport: true,
  safeBrowser: false,
  sebPassword: "",
  shuffleQuestions: false,
  shuffleAnswers: false,
  calcType: test.calculatorKeys[0],
  answerOnPaper: false,
  assignmentPassword: "",
  requirePassword: false,
  maxAnswerChecks: 0,
  scoringType: test.evalTypeLabels.PARTIAL_CREDIT,
  penalty: false,
  status: "draft",
  thumbnail: "https://ak0.picdn.net/shutterstock/videos/4001980/thumb/1.jpg",
  createdBy: {
    id: "",
    firstName: "",
    lastName: "",
    email: ""
  },
  tags: [],
  scoring: {
    total: 0,
    testItems: []
  },
  testItems: [],
  standardsTag: {
    curriculum: "",
    standards: []
  },
  grades: [],
  subjects: [],
  courses: [],
  collectionName: "",
  analytics: {
    usage: "0",
    likes: "0"
  }
});

const initialState = {
  entity: createBlankTest(),
  error: null,
  page: 1,
  limit: 20,
  count: 0,
  loading: false,
  creating: false,
  sharedUsersList: []
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DEFAULT_TEST_DATA:
      return { ...state, entity: createBlankTest() };
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
  const { _id: oldId, versioned: regrade = false, title, requirePassword = false } = payload.data;
  try {
    if (!title) {
      return yield call(message.error(" Name field cannot be empty "));
    }
    if (!requirePassword) {
      delete payload.data.assignmentPassword;
    }
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
    if (!payload.data.requirePassword) {
      delete payload.data.assignmentPassword;
    } else if (
      !payload.data.assignmentPassword ||
      payload.data.assignmentPassword.length < 6 ||
      payload.data.assignmentPassword.length > 25
    ) {
      yield call(message.error, "Please add a valid password.");
      return;
    }
    const entity = yield call(testsApi.update, payload);
    yield put(updateTestSuccessAction(entity));
    const newId = entity._id;
    if (oldId != newId && newId) {
      if (!payload.assignFlow) {
        yield call(message.success, "Test versioned");
      }
      yield put(push(`/author/tests/${newId}/versioned/old/${oldId}`));
    } else {
      if (!payload.assignFlow) {
        yield call(message.success, "Test saved as Draft");
      }
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
    yield call(contentSharingApi.shareContent, payload);
    yield put(receiveSharedWithListAction({ contentId: payload.contentId, contentType: payload.data.contentType }));
    yield call(message.success, "Successfully shared");
  } catch (e) {
    const errorMessage = "Sharing failed";
    yield call(message.error, errorMessage);
  }
}

function* publishTestSaga({ payload }) {
  try {
    let { _id: id, test, assignFlow } = payload;
    yield call(updateTestSaga, { payload: { id, data: test, assignFlow: true } });
    yield call(testsApi.publishTest, id);
    yield put(updateTestStatusAction(testItemStatusConstants.PUBLISHED));
    if (!assignFlow) {
      yield call(message.success, "Successfully published");
    }
    const oldId = yield select(state => state.tests.regradeTestId);
    if (assignFlow) {
      yield put(push(`/author/assignments/${id}`));
    } else {
      if (oldId) {
        yield put(push(`/author/assignments/regrade/new/${id}/old/${oldId}`));
        yield put(setRegradeOldIdAction(undefined));
      } else {
        yield put(push(`/author/tests/${id}/publish`));
      }
    }
  } catch (e) {
    const errorMessage = "publish failed";
    yield call(message.error, errorMessage);
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
    const authors = yield call(contentSharingApi.deleteSharedUser, payload);
    yield put(receiveSharedWithListAction({ contentId: payload.contentId, contentType: "TEST" }));
  } catch (e) {
    const errorMessage = "delete shared user is failing";
    yield call(message.error, errorMessage);
  }
}

function* setTestDataAndUpdateSaga({ payload }) {
  try {
    yield put(setTestDataAction(payload.data));
    const { title } = payload.data;
    if (!title) {
      return yield call(message.error("Name field cannot be empty"));
    }
    if (!payload.data.requirePassword) {
      delete payload.data.assignmentPassword;
    } else if (!payload.data.assignmentPassword) {
      yield call(message.error, "Please add a valid password.");
      return;
    }
    const entity = yield call(testsApi.create, payload.data);
    yield put({
      type: UPDATE_ENTITY_DATA,
      payload: {
        entity
      }
    });
    yield put(replace(`/author/tests/${entity._id}`));
    yield call(message.success, `Your work is automatically saved as a draft assessment named ${entity.title}`);
  } catch (e) {
    const errorMessage = "Auto Save of Test is failing";
    yield call(message.error, errorMessage);
  }
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
    yield takeEvery(SET_TEST_DATA_AND_SAVE, setTestDataAndUpdateSaga),
    yield takeEvery(DELETE_SHARED_USER, deleteSharedUserSaga)
  ]);
}

// selectors

export const stateSelector = state => state.tests;

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
  state =>
    state.testItems.map(item => {
      if (!item || !item.rows) return [];
      return item.rows.map(row => ({
        ...row,
        widgets: row.widgets.map(widget => {
          let referencePopulate = {
            data: null
          };

          if (item.data && item.data.questions && item.data.questions.length) {
            referencePopulate = item.data.questions.find(q => q._id === widget.reference);
          }

          if (!referencePopulate && item.data && item.data.resources && item.data.resources.length) {
            referencePopulate = item.data.resources.find(r => r._id === widget.reference);
          }

          return {
            ...widget,
            referencePopulate
          };
        })
      }));
    })
);
