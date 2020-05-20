import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import { test, roleuser, questionType, test as testConst, assignmentPolicyOptions } from "@edulastic/constants";
import { call, put, all, takeEvery, takeLatest, select, actionChannel, take } from "redux-saga/effects";
import { push, replace } from "connected-react-router";
import { message } from "antd";
import {
  keyBy as _keyBy,
  omit,
  get,
  uniqBy,
  uniq as _uniq,
  isEmpty,
  identity,
  differenceBy,
  round,
  pick
} from "lodash";
import { testsApi, assignmentApi, contentSharingApi, tagsApi, passageApi, testItemsApi } from "@edulastic/api";
import moment from "moment";
import nanoid from "nanoid";
import produce from "immer";
import { helpers } from "@edulastic/common";
import { createGroupSummary } from "./utils";
import {
  SET_MAX_ATTEMPT,
  UPDATE_TEST_IMAGE,
  SET_SAFE_BROWSE_PASSWORD,
  ADD_ITEM_EVALUATION,
  CHANGE_PREVIEW,
  APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS
} from "../src/constants/actions";
import { loadQuestionsAction, getQuestionsArraySelector, UPDATE_QUESTION } from "../sharedDucks/questions";
import { evaluateItem } from "../src/utils/evalution";
import createShowAnswerData from "../src/utils/showAnswer";
import { getItemsSubjectAndGradeAction, setTestItemsAction } from "./components/AddItems/ducks";
import { getUserRole, getUserOrgData, getUserIdSelector } from "../src/selectors/user";
import { receivePerformanceBandSuccessAction } from "../PerformanceBand/ducks";
import { receiveStandardsProficiencySuccessAction } from "../StandardsProficiency/ducks";
import {
  updateItemDocBasedSaga,
  togglePublishWarningModalAction,
  PROCEED_PUBLISH_ACTION,
  hasStandards
} from "../ItemDetail/ducks";
import { saveUserWorkAction } from "../../assessment/actions/userWork";
import { isFeatureAccessible } from "../../features/components/FeaturesSwitch";
import { getDefaultSettings } from "../../common/utils/helpers";
import { updateAssingnmentSettingsAction } from "../AssignTest/duck";
import { SET_ITEM_SCORE } from "../src/ItemScore/ducks";
import { UPLOAD_STATUS, uploadTestStatusAction, setJobIdsAction } from "../ImportTest/ducks";
import { getIsloadingAssignmentSelector } from "./components/Assign/ducks";

// constants

const { ITEM_GROUP_TYPES, ITEM_GROUP_DELIVERY_TYPES } = test;
const testItemStatusConstants = {
  INREVIEW: "inreview",
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived"
};

export const NewGroup = {
  type: ITEM_GROUP_TYPES.STATIC /* Default : static */,
  groupName: "Group 1" /* For now, auto-generated. */,
  items: [],
  deliveryType: ITEM_GROUP_DELIVERY_TYPES.ALL,
  index: 0
};
export const createWidget = ({ id, type, title }) => ({
  widgetType: type === "sectionLabel" ? "resource" : "question",
  type,
  title,
  reference: id,
  tabIndex: 0
});

export const getStaticGroupItemIds = _test =>
  (
    _test.itemGroups.flatMap((itemGroup = {}) => {
      if (itemGroup.type === ITEM_GROUP_TYPES.STATIC) {
        return itemGroup?.items.map(item => item._id) || [];
      }
      return [];
    }) || []
  ).filter(e => !!e);

const transformItemGroupsUIToMongo = (itemGroups, scoring = {}) =>
  produce(itemGroups, _itemGroups => {
    for (const itemGroup of _itemGroups) {
      if (itemGroup.type === ITEM_GROUP_TYPES.STATIC) {
        const isLimitedDeliveryType = itemGroup.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM;
        // For delivery type:LIMITED scoring should be as how item level scoring works
        itemGroup.items = itemGroup.items.map(o => ({
          itemId: o._id,
          maxScore: isLimitedDeliveryType ? 1 : scoring[o._id] || helpers.getPoints(o),
          questions: o.data
            ? helpers.getQuestionLevelScore(
                { ...o, isLimitedDeliveryType },
                o.data.questions,
                helpers.getPoints(o),
                scoring[o._id]
              )
            : {}
        }));
      } else itemGroup.items = [];
    }
  });

export const getTestGradeAndSubject = (group, testGrades, testSubjects, testTags) => {
  if (group.type === ITEM_GROUP_TYPES.AUTOSELECT) {
    return {
      testGrades: _uniq([...testGrades, ...group.standardDetails.grades]),
      testSubjects: _uniq([...testSubjects, group.standardDetails.subject]),
      testTags: _uniq([...testTags, ...(group.tags || [])])
    };
  }
  return { testGrades, testSubjects };
};
//user is created ? then he is author not authored and in authors list he is co-author
const authorType = (userId, { createdBy, authors }) => {
  if (userId === createdBy._id) {
    return "author";
  }
  if (authors.some(item => item._id === userId)) {
    return "co-author";
  }
  return false;
};

const isRegraded = (isAuthor, entity, requestedTestId) => {
  if (
    isAuthor &&
    entity._id !== requestedTestId &&
    entity.previousTestId === requestedTestId &&
    entity.status === "published" &&
    entity.isUsed
  ) {
    return true;
  }
  return false;
};

export const SET_ASSIGNMENT = "[assignments] set assignment"; // TODO remove cyclic dependency
export const CREATE_TEST_REQUEST = "[tests] create test request";
export const CREATE_TEST_SUCCESS = "[tests] create test success";
export const CREATE_TEST_ERROR = "[tests] create test error";

export const UPDATE_TEST_REQUEST = "[tests] update test request";
export const UPDATE_TEST_DOC_BASED_REQUEST = "[tests] update doc based test request";
export const UPDATE_TEST_SUCCESS = "[tests] update test success";
export const UPDATE_TEST_ERROR = "[tests] update test error";

export const RECEIVE_TEST_BY_ID_REQUEST = "[tests] receive test by id request";
export const RECEIVE_TEST_BY_ID_SUCCESS = "[tests] receive test by id success";
export const REMOVE_TEST_ENTITY = "[tests] remove entity";
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
export const SET_CREATED_ITEM_TO_TEST = "[test] set created item to test";
export const CLEAR_CREATED_ITEMS_FROM_TEST = "[test] clear createdItems from test";
export const PREVIEW_CHECK_ANSWER = "[test] check answer for preview modal";
export const PREVIEW_SHOW_ANSWER = "[test] show answer for preview modal";
export const REPLACE_TEST_ITEMS = "[test] replace test items";
export const UPDATE_TEST_DEFAULT_IMAGE = "[test] update default thumbnail image";
export const SET_PASSAGE_ITEMS = "[tests] set passage items";
export const SET_AND_SAVE_PASSAGE_ITEMS = "[tests] set and save passage items";
export const GET_ALL_TAGS_IN_DISTRICT = "[test] get all tags in district";
export const SET_ALL_TAGS = "[test] set all tags";
export const ADD_NEW_TAG = "[test] add new tag";
export const RECEIVE_DEFAULT_TEST_SETTINGS = "[tests] receive default test settings";
export const SET_DEFAULT_TEST_TYPE_PROFILES = "[tests] set default test type profiles";
export const PUBLISH_FOR_REGRADE = "[tests] publish test for regrade";
export const DELETE_ANNOTATION = "[tests] delete annotations from test";
export const SET_LOADING_TEST_PAGE = "[tests] set loading";
export const DUPLICATE_TEST_REQUEST = "[tests] duplicate request";
export const UPDATE_TEST_AND_NAVIGATE = "[tests] update test and navigate";
export const APPROVE_OR_REJECT_SINGLE_TEST_REQUEST = "[test page] approve or reject single test request";
export const APPROVE_OR_REJECT_SINGLE_TEST_SUCCESS = "[test page] approve or reject single test success";
export const UPDATE_GROUP_DATA = "[tests] update group data";
export const ADD_NEW_GROUP = "[tests] add new group";
export const SET_CURRENT_GROUP_INDEX = "[tests] set current group index";
export const DELETE_ITEMS_GROUP = "[tests] delete items group";
export const ADD_ITEMS_TO_AUTOSELECT_GROUPS_REQUEST = "[test] add items to autoselect groups request";
export const ADD_ITEMS_TO_AUTOSELECT_GROUP = "[test] add items to autoselect group";
export const SET_TEST_PASSAGE_AFTER_CREATE = "[test] set passage after passage create";
export const UPDATE_LAST_USED_COLLECTION_LIST = "[test] update recent collections";
export const UPDATE_CREATING = "[test] create test request initiated";
export const SET_DEFAULT_SETTINGS_LOADING = "[test] deafult settings loading";
export const SET_AUTOSELECT_ITEMS_FETCHING_STATUS = "[test] set autoselect items fetching status";
export const SET_REGRADING_STATE = "[test] set regrading state";

// actions

export const previewCheckAnswerAction = createAction(PREVIEW_CHECK_ANSWER);
export const previewShowAnswerAction = createAction(PREVIEW_SHOW_ANSWER);
export const replaceTestItemsAction = createAction(REPLACE_TEST_ITEMS);
export const updateDefaultThumbnailAction = createAction(UPDATE_TEST_DEFAULT_IMAGE);
export const setPassageItemsAction = createAction(SET_PASSAGE_ITEMS);
export const setAndSavePassageItemsAction = createAction(SET_AND_SAVE_PASSAGE_ITEMS);
export const getAllTagsAction = createAction(GET_ALL_TAGS_IN_DISTRICT);
export const setAllTagsAction = createAction(SET_ALL_TAGS);
export const getDefaultTestSettingsAction = createAction(RECEIVE_DEFAULT_TEST_SETTINGS);
export const publishForRegradeAction = createAction(PUBLISH_FOR_REGRADE);
export const setTestsLoadingAction = createAction(SET_LOADING_TEST_PAGE);
export const duplicateTestRequestAction = createAction(DUPLICATE_TEST_REQUEST);
export const updateTestAndNavigateAction = createAction(UPDATE_TEST_AND_NAVIGATE);
export const removeTestEntityAction = createAction(REMOVE_TEST_ENTITY);
export const approveOrRejectSingleTestRequestAction = createAction(APPROVE_OR_REJECT_SINGLE_TEST_REQUEST);
export const approveOrRejectSingleTestSuccessAction = createAction(APPROVE_OR_REJECT_SINGLE_TEST_SUCCESS);
export const updateGroupDataAction = createAction(UPDATE_GROUP_DATA);
export const addNewGroupAction = createAction(ADD_NEW_GROUP);
export const setCurrentGroupIndexAction = createAction(SET_CURRENT_GROUP_INDEX);
export const deleteItemsGroupAction = createAction(DELETE_ITEMS_GROUP);
export const addItemsToAutoselectGroupsRequestAction = createAction(ADD_ITEMS_TO_AUTOSELECT_GROUPS_REQUEST);
export const addItemsToAutoselectGroupAction = createAction(ADD_ITEMS_TO_AUTOSELECT_GROUP);
export const setTestPassageAction = createAction(SET_TEST_PASSAGE_AFTER_CREATE);
export const updateTestEntityAction = createAction(SET_TEST_DATA);
export const updateLastUsedCollectionListAction = createAction(UPDATE_LAST_USED_COLLECTION_LIST);
export const setIsCreatingAction = createAction(UPDATE_CREATING);
export const setDefaultSettingsLoadingAction = createAction(SET_DEFAULT_SETTINGS_LOADING);
export const setAutoselectItemsFetchingStatusAction = createAction(SET_AUTOSELECT_ITEMS_FETCHING_STATUS);
export const setRegradingStateAction = createAction(SET_REGRADING_STATE);

export const receiveTestByIdAction = (id, requestLatest, editAssigned, isPlaylist = false) => ({
  type: RECEIVE_TEST_BY_ID_REQUEST,
  payload: { id, requestLatest, editAssigned, isPlaylist }
});

export const receiveTestByIdSuccess = entity => ({
  type: RECEIVE_TEST_BY_ID_SUCCESS,
  payload: { entity }
});

export const receiveTestByIdError = error => ({
  type: RECEIVE_TEST_BY_ID_ERROR,
  payload: { error }
});

/**
 * To create a new test from the data passed.
 * @param {object} data
 * @param {boolean} toReview
 * @param {boolean} isCartTest
 */
export const createTestAction = (data, toReview = false, isCartTest = false) => ({
  type: CREATE_TEST_REQUEST,
  payload: { data, toReview, isCartTest }
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

export const updateDocBasedTestAction = (id, data, updateLocal) => ({
  type: UPDATE_TEST_DOC_BASED_REQUEST,
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
  payload: data
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
export const setCreatedItemToTestAction = createAction(SET_CREATED_ITEM_TO_TEST);
export const clearCreatedItemsAction = createAction(CLEAR_CREATED_ITEMS_FROM_TEST);
export const addNewTagAction = createAction(ADD_NEW_TAG);
export const setDefaultTestTypeProfilesAction = createAction(SET_DEFAULT_TEST_TYPE_PROFILES);
export const deleteAnnotationAction = createAction(DELETE_ANNOTATION);

export const defaultImage = "https://cdn2.edulastic.com/default/default-test-1.jpg";

// selectors

export const stateSelector = state => state.tests;

export const playlistStateSelector = state => state.playlist;

export const getPassageItemsCountSelector = createSelector(
  stateSelector,
  state => state.passageItems.length
);

export const getTestSelector = createSelector(
  stateSelector,
  state => state.entity
);

export const getPlaylistSelector = createSelector(
  playlistStateSelector,
  state => state.entity
);

export const defaultTestTypeProfilesSelector = createSelector(
  stateSelector,
  state => state.defaultTestTypeProfiles
);

export const getDefaultThumbnailSelector = createSelector(
  stateSelector,
  state => state.thumbnail
);

export const getlastUsedCollectionListSelector = createSelector(
  stateSelector,
  state => state.lastUsedCollectionList || []
);

export const getTestEntitySelector = createSelector(
  stateSelector,
  state => state.entity
);

export const getCollectionNameSelector = createSelector(
  getTestEntitySelector,
  state => state.collectionName
);

// currently present testItems in the test.
export const getSelectedTestItemsSelector = createSelector(
  getTestEntitySelector,
  _test => _test.itemGroups.flatMap(itemGroup => itemGroup.items || []) || []
);

export const getItemGroupsSelector = createSelector(
  getTestEntitySelector,
  _test => _test.itemGroups || []
);

export const getTestItemsSelector = createSelector(
  getItemGroupsSelector,
  itemGroups =>
    itemGroups.flatMap(
      itemGroup =>
        itemGroup.items.map(item => ({
          ...item,
          groupId: itemGroup._id,
          isLimitedDeliveryType: itemGroup.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
        })) || []
    ) || []
);

export const getDisableAnswerOnPaperSelector = createSelector(
  getTestEntitySelector,
  _test =>
    // disable answer on paper feature for deliveryType:LIMITED_RANDOM or group.type:AUTOSELECT
    _test.itemGroups.some(
      group =>
        group.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM || group.type === ITEM_GROUP_TYPES.AUTOSELECT
    )
);

export const getCurentTestPassagesSelector = createSelector(
  getTestEntitySelector,
  _test => _test.passages || []
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

export const getAutoSelectItemsLoadingStatusSelector = createSelector(
  stateSelector,
  state => state.isFetchingAutoselectItems
);

export const getDefaultSettingsLoadingSelector = createSelector(
  stateSelector,
  state => state.isSettingsLoading
);

export const shouldDisableSelector = createSelector(
  getTestsLoadingSelector,
  getIsloadingAssignmentSelector,
  (testLoading, assignmentsLoading) => testLoading || assignmentsLoading
);

export const getRegradingSelector = createSelector(
  stateSelector,
  state => state.regrading
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
  getTestSelector,
  state =>
    state.itemGroups
      .flatMap(itemGroup => itemGroup.items || [])
      .map(item => {
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

// reducer
export const createBlankTest = () => ({
  title: undefined,
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
  passwordExpireIn: 15 * 60,
  passwordPolicy: test.passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF,
  maxAnswerChecks: 0,
  scoringType: test.evalTypeLabels.PARTIAL_CREDIT,
  penalty: false,
  isDocBased: false,
  status: "draft",
  thumbnail: defaultImage,
  itemGroups: [
    {
      ...NewGroup,
      _id: nanoid()
    }
  ],
  createdBy: {
    _id: "",
    name: ""
  },
  tags: [],
  scoring: {
    total: 0,
    testItems: []
  },
  standardsTag: {
    curriculum: "",
    standards: []
  },
  grades: [],
  subjects: [],
  courses: [],
  collections: [],
  analytics: {
    usage: "0",
    likes: "0"
  },
  passages: []
});

const initialState = {
  entity: createBlankTest(),
  error: null,
  page: 1,
  limit: 20,
  count: 0,
  updated: false,
  loading: false,
  creating: false,
  isSettingsLoading: false,
  thumbnail: "",
  regradeTestId: "",
  createdItems: [],
  sharedUsersList: [],
  passageItems: [],
  lastUsedCollectionList: [],
  tagsList: { playlist: [], test: [], group: [], testitem: [] },
  defaultTestTypeProfiles: {},
  currentGroupIndex: 0,
  isFetchingAutoselectItems: false,
  regrading: false
};

export const testTypeAsProfileNameType = {
  [test.type.ASSESSMENT]: "class",
  [test.type.PRACTICE]: "practice",
  [test.type.COMMON]: "common"
};

const getDefaultScales = (state, payload) => {
  const { performanceBandProfiles, standardsProficiencyProfiles, defaultTestTypeProfiles } = payload;
  const testType = testTypeAsProfileNameType[state.entity.testType];
  const bandId =
    performanceBandProfiles.find(item => item._id === defaultTestTypeProfiles?.performanceBand[testType]) || {};
  const standardId =
    standardsProficiencyProfiles.find(item => item._id === defaultTestTypeProfiles?.standardProficiency[testType]) ||
    {};
  const performanceBand = isEmpty(state.entity.performanceBand)
    ? {
        name: bandId.name,
        _id: bandId._id
      }
    : state.entity.performanceBand;
  const standardGradingScale = isEmpty(state.entity.standardGradingScale)
    ? {
        name: standardId.name,
        _id: standardId._id
      }
    : state.entity.standardGradingScale;
  return {
    performanceBand,
    standardGradingScale
  };
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DEFAULT_TEST_DATA:
      return { ...state, entity: createBlankTest(), updated: false };
    case UPDATE_TEST_DEFAULT_IMAGE:
      return { ...state, thumbnail: payload };
    case UPDATE_LAST_USED_COLLECTION_LIST:
      return { ...state, lastUsedCollectionList: payload };
    case RECEIVE_TEST_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };
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
        },
        updated: state.createdItems.length > 0
      };
    case REMOVE_TEST_ENTITY:
      return {
        ...state,
        createdItems: [],
        entity: createBlankTest()
      };
    case RECEIVE_TEST_BY_ID_ERROR:
      return { ...state, loading: false, error: payload.error };

    case DELETE_ANNOTATION: {
      const { entity = {} } = state;
      const { annotations = [] } = entity;
      return {
        ...state,
        entity: {
          ...entity,
          annotations: annotations.filter(o => o.questionId !== payload)
        }
      };
    }
    case CREATE_TEST_REQUEST:
    case UPDATE_TEST_REQUEST:
    case UPDATE_TEST_DOC_BASED_REQUEST:
      return { ...state, creating: true, error: null };
    case CREATE_TEST_SUCCESS:
    case UPDATE_TEST_SUCCESS:
      return {
        ...state,
        entity: payload.entity,
        createdItems: [],
        error: null,
        updated: false,
        creating: false
      };
    case UPDATE_ENTITY_DATA: {
      return {
        ...state,
        entity: payload.entity,
        error: null,
        updated: false
      };
    }
    case CREATE_TEST_ERROR:
    case UPDATE_TEST_ERROR:
      return { ...state, creating: false, error: payload.error };
    case SET_TEST_DATA:
      return {
        ...state,
        entity: {
          ...state.entity,
          ...payload.data
        },
        updated: true
      };
    case UPDATE_TEST_IMAGE:
      return {
        ...state,
        entity: {
          ...state.entity,
          thumbnail: payload.fileUrl
        },
        updated: true
      };
    case SET_ALL_TAGS:
      return {
        ...state,
        tagsList: { ...state.tagsList, [payload.tagType]: payload.tags }
      };
    case ADD_NEW_TAG:
      return {
        ...state,
        tagsList: {
          ...state.tagsList,
          [payload.tagType]: [...(state.tagsList[payload.tagType] || []), payload.tag]
        }
      };
    case SET_MAX_ATTEMPT:
      return {
        ...state,
        entity: {
          ...state.entity,
          maxAttempts: payload.data
        },
        updated: true
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
          itemGroups: [
            {
              ...NewGroup,
              _id: nanoid()
            }
          ],
          grades: [],
          subjects: []
        },
        updated: false,
        createdItems: [],
        thumbnail: "",
        sharedUsersList: []
      };
    case SET_CREATED_ITEM_TO_TEST:
      return {
        ...state,
        createdItems: [...state.createdItems, payload],
        updated: true
      };
    case TEST_CREATE_SUCCESS:
      return {
        ...state,
        updated: false,
        creating: false
      };
    case UPDATE_SHARED_USERS_LIST:
      return {
        ...state,
        sharedUsersList: payload
      };
    case CLEAR_CREATED_ITEMS_FROM_TEST:
      return {
        ...state,
        createdItems: []
      };
    case REPLACE_TEST_ITEMS:
      return {
        ...state,
        entity: {
          ...payload
        }
      };
    case SET_PASSAGE_ITEMS:
      return {
        ...state,
        passageItems: [...payload]
      };
    case SET_DEFAULT_TEST_TYPE_PROFILES:
      // eslint-disable-next-line no-case-declarations
      const { performanceBand = {}, standardGradingScale = {} } = getDefaultScales(state, payload);
      return {
        ...state,
        defaultTestTypeProfiles: payload.defaultTestTypeProfiles,
        entity: {
          ...state.entity,
          performanceBand,
          standardGradingScale
        }
      };
    case SET_LOADING_TEST_PAGE:
      return { ...state, loading: payload };
    case UPDATE_QUESTION:
      return produce(state, _state => {
        if (_state.entity.isDocBased) {
          const newSubjects = payload?.alignment?.map(x => x.subject) || [];
          const newGrades = payload?.alignment?.flatMap(x => x.grades) || [];
          _state.entity.grades = _uniq([..._state.entity.grades, ...newGrades]);
          _state.entity.subjects = _uniq([..._state.entity.subjects, ...newSubjects]);
        }
      });
    case APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const itemIdsMap = _keyBy(payload.itemIds);

      return {
        ...state,
        entity: {
          ...state.entity,
          itemGroups: [
            {
              ...state.entity.itemGroups[0],
              items: state.entity.itemGroups[0].items.map(i => {
                if (itemIdsMap[i._id]) {
                  return {
                    ...i,
                    status: payload.status
                  };
                }
                return i;
              })
            }
          ]
        }
      };
    case APPROVE_OR_REJECT_SINGLE_TEST_SUCCESS:
      return {
        ...state,
        entity: {
          ...state.entity,
          status: payload.status,
          collections: payload.collection ? payload.collection : state.entity.collections
        }
      };
    case UPDATE_GROUP_DATA:
      // eslint-disable-next-line no-case-declarations
      const { testGrades, testSubjects, testTags } = getTestGradeAndSubject(
        payload?.updatedGroupData,
        state.entity.grades,
        state.entity.subjects,
        state.entity.tags
      );
      return {
        ...state,
        updated: true,
        entity: {
          ...state.entity,
          itemGroups: state.entity.itemGroups.map((group, index) => {
            if (index === payload.groupIndex) return payload.updatedGroupData;
            return group;
          }),
          grades: testGrades,
          subjects: testSubjects,
          tags: testTags
        }
      };
    case ADD_NEW_GROUP:
      return {
        ...state,
        entity: {
          ...state.entity,
          itemGroups: [...state.entity.itemGroups, payload]
        }
      };
    case SET_CURRENT_GROUP_INDEX:
      return {
        ...state,
        currentGroupIndex: payload
      };
    case DELETE_ITEMS_GROUP:
      return {
        ...state,
        updated: true,
        entity: {
          ...state.entity,
          itemGroups: state.entity.itemGroups.filter(g => g.groupName !== payload)
        }
      };
    case ADD_ITEMS_TO_AUTOSELECT_GROUP:
      return {
        ...state,
        entity: {
          ...state.entity,
          itemGroups: produce(state.entity.itemGroups, itemGroups => {
            for (const itemGroup of itemGroups) {
              if (itemGroup.groupName === payload.groupName) {
                itemGroup.items = payload.items;
                break;
              }
            }
          })
        }
      };
    case SET_TEST_PASSAGE_AFTER_CREATE:
      return {
        ...state,
        entity: {
          ...state.entity,
          passages: [...state.entity.passages, payload]
        }
      };
    case UPDATE_CREATING:
      return {
        ...state,
        creating: payload
      };
    case SET_DEFAULT_SETTINGS_LOADING:
      return {
        ...state,
        isSettingsLoading: payload
      };
    case SET_AUTOSELECT_ITEMS_FETCHING_STATUS:
      return {
        ...state,
        isFetchingAutoselectItems: payload
      };
    case SET_REGRADING_STATE:
      return {
        ...state,
        regrading: payload
      };
    default:
      return state;
  }
};

/**
 * Return all question of a test.
 * @param {Object} itemGroups - list of item groups
 *  itemGroups will be array of groups having testItems in it.
 *
 */
export const getQuestions = (itemGroups = []) => {
  const allQuestions = [];
  for (const itemGroup of itemGroups) {
    for (const item of itemGroup.items) {
      const { questions = [], resources = [] } = item.data || {};
      allQuestions.push(...questions, ...resources);
    }
  }
  return allQuestions;
};

// created user state here bcz of circular dependency.
// login ducks update test state for filters.
const userStateSelector = state => state.user;

export const getUserFeatures = createSelector(
  userStateSelector,
  state => state.user.features
);

export const getReleaseScorePremiumSelector = createSelector(
  getTestSelector,
  getUserFeatures,
  (entity, features) => {
    const { subjects, grades } = entity;
    return (
      features.assessmentSuperPowersReleaseScorePremium ||
      (grades &&
        subjects &&
        isFeatureAccessible({
          features,
          inputFeatures: "assessmentSuperPowersReleaseScorePremium",
          gradeSubject: { grades, subjects }
        }))
    );
  }
);

export const getAllTagsSelector = (state, tagType) => {
  const stat = stateSelector(state);
  return get(stat, ["tagsList", tagType], []);
};

export const getCurrentGroupIndexSelector = createSelector(
  stateSelector,
  state => state.currentGroupIndex
);

export const getTestSummarySelector = createSelector(
  getTestEntitySelector,
  state => createGroupSummary(state)
);

export const getTestCreatedItemsSelector = createSelector(
  stateSelector,
  state => get(state, "createdItems", [])
);

// saga
function* receiveTestByIdSaga({ payload }) {
  try {
    const tests = yield select(state => state.tests);
    const createdItems = yield select(getTestCreatedItemsSelector);
    let entity = yield call(testsApi.getById, payload.id, {
      data: true,
      requestLatest: payload.requestLatest,
      editAndRegrade: payload.editAssigned
    });
    const userId = yield select(getUserIdSelector);
    const typeOfAuthor = authorType(userId, entity);
    if (payload.editAssigned && isRegraded(typeOfAuthor, entity, payload.id)) {
      const routerState = yield select(({ router }) => router.location.state) || {};
      yield put(setTestDataAction({ updated: false }));
      yield put(
        push({
          pathname: `/author/assignments/regrade/new/${entity._id}/old/${entity.previousTestId}`,
          state: { ...routerState, isRedirected: true }
        })
      );
      return;
    }
    entity.passages = [...entity.passages, ...differenceBy(tests.entity.passages, entity.passages, "_id")];
    const currentGroupIndex = yield select(getCurrentGroupIndexSelector);
    if (entity._id !== payload.id && !payload?.isPlaylist) {
      yield put(
        push({
          pathname: `/author/tests/tab/review/id/${entity._id}`,
          state: { showCancelButton: payload.editAssigned, editAssigned: payload.editAssigned }
        })
      );
    }
    entity.itemGroups[currentGroupIndex].items = entity.itemGroups[currentGroupIndex].items.map(testItem =>
      createdItems.length > 0 && createdItems[0]._id === testItem._id ? createdItems[0] : testItem
    );
    entity.itemGroups[currentGroupIndex].items = uniqBy(
      [...entity.itemGroups[currentGroupIndex].items, ...createdItems],
      "_id"
    );
    const questions = getQuestions(entity.itemGroups);
    yield put(loadQuestionsAction(_keyBy(questions, "id")));
    yield put(receiveTestByIdSuccess(entity));
    yield put(getDefaultTestSettingsAction(entity));
    yield put(setTestItemsAction(entity.itemGroups.flatMap(itemGroup => itemGroup.items || []).map(item => item._id)));
    if (!isEmpty(entity.freeFormNotes)) {
      yield put(
        saveUserWorkAction({
          [entity.itemGroups[0].items[0]._id]: { scratchpad: entity.freeFormNotes || {} }
        })
      );
    }
    if (entity.thumbnail === defaultImage) {
      const thumbnail = yield call(testsApi.getDefaultImage, {
        subject: get(entity, "subjects[0]", "Other Subjects"),
        standard: get(entity, "summary.standards[0].identifier", "")
      });
      yield put(updateDefaultThumbnailAction(thumbnail));
    }

    const setTime = userRole => {
      const addDate = userRole !== "teacher" ? 28 : 7;
      return moment()
        .add("days", addDate)
        .set({ hour: 23, minute: 0, second: 0, millisecond: 0 });
    };

    const userRole = yield select(getUserRole);

    const testType = entity?.testType;
    const { ASSESSMENT, COMMON } = testConst.type;

    const isAdmin = userRole === roleuser.SCHOOL_ADMIN || userRole === roleuser.DISTRICT_ADMIN;
    const testTypeDefault = isAdmin ? COMMON : testType || ASSESSMENT;
    let updateForTimedAssignment = { timedAssignment: entity?.timedAssignment };
    if (entity?.timedAssignment) {
      updateForTimedAssignment = {
        ...updateForTimedAssignment,
        allowedTime: entity?.allowedTime || 10 * 60 * 1000,
        pauseAllowed: entity?.pauseAllowed || false
      };
    }
    yield put(
      updateAssingnmentSettingsAction({
        startDate: moment(),
        class: [],
        testType: testTypeDefault,
        endDate: setTime(userRole),

        openPolicy:
          userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN
            ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
            : assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE,
        passwordPolicy: entity.passwordPolicy,
        passwordExpireIn: entity.passwordExpireIn,
        ...updateForTimedAssignment,
        assignmentPassword: entity.assignmentPassword
      })
    );
  } catch (err) {
    console.log({ err });
    const errorMessage = "Receive test by id is failing";
    if (err.status === 403) {
      yield put(push("/author/tests"));
      yield call(message.error, "You can no longer use this as sharing access has been revoked by author.");
    } else {
      yield call(message.error, errorMessage);
    }
    yield put(receiveTestByIdError(errorMessage));
  }
}

function* createTest(data) {
  const { title, passwordPolicy } = data;

  if (title !== undefined && !title.trim().length) {
    return yield call(message.error(" Name field cannot be empty "));
  }
  if (passwordPolicy !== test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC) {
    delete data.assignmentPassword;
  }

  if (passwordPolicy !== test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC) {
    delete data.passwordExpireIn;
  }

  const dataToSend = omit(data, [
    "assignments",
    "createdDate",
    "updatedDate",
    "passages", // not accepted by backend validator (testSchema)  EV-10685
    "isUsed",
    "currentTab", // not accepted by backend validator (testSchema) EV-10685,
    "summary"
  ]);
  // we are getting testItem ids only in payload from cart, but whole testItem Object from test library.
  dataToSend.itemGroups = transformItemGroupsUIToMongo(data.itemGroups);
  const entity = yield call(testsApi.create, dataToSend);
  yield put({
    type: UPDATE_ENTITY_DATA,
    payload: {
      entity: { ...entity, itemGroups: data.itemGroups }
    }
  });
  return entity;
}

function* createTestSaga({ payload }) {
  try {
    const entity = yield createTest(payload.data);
    entity.itemGroups = payload.data.itemGroups;
    yield put(createTestSuccessAction(entity));
    const currentTab = payload.isCartTest ? "description" : "addItems";
    yield put(replace(`/author/tests/tab/${currentTab}/id/${entity._id}`));
    yield call(message.success, "Test created");
  } catch (err) {
    console.log({ err });

    const errorMessage = err?.data?.message || "Failed to create test!";
    yield call(message.error, errorMessage);
    yield put(createTestErrorAction(errorMessage));
  }
}

function* updateTestSaga({ payload }) {
  try {
    // dont set loading as true
    if (!payload.disableLoadingIndicator) yield put(setTestsLoadingAction(true));
    const { scoring = {}, currentTab } = payload.data;
    // remove createdDate and updatedDate
    const oldId = payload.data._id;
    delete payload.data.updatedDate;
    delete payload.data.createdDate;
    delete payload.data.assignments;
    delete payload.data.authors;
    delete payload.data.createdBy;
    delete payload.data.passages;
    delete payload.data.isUsed;
    delete payload.data.scoring;
    delete payload.data.sharedType;
    delete payload.data.currentTab;
    delete payload.data.summary;

    // Backend doesn't require PARTIAL_CREDIT_IGNORE_INCORRECT
    // Penalty true/false is set to determine the case
    if (payload.data.scoringType === test.evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT) {
      payload.data.scoringType = test.evalTypeLabels.PARTIAL_CREDIT;
    }

    const pageStructure = get(payload.data, "pageStructure", []).map(page => ({
      ...page,
      _id: undefined
    }));

    payload.data.pageStructure = pageStructure.length ? pageStructure : undefined;
    if (payload.data.passwordPolicy !== test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC) {
      delete payload.data.passwordExpireIn;
    }
    if (payload.data.passwordPolicy !== test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC) {
      delete payload.data.assignmentPassword;
    } else if (
      payload.data.passwordPolicy === test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC &&
      (!payload.data.assignmentPassword ||
        payload.data.assignmentPassword.length < 6 ||
        payload.data.assignmentPassword.length > 25)
    ) {
      yield call(message.error, "Please add a valid password.");
      return yield put(setTestsLoadingAction(false));
    }

    payload.data.itemGroups = transformItemGroupsUIToMongo(payload.data.itemGroups, scoring);

    const role = yield select(getUserRole);
    if (role === roleuser.EDULASTIC_CURATOR) {
      payload.data.performanceBand = pick(payload.data?.performanceBand, ["_id", "name"]);
      payload.data.standardGradingScale = pick(payload.data?.standardGradingScale, ["_id", "name"]);
    }

    const entity = yield call(testsApi.update, payload);
    yield put(updateTestSuccessAction(entity));
    const newId = entity._id;
    const userRole = yield select(getUserRole);
    if (oldId !== newId && newId) {
      if (!payload.assignFlow) {
        yield call(message.success, "Test versioned");
        let url = `/author/tests/${newId}/versioned/old/${oldId}`;
        if (currentTab) {
          url = `/author/tests/tab/${currentTab}/id/${newId}/old/${oldId}`;
        }
        const locationState = yield select(state => get(state, "router.location.state"), {});
        yield put(
          push({
            pathname: url,
            state: locationState
          })
        );
      }
    } else if (!payload.assignFlow) {
      if (userRole === roleuser.EDULASTIC_CURATOR) yield call(message.success, "Test saved");
      else yield call(message.success, "Test saved as Draft");
    }
    yield put(setTestsLoadingAction(false));
  } catch (err) {
    console.log({ err });
    const errorMessage = err?.data?.message || "Update test is failing";
    yield call(message.error, errorMessage);
    yield put(updateTestErrorAction(errorMessage));
    yield put(setTestsLoadingAction(false));
  }
}

function* updateTestDocBasedSaga({ payload }) {
  try {
    const assessmentQuestions = yield select(getQuestionsArraySelector);
    const [testItem] = payload.data.itemGroups[0].items;
    const testItemId = typeof testItem === "object" ? testItem._id : testItem;
    const resourceTypes = [questionType.VIDEO, questionType.PASSAGE, questionType.TEXT];

    const resources = assessmentQuestions.filter(q => resourceTypes.includes(q.type));
    const questions = assessmentQuestions.filter(q => !resourceTypes.includes(q.type));
    const updatedTestItem = {
      ...testItem,
      public: undefined,
      authors: undefined,
      version: testItem.version,
      isDocBased: true,
      data: {
        questions,
        resources
      },
      rows: [
        {
          tabs: [],
          dimension: "100%",
          widgets: assessmentQuestions.map(createWidget)
        }
      ],
      itemLevelScoring: false
    };

    const { testId, ...updatedItem } = yield call(updateItemDocBasedSaga, {
      payload: { id: testItemId, data: updatedTestItem, keepData: true, redirect: false }
    });

    const newAssessment = {
      ...payload.data,
      itemGroups: [{ ...payload.data.itemGroups[0], items: [{ _id: testItemId, ...updatedItem }] }]
    };
    return yield call(updateTestSaga, {
      payload: { ...payload, data: newAssessment }
    });
  } catch (err) {
    const errorMessage = err?.data?.message || "Update test is failing";
    yield call(message.error, errorMessage);
    yield put(updateTestErrorAction(errorMessage));
  }
}

function* updateRegradeDataSaga({ payload }) {
  try {
    yield put(setRegradingStateAction(true));
    yield call(testsApi.publishTest, payload.newTestId);
    yield call(assignmentApi.regrade, payload);
    yield call(message.success, "Success update");
    yield put(push(`/author/regrade/${payload.newTestId}/success`));
  } catch (e) {
    const errorMessage = e?.data?.message || "Update test is failing";
    yield call(message.error, errorMessage);
  } finally {
    yield put(setRegradingStateAction(false));
  }
}

function* shareTestSaga({ payload }) {
  try {
    yield call(contentSharingApi.shareContent, payload);
    yield put(
      receiveSharedWithListAction({
        contentId: payload.contentId,
        contentType: payload.data.contentType
      })
    );
    yield call(message.success, "Successfully shared");
  } catch (e) {
    console.warn(e);
    const errorMessage = "Sharing failed";
    const hasInvalidMails = e?.data?.invalidEmails?.length > 0;
    if (hasInvalidMails) {
      return message.error(`Invalid mails found (${e?.data?.invalidEmails.join(", ")})`);
    }
    yield call(message.error, e?.data?.message || errorMessage);
  }
}

function* publishTestSaga({ payload }) {
  try {
    const { _id: id, test: _test, assignFlow } = payload;
    const defaultThumbnail = yield select(getDefaultThumbnailSelector);
    _test.thumbnail = _test.thumbnail === defaultImage ? defaultThumbnail : _test.thumbnail;
    const assessmentQuestions = yield select(getQuestionsArraySelector);
    const resourceTypes = [
      questionType.VIDEO,
      questionType.PASSAGE,
      questionType.TEXT,
      questionType.COMBINATION_MULTIPART
    ];
    const questions = assessmentQuestions.filter(q => !resourceTypes.includes(q.type));

    const standardPresent = questions.some(hasStandards);
    // if alignment data is not present, set the flag to open the modal, and wait for
    // an action from the modal.!
    if (!standardPresent && _test.isDocBased) {
      yield put(togglePublishWarningModalAction(true));
      // action dispatched by the modal.
      const { payload: publishItem } = yield take(PROCEED_PUBLISH_ACTION);
      yield put(togglePublishWarningModalAction(false));

      // if he wishes to add some just close the modal, and go to metadata.
      // else continue the normal flow.
      if (!publishItem) {
        return;
      }
    }
    yield call(_test.isDocBased ? updateTestDocBasedSaga : updateTestSaga, {
      payload: { id, data: _test, assignFlow: true }
    });

    const features = yield select(getUserFeatures);
    if (features.isPublisherAuthor && !assignFlow) {
      yield call(testsApi.updateTestStatus, {
        testId: id,
        status: testItemStatusConstants.INREVIEW
      });
      yield put(updateTestStatusAction(testItemStatusConstants.INREVIEW));
      yield call(message.success, "Review request is submitted successfully.");
    } else {
      yield call(testsApi.publishTest, id);
      yield put(updateTestStatusAction(testItemStatusConstants.PUBLISHED));
    }
    if (features.isCurator || features.isPublisherAuthor) {
      yield put(push(`/author/tests?filter=AUTHORED_BY_ME`));
      return message.success("Test saved successfully. Test not visible? Clear the applied filters.");
    }
    if (!assignFlow) {
      yield call(message.success, "Successfully published");
    }
    if (assignFlow) {
      let update = { timedAssignment: _test?.timedAssignment };
      if (_test?.timedAssignment) {
        update = {
          ...update,
          allowedTime: _test?.allowedTime || 10 * 60 * 1000,
          pauseAllowed: _test?.pauseAllowed || false
        };
      }
      /**
       * during assign flow , putting default settings
       */
      yield put(updateAssingnmentSettingsAction(update));

      yield put(push(`/author/assignments/${id}`));
    } else {
      const role = yield select(getUserRole);
      if (role !== roleuser.EDULASTIC_CURATOR) yield put(push(`/author/tests/${id}/publish`));
      else {
        const entityTest = yield select(getTestEntitySelector);
        entityTest.itemGroups.forEach(g => {
          if (g.type === "STATIC") {
            g.items.forEach(i => {
              i.status = "published";
            });
          }
        });
        yield put(updateTestEntityAction(entityTest));
      }
    }
  } catch (error) {
    console.error(error);
    message.error(error?.data?.message || "publish failed.");
  }
}

/**
 *
 * @param {*} payload should be test ID
 */
function* publishForRegrade({ payload }) {
  try {
    const _test = yield select(getTestSelector);
    if (_test.isUsed && !test.isInEditAndRegrade) {
      _test.isInEditAndRegrade = true;
    }
    yield call(_test.isDocBased ? updateTestDocBasedSaga : updateTestSaga, {
      payload: { id: payload, data: _test, assignFlow: true }
    });
    const newTestId = yield select(getTestIdSelector);
    const locationState = yield select(({ router }) => router.location.state);
    yield put(
      push({
        pathname: `/author/assignments/regrade/new/${newTestId}/old/${_test.previousTestId}`,
        state: locationState
      })
    );
  } catch (error) {
    console.error(error);
    message.error(error?.data?.message || "publish failed.");
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
    yield put(
      receiveSharedWithListAction({
        contentId: payload.contentId,
        contentType: payload.contentType
      })
    );
  } catch (e) {
    const errorMessage = "delete shared user is failing";
    yield call(message.error, errorMessage);
  }
}

// TODO: analyse and refactor this logic.
function* setTestDataAndUpdateSaga({ payload }) {
  try {
    let newTest = yield select(getTestSelector);
    const currentGroupIndex = yield select(getCurrentGroupIndexSelector);
    const { addToTest, item } = payload;
    if (addToTest) {
      newTest = produce(newTest, draft => {
        draft.itemGroups[currentGroupIndex].items.push(item);
      });
    } else {
      newTest = produce(newTest, draft => {
        draft.itemGroups = draft.itemGroups.map(itemGroup => {
          if (itemGroup.type !== ITEM_GROUP_TYPES.AUTOSELECT) {
            itemGroup.items = itemGroup.items.filter(el => el._id !== item._id);
          }
          return itemGroup;
        });
      });
    }
    // getting grades and subjects from each question array in test items
    const { itemGroups = [] } = newTest;
    const testItems = itemGroups
      .filter(({ type }) => type !== ITEM_GROUP_TYPES.AUTOSELECT)
      .flatMap(itemGroup => itemGroup.items || []);
    const questionGrades = testItems
      .flatMap(_item => (_item.data && _item.data.questions) || [])
      .flatMap(question => question.grades || []);
    const questionSubjects = testItems
      .flatMap(_item => (_item.data && _item.data.questions) || [])
      .flatMap(question => question.subjects || []);
    // alignment object inside questions contains subject and domains
    const getAlignmentsObject = testItems
      .flatMap(_item => (_item.data && _item.data.questions) || [])
      .flatMap(question => question.alignment || []);

    const subjects = getAlignmentsObject.map(alignment => alignment.subject).filter(identity);

    // domains inside alignment object holds standards with grades

    const grades = getAlignmentsObject
      .flatMap(alignment => alignment?.domains)
      .flatMap(domain => domain?.standards)
      .flatMap(standard => standard?.grades)
      .filter(identity);

    yield put(
      getItemsSubjectAndGradeAction({
        subjects: _uniq([...subjects, ...questionSubjects]),
        grades: _uniq([...grades, ...questionGrades])
      })
    );
    yield put(setTestDataAction(newTest));
    const creating = yield select(getTestsCreatingSelector);
    if (newTest._id || creating) {
      return;
    }
    yield put(setIsCreatingAction(true));
    if (newTest.thumbnail === defaultImage) {
      const thumbnail = yield call(testsApi.getDefaultImage, {
        subject: get(newTest, "data.subjects[0]", "Other Subjects"),
        standard: get(newTest, "data.summary.standards[0].identifier", "")
      });
      yield put(updateDefaultThumbnailAction(thumbnail));
    }

    if (!newTest._id) {
      const { title, testContentVisibility } = newTest;
      const role = yield select(getUserRole);
      if (!title) {
        return yield call(message.error("Name field cannot be empty"));
      }
      if (newTest.passwordPolicy !== test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC) {
        delete newTest.passwordExpireIn;
      }
      if (newTest.passwordPolicy !== test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC) {
        delete newTest.assignmentPassword;
      } else if (!newTest.assignmentPassword) {
        yield call(message.error, "Please add a valid password.");
        return;
      }

      let testObj = produce(newTest, draft => {
        draft.itemGroups = transformItemGroupsUIToMongo(draft.itemGroups);
        if (!testContentVisibility && (role === roleuser.DISTRICT_ADMIN || role === roleuser.SCHOOL_ADMIN)) {
          draft.testContentVisibility = test.testContentVisibility.ALWAYS;
        }
      });
      // summary CAN BE REMOVED AS BE WILL CREATE ITS OWN SUMMARY USING ITEMS
      // passages doesnt accepted by BE
      testObj = omit(testObj, ["passages", "summary"]);
      const entity = yield call(testsApi.create, testObj);
      const { itemGroups: _itemGroups } = yield select(getTestSelector);
      yield put({
        type: UPDATE_ENTITY_DATA,
        payload: {
          entity: { ...entity, itemGroups: _itemGroups }
        }
      });
      yield put(setIsCreatingAction(false));
      // TODO: is this logic still relevant?
      if (payload.current) {
        yield put(replace(`/author/tests/tab/${payload.current}/id/${entity._id}`));
      } else {
        yield put(
          replace({
            pathname: `/author/tests/tab/addItems/id/${entity._id}`,
            state: { showItemAddedMessage: true, isAuthoredNow: true }
          })
        );
      }
      yield call(message.success, `Your work is automatically saved as a draft assessment named ${entity.title}`);
    }

    // if item has passage, add the passage to test as well. (review tab requires it)
    if (item.passageId) {
      const currentPassages = yield select(getCurentTestPassagesSelector);
      const currentPassageIds = currentPassages.map(i => i._id);
      const newPayload = {};
      if (!currentPassageIds.includes(item.passageId)) {
        const passage = yield call(passageApi.getById, item.passageId);
        newPayload.passages = [...currentPassages, passage];
        yield put(setTestDataAction(newPayload));
      }
    }
  } catch (e) {
    console.error(e);
    const errorMessage = e?.data?.message || "Auto Save of Test is failing";
    yield call(message.error, errorMessage);
  }
}

function* getEvaluation(testItemId, newScore) {
  const testItems = yield select(getTestItemsSelector);
  const testItem = testItems.find(x => x._id === testItemId) || {};
  const { itemLevelScore, itemLevelScoring = false } = testItem;
  const questions = _keyBy(testItem.data.questions, "id");
  const answers = yield select(state => get(state, "answers", {}));
  const evaluation = yield evaluateItem(answers, questions, itemLevelScoring, newScore || itemLevelScore);
  return evaluation;
}
function* getEvaluationFromItem(testItem, newScore) {
  const { itemLevelScore, itemLevelScoring = false } = testItem;
  const questions = _keyBy(testItem.data.questions, "id");
  const answers = yield select(state => get(state, "answers", {}));
  const evaluation = yield evaluateItem(answers, questions, itemLevelScoring, newScore || itemLevelScore);
  return evaluation;
}

function* checkAnswerSaga({ payload }) {
  try {
    let evaluationObject = {};
    const { scoring } = yield select(getTestEntitySelector);
    if (payload.isItem) {
      evaluationObject = yield getEvaluationFromItem(payload, scoring[payload._id]);
    } else {
      evaluationObject = yield getEvaluation(payload.id, scoring[payload.id]);
    }
    const { evaluation, score, maxScore } = evaluationObject;
    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...evaluation
      }
    });
    yield put({
      type: CHANGE_PREVIEW,
      payload: {
        view: "check"
      }
    });

    yield put({
      type: SET_ITEM_SCORE,
      payload: {
        score: round(score, 2),
        maxScore,
        showScore: true
      }
    });

    // message.success(`score: ${+score.toFixed(2)}/${maxScore}`);
  } catch (e) {
    message.error("failed to check answer");
    console.log("error checking answer", e);
  }
}

function* showAnswerSaga({ payload }) {
  try {
    const testItems = yield select(getTestItemsSelector);
    const testItem = testItems.find(x => x._id === payload.id) || {};
    const answers = yield select(state => get(state, "answers", {}));
    let questions = _keyBy(testItem.data && testItem.data.questions, "id");

    // when item is removed from the test, we get the question from the payload (i.e modal case)
    if (!questions || Object.keys(questions).length === 0) {
      const data = (payload.item ? payload.item.data : payload.data) || { questions: [] };
      // eslint-disable-next-line prefer-destructuring
      questions = data.questions.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {});
    }

    const evaluation = yield createShowAnswerData(questions, answers);
    yield put({
      type: CHANGE_PREVIEW,
      payload: {
        view: "show"
      }
    });

    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...evaluation
      }
    });
  } catch (e) {
    message.error("failed loading answer");
    console.log("error showing answer", e);
  }
}

function* getAllTagsSaga({ payload }) {
  try {
    const tags = yield call(tagsApi.getAll, payload.type);
    yield put({
      type: SET_ALL_TAGS,
      payload: { tags, tagType: payload.type }
    });
  } catch (e) {
    yield call(message.error("Get All Tags failed"));
  }
}

function* getDefaultTestSettingsSaga({ payload: testEntity }) {
  try {
    yield put(setDefaultSettingsLoadingAction(true));
    const role = yield select(getUserRole);
    const orgData = yield select(getUserOrgData);
    let payload = {
      orgId: orgData.districtId,
      params: { orgType: "district" }
    };

    if (role !== roleuser.DISTRICT_ADMIN && orgData.institutionIds.length) {
      payload = {
        orgId: orgData.institutionIds[0] || orgData.districtId,
        params: {
          orgType: "institution"
        }
      };
    }
    let defaultTestSettings = {};
    if (role !== roleuser.EDULASTIC_CURATOR) {
      defaultTestSettings = yield call(testsApi.getDefaultTestSettings, payload);
    } else {
      const { performanceBand, standardGradingScale } = testEntity;
      const performanceBandProfiles = [performanceBand];
      const standardsProficiencyProfiles = [standardGradingScale];
      const performanceBandId = performanceBand._id;
      const standardProficiencyId = standardGradingScale._id;
      const defaultTestTypeProfiles = {
        performanceBand: { common: performanceBandId, class: performanceBandId, practice: performanceBandId },
        standardProficiency: {
          common: standardProficiencyId,
          class: standardProficiencyId,
          practice: standardProficiencyId
        }
      };
      defaultTestSettings = {
        performanceBandProfiles,
        standardsProficiencyProfiles,
        defaultTestTypeProfiles
      };
    }
    const {
      performanceBandProfiles,
      standardsProficiencyProfiles,
      defaultTestTypeProfiles: defaultTestProfiles,
      partialScore
    } = defaultTestSettings;
    yield put(receivePerformanceBandSuccessAction(performanceBandProfiles));
    yield put(receiveStandardsProficiencySuccessAction(standardsProficiencyProfiles));
    yield put(setDefaultTestTypeProfilesAction(defaultTestSettings));
    const performanceBand = getDefaultSettings({
      testType: testEntity?.testType,
      defaultTestProfiles
    })?.performanceBand;
    const standardGradingScale = getDefaultSettings({
      testType: testEntity?.testType,
      defaultTestProfiles
    })?.standardProficiency;
    yield put(updateAssingnmentSettingsAction({ performanceBand, standardGradingScale }));
    const testData = yield select(getTestSelector);
    if ((!testData._id || !testData.title) && partialScore === false) {
      yield put(
        setTestDataAction({
          scoringType: test.evalTypeLabels.ALL_OR_NOTHING
        })
      );
    }
    yield put(setDefaultSettingsLoadingAction(false));
  } catch (e) {
    yield call(message.error("Get default settings failed"));
    yield put(setDefaultSettingsLoadingAction(false));
  }
}

function* duplicateTestSaga({ payload }) {
  yield put(setTestsLoadingAction(true));
  try {
    const { _id, title, currentTab, isInEditAndRegrade = false } = payload;
    const data = yield call(assignmentApi.duplicateAssignment, { _id, title, isInEditAndRegrade });
    yield put(push(`/author/tests/tab/${currentTab}/id/${data._id}/old/${_id}`));
    yield put(setTestsLoadingAction(false));
    yield put(receiveTestByIdAction(data._id, true));
  } catch (e) {
    yield put(setTestsLoadingAction(false));
    console.warn("error", e, e.stack);
  }
}

/*
 * add passage items to test.
 * dispatched when user want to add all items of passage to the test.
 */
function* setAndSavePassageItems({ payload: { passageItems, page } }) {
  try {
    const currentGroupIndex = yield select(getCurrentGroupIndexSelector);
    const _test = yield select(getTestSelector);
    const { passageId } = passageItems?.[0] || {};
    const currentPassages = yield select(getCurentTestPassagesSelector);
    const currentPassageIds = currentPassages.map(i => i._id);
    // new payload to update the tests' store's entity.
    const newPayload = {};
    // if passage is not already present, fetch it and add it to the payload.
    if (!currentPassageIds.includes(passageId)) {
      const passage = yield call(passageApi.getById, passageId);
      newPayload.passages = [...currentPassages, passage];
    }
    const testItems = yield select(getSelectedTestItemsSelector);
    newPayload.itemGroups = _test.itemGroups;
    newPayload.itemGroups[currentGroupIndex].items = [...testItems, ...passageItems];
    const itemIds = _uniq(newPayload.itemGroups.flatMap(itemGroup => itemGroup.items || []).map(i => i._id));
    if (!_test._id && page !== "itemList") {
      yield put(createTestAction({ ..._test, ...newPayload }));
    }
    // for weird reason there is another store to show if a testItem should be shown
    // as selected or not in item banks page. Adding test items to there.
    yield put(setTestItemsAction(itemIds));

    // update the test data wth testItems, and passage if needed.
    yield put(setTestDataAction(newPayload));
  } catch (e) {
    yield call(message.error("error adding passage items"));
    console.error("error", e, e.stack);
  }
}

/**
 * this saga is used to update the test before navigation.
 *  like, you want to move to edit/create item.. so save the test before navigating.
 *
 */
function* updateTestAndNavigate({ payload }) {
  try {
    let { pathname } = payload;
    const { fadeSidebar = false, regradeFlow, previousTestId, testId, isEditing, isDuplicating } = payload;
    const data = yield select(getTestSelector);
    const hasUnsavedChanges = yield select(state => state?.tests?.updated);
    if (hasUnsavedChanges) {
      const isTestCreated = testId && testId !== "undefined";
      const _test = !isTestCreated ? yield createTest(data) : {};
      if ((isEditing || isDuplicating) && isTestCreated) {
        yield updateTestSaga({ payload: { data, id: testId } });
      }
      if (!isTestCreated) {
        pathname = pathname.replace("undefined", _test._id);
      }
    }

    yield put(push(pathname, { isTestFlow: true, fadeSidebar, regradeFlow, previousTestId }));
  } catch (e) {
    yield call(message.error("error updating test"));
    console.error("err", e);
  }
}

function* approveOrRejectSingleTestSaga({ payload }) {
  try {
    if (
      payload.status === "published" &&
      (!payload.collections || (payload.collections && !payload.collections.length))
    ) {
      message.error("Test is not associated with any collection.");
      return;
    }
    yield call(testsApi.updateTestStatus, payload);
    yield put(approveOrRejectSingleTestSuccessAction(payload));
    message.success(`Test ${payload.status === "published" ? "Approved" : "Rejected"} Successfully.`);
    yield put(push("/author/tests"));
  } catch (error) {
    console.error(error);
    message.error(error?.data?.message || `Test ${payload.status === "published" ? "Approve" : "Reject"} Failed.`);
  }
}

function tranformItemGroupToData(itemGroup, index, allStaticGroupItemIds) {
  const optionalFields = {
    depthOfKnowledge: itemGroup.dok,
    authorDifficulty: itemGroup.difficulty,
    tags: itemGroup.tags?.map(tag => tag.tagName) || []
  };
  Object.keys(optionalFields).forEach(key => optionalFields[key] === undefined && delete optionalFields[key]);
  return {
    data:
      itemGroup.type === ITEM_GROUP_TYPES.STATIC
        ? null
        : {
            limit: itemGroup.deliverItemsCount,
            search: {
              collectionId: itemGroup.collectionDetails._id,
              standardId: itemGroup.standardDetails.standardId,
              nInItemIds: allStaticGroupItemIds,
              ...optionalFields
            }
          },
    isFetchItems: itemGroup.type === ITEM_GROUP_TYPES.AUTOSELECT,
    groupName: itemGroup.groupName,
    index
  };
}

function getItemGroupsTransformed(_test) {
  const allStaticGroupItemIds = getStaticGroupItemIds(_test);
  return _test.itemGroups.map((itemGroup, index) => tranformItemGroupToData(itemGroup, index, allStaticGroupItemIds));
}

function* fetchAutoselectGroupItemsSaga(payload) {
  try {
    const response = yield call(testItemsApi.getAutoSelectedItems, payload);
    return response.items.map(i => ({ ...i, autoselectedItem: true }));
  } catch (err) {
    console.error(err);
    yield call(message.error, "Failed to fetch autoselect items.");
    return null;
  }
}

function* addItemsToAutoselectGroupsSaga({ payload: _test }) {
  try {
    yield put(setAutoselectItemsFetchingStatusAction(true));
    const transformedData = getItemGroupsTransformed(_test);
    for (const { isFetchItems, data, groupName } of transformedData) {
      if (isFetchItems) {
        const response = yield fetchAutoselectGroupItemsSaga(data);
        if (response) {
          yield put(addItemsToAutoselectGroupAction({ items: response, groupName }));
        }
      }
    }
    yield put(setAutoselectItemsFetchingStatusAction(false));
  } catch (err) {
    yield put(setAutoselectItemsFetchingStatusAction(false));
    console.error(err);
  }
}

export function* addAutoselectGroupItems({ payload: test }) {
  try {
    const transformedData = getItemGroupsTransformed(test);
    const allStaticGroupItemIds = getStaticGroupItemIds(test);
    const promises = transformedData.map(({ data, isFetchItems }) => {
      if (isFetchItems) {
        return testItemsApi
          .getAutoSelectedItems({
            ...data,
            search: { ...data.search, nInItemIds: allStaticGroupItemIds }
          })
          .then(response => ({ ...response }));
      }
      return Promise.resolve(null);
    });

    const responses = yield Promise.all(promises);
    const itemGroups = test.itemGroups.map((itemGroup, i) => {
      if (itemGroup.type === ITEM_GROUP_TYPES.AUTOSELECT && transformedData?.[i].isFetchItems) {
        return { ...itemGroup, items: responses[i].items };
      }
      return itemGroup;
    });

    return { ...test, itemGroups };
  } catch (err) {
    console.error(err);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_TEST_BY_ID_REQUEST, receiveTestByIdSaga),
    yield takeEvery(CREATE_TEST_REQUEST, createTestSaga),
    yield takeEvery(UPDATE_TEST_REQUEST, updateTestSaga),
    yield takeEvery(UPDATE_TEST_DOC_BASED_REQUEST, updateTestDocBasedSaga),
    yield takeEvery(REGRADE_TEST, updateRegradeDataSaga),
    yield takeEvery(TEST_SHARE, shareTestSaga),
    yield takeEvery(TEST_PUBLISH, publishTestSaga),
    yield takeEvery(RECEIVE_SHARED_USERS_LIST, receiveSharedWithListSaga),
    yield takeEvery(DELETE_SHARED_USER, deleteSharedUserSaga),
    yield takeEvery(PREVIEW_CHECK_ANSWER, checkAnswerSaga),
    yield takeEvery(GET_ALL_TAGS_IN_DISTRICT, getAllTagsSaga),
    yield takeEvery(PREVIEW_SHOW_ANSWER, showAnswerSaga),
    yield takeEvery(RECEIVE_DEFAULT_TEST_SETTINGS, getDefaultTestSettingsSaga),
    yield takeEvery(PUBLISH_FOR_REGRADE, publishForRegrade),
    yield takeEvery(DUPLICATE_TEST_REQUEST, duplicateTestSaga),
    yield takeEvery(SET_AND_SAVE_PASSAGE_ITEMS, setAndSavePassageItems),
    yield takeLatest(UPDATE_TEST_AND_NAVIGATE, updateTestAndNavigate),
    yield takeEvery(APPROVE_OR_REJECT_SINGLE_TEST_REQUEST, approveOrRejectSingleTestSaga),
    yield takeLatest(ADD_ITEMS_TO_AUTOSELECT_GROUPS_REQUEST, addItemsToAutoselectGroupsSaga),
    yield takeEvery(SET_TEST_DATA_AND_SAVE, setTestDataAndUpdateSaga)
  ]);
}
