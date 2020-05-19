import { createAction, createReducer } from "redux-starter-kit";
import * as moment from "moment";
import { message } from "antd";
import { takeLatest, takeEvery, put, call, all, select, take } from "redux-saga/effects";
import { flatten, cloneDeep, isEmpty, omit, uniqBy, sumBy } from "lodash";
import { v4 } from "uuid";
import { normalize, schema } from "normalizr";
import { push } from "connected-react-router";
import { notification } from "@edulastic/common";
import { curriculumSequencesApi, assignmentApi, userContextApi, groupApi, recommendationsApi } from "@edulastic/api";
import produce from "immer";
import { setCurrentAssignmentAction } from "../TestPage/components/Assign/ducks";
import { getUserSelector, getUserId } from "../src/selectors/user";
import {
  publishTestAction,
  receiveTestByIdAction,
  getTestSelector,
  UPDATE_TEST_STATUS,
  RECEIVE_TEST_BY_ID_SUCCESS
} from "../TestPage/ducks";
import { fetchGroupMembersAction, SET_GROUP_MEMBERS, getStudentsSelector } from "../sharedDucks/groups";
import { receiveLastPlayListAction, receiveRecentPlayListsAction } from "../Playlist/ducks";

// Constants
export const CURRICULUM_TYPE_GUIDE = "guide";
export const CURRICULUM_TYPE_CONTENT = "content";
const DRAFT = "draft";

// Types
export const FETCH_CURRICULUM_SEQUENCES = "[curriculum-sequence] fetch list of curriculum sequences";
export const UPDATE_CURRICULUM_SEQUENCE = "[curriculum-sequence-ui] update curriculum sequence";
export const UPDATE_CURRICULUM_SEQUENCE_LIST = "[curriculum-sequence-ui] update curriculum sequence list";
export const FETCH_CURRICULUM_SEQUENCES_ERROR = "[curriculum-sequence-ui] error no ids provided";
export const PUT_CURRICULUM_SEQUENCE = "[curriculum-sequence] put curriculum sequence";
export const SEARCH_CURRICULUM_SEQUENCES = "[curriculum-sequence] search curriculum sequences";
export const SEARCH_GUIDES = "[curriculum-sequence] search curriculum sequences - guides";
export const SEARCH_GUIDES_RESULT = "[curriculum-sequence] search curriculum sequences - guides - result";
export const SEARCH_CONTENT_CURRICULUMS = "[curriculum-sequence] search curriculum sequences - content";
export const SEARCH_CONTENT_CURRICULUMS_RESULT = "[curriculum-sequence] search curriculum sequences - content - result";
export const CHANGE_GUIDE = "[curriculum-sequence] change curriculum sequence (guide)";
export const SET_PUBLISHER = "[curriculum-sequence] set selected publisher";
export const SET_GUIDE = "[curriculum-sequence] set selected guide";
export const SAVE_GUIDE_ALIGNMENT = "[curriculum-sequence] save guide alignment";
export const SET_CONTENT_CURRICULUM = "[curriculum-sequence] set selected content";
export const TOGGLE_CHECKED_UNIT_ITEM = "[curriculum-sequence] toggle checked unit item";
export const TOGGLE_ADD_CONTENT = "[curriculum-sequence-ui] toggle add content";
export const CREATE_ASSIGNMENT = "[curriculum-sequence] create assignment";
export const CREATE_ASSIGNMENT_NOW = "[curriculum-sequence] create assignment now";
export const CREATE_ASSIGNMENT_OK = "[curriculum-sequence] create assignment ok";
export const SET_SELECTED_ITEMS_FOR_ASSIGN = "[curriculum-sequence] set selected items for assign";
export const SET_SELECTED_ITEMS_FOR_ASSIGN_INIT = "[curriculum-sequence] set selected items for assign init";
export const SET_DATA_FOR_ASSIGN_INIT = "[curriculum-sequence] set data for assign init";
export const SET_DATA_FOR_ASSIGN = "[curriculum-sequence] set data for assign";
export const ADD_CONTENT_TO_CURRICULUM_RESULT = "[curriculum-sequence] add content to curriculum result";
export const REMOVE_ITEM_FROM_UNIT = "[curriculum-sequence] remove item from unit";
export const SAVE_CURRICULUM_SEQUENCE = "[curriculum-sequence] save curriculum sequence";
export const ADD_NEW_UNIT_INIT = "[curriculum-sequence] add new unit init";
export const ADD_NEW_UNIT = "[curriculum-sequence] add new unit";
export const REMOVE_UNIT_INIT = "[curriculum-sequence] remove unit init";
export const REMOVE_UNIT = "[curriculum-sequence] remove unit";
export const UPDATE_ASSIGNMENT = "[curriculum-sequence] update assignment";
export const BATCH_ASSIGN = "[curriculum-sequence] batch assign request";
export const BATCH_ASSIGN_RESULT = "[curriculum-sequence] batch assign result";
export const FETCH_ASSIGNED_REQUEST = "[curriculum-sequence] fetch assigned request";
export const FETCH_ASSIGNED_RESULT = "[curriculum-sequence] fetch assigned result";
export const USE_THIS_PLAYLIST = "[playlist] use this playlist";
export const APPROVE_OR_REJECT_SINGLE_PLAYLIST_REQUEST =
  "[curriculum-sequence] approve or reject single playlist request";
export const APPROVE_OR_REJECT_SINGLE_PLAYLIST_SUCCESS =
  "[curriculum-sequence] approve or reject single playlist success";
export const SET_PLAYLIST_DATA = "[curriculum-sequence] set playlist data";

// Drop Playlist Action Constants
export const FETCH_CLASS_LIST_BY_DISTRICT_ID = "[drop-playlist] fetch class list by district id";
export const FETCH_CLASS_LIST_SUCCESS = "[drop-playlist] fetch class list success";
export const FETCH_STUDENT_LIST_BY_GROUP_ID = "[drop-playlist] fetch student list by group id";
export const FETCH_STUDENT_LIST_SUCCESS = "[drop-playlist] fetch student list success";
export const DROP_PLAYLIST_ACTION = "[drop-playlist] drop playlist - grant/revoke access";
export const FETCH_PLAYLIST_ACCESS_LIST = "[drop-playlist] fetch playlist access list";
export const UPDATE_DROPPED_ACCESS_LIST = "[drop-playlist] update playlist access list";
export const FETCH_PLAYLIST_METRICS = "[playlist metrics] fetch playlist metrics";
export const UPDATE_PLAYLIST_METRICS = "[playlist metrics] update playlist metrics";
export const FETCH_PLAYLIST_INSIGHTS = "[playlist insights] fetch playlist insights";
export const FETCH_PLAYLIST_INSIGHTS_SUCCESS = "[playlist insights] fetch playlist insights success";
export const FETCH_PLAYLIST_INSIGHTS_ERROR = "[playlist insights] fetch playlist insights error";

// Manage Modules Action Constants
export const ADD_MODULE = "[curriculum-sequence] Add new module";
export const UPDATE_MODULE = "[curriculum-sequence] Update module data";
export const DELETE_MODULE = "[curriculum-sequence] Delete module";
export const ORDER_MODULES = "[curriculum-sequence] Resequence modules";
export const UPDATE_CUSTOMIZED_PLAYLIST = "[curriculum-sequence] Update the customized playlist";
export const TOGGLE_MANAGE_MODULE = "[curriculum-sequence] toggle manage module modal";

export const FETCH_DIFFERENTIATION_STUDENT_LIST = "[differentiation] fetch student list";
export const UPDATE_DIFFERENTIATION_STUDENT_LIST = "[differentiation] student list update";
export const FETCH_DIFFERENTIATION_WORK = "[differentiation] fetch differentiation work";
export const SET_DIFFERENTIATION_WORK = "[differentiation] set differentiation work";
export const ADD_TEST_TO_DIFFERENTIATION = "[differentiation] add test";
export const ADD_RECOMMENDATIONS_ACTIONS = "[differentiation] add recommendations";
export const UPDATE_FETCH_DIFFERENTIATION_WORK_LOADING_STATE = "[differentiation] update fetch work loading state";
export const UPDATE_WORK_STATUS_DATA = "[differentiation] update work status data";
export const ADD_RESOURCE_TO_DIFFERENTIATION = "[differentiation] add resource";

export const PLAYLIST_ADD_ITEM_INTO_MODULE = "[playlist] add item into module";
export const PLAYLIST_ADD_SUBRESOURCE = "[playlist] add sub resource";
export const PLAYLIST_REMOVE_SUBRESOURCE = "[playlist] remove sub resource";
export const UPDATE_DESTINATION_CURRICULUM_SEQUENCE_REQUEST =
  "[playlist] update destination curriculum sequence request";

export const GET_SIGNED_REQUEST_FOR_RESOURCE_REQUEST = "[playlist] get signed request for resource request";
export const UPDATE_SIGNED_REQUEST_FOR_RESOURCE = "[playlist] update signed request for resource";

export const RESET_DESTINATION = "[playlist] reset destination";
export const SET_DESTINATION_ORIGINAL = "[playlist] set destination original data";
export const RESET_DESTINATION_FLAGS = "[playlist] reset destination flags";

export const DUPLICATE_MANAGE_CONTENT = "[playlist] duplicate mange content";
export const CANCEL_PLAYLIST_CUSTOMIZE = "[playlist] cancel manage content";
export const PUBLISH_CUSTOMIZED_DRAFT_PLAYLIST = "[playlist] publish customized playlist";
export const SET_VIDEO_PREVIEW_RESOURCE_MODAL = "[playlist] set video resource modal content";
export const ADD_SUB_RESOURCE_IN_DIFFERENTIATION = "[playlist] add sub-resource to test";
export const REMOVE_SUB_RESOURCE_FROM_TEST = "[playlist] remove sub-resource from test";

// Actions
export const updateCurriculumSequenceList = createAction(UPDATE_CURRICULUM_SEQUENCE_LIST);
export const updateCurriculumSequenceAction = createAction(UPDATE_CURRICULUM_SEQUENCE);
export const searchCurriculumSequencesAction = createAction(SEARCH_CURRICULUM_SEQUENCES);
export const searchGuidesAction = createAction(SEARCH_GUIDES);
export const searchGuideResultAction = createAction(SEARCH_GUIDES_RESULT);
export const searchContentAction = createAction(SEARCH_CONTENT_CURRICULUMS);
export const searchContentResultAction = createAction(SEARCH_CONTENT_CURRICULUMS_RESULT);
export const changeGuideAction = createAction(CHANGE_GUIDE);
export const setPublisherAction = createAction(SET_PUBLISHER);
export const setGuideAction = createAction(SET_GUIDE);
export const setContentCurriculumAction = createAction(SET_CONTENT_CURRICULUM);
export const saveGuideAlignmentAction = createAction(SAVE_GUIDE_ALIGNMENT);
export const toggleCheckedUnitItemAction = createAction(TOGGLE_CHECKED_UNIT_ITEM);
export const toggleAddContentAction = createAction(TOGGLE_ADD_CONTENT);
export const createAssignmentNowAction = createAction(CREATE_ASSIGNMENT_NOW);
export const setSelectedItemsForAssignAction = createAction(SET_SELECTED_ITEMS_FOR_ASSIGN_INIT);
export const setDataForAssignAction = createAction(SET_DATA_FOR_ASSIGN_INIT);
export const addContentToCurriculumSequenceAction = createAction(ADD_CONTENT_TO_CURRICULUM_RESULT);
export const saveCurriculumSequenceAction = createAction(SAVE_CURRICULUM_SEQUENCE);
export const addNewUnitAction = createAction(ADD_NEW_UNIT_INIT);
export const removeUnitAction = createAction(REMOVE_UNIT_INIT);
export const fetchAssignedAction = createAction(FETCH_ASSIGNED_REQUEST);
export const useThisPlayListAction = createAction(USE_THIS_PLAYLIST);

export const removeItemFromUnitAction = createAction(REMOVE_ITEM_FROM_UNIT);
export const putCurriculumSequenceAction = createAction(PUT_CURRICULUM_SEQUENCE);
export const fetchClassListAction = createAction(FETCH_CLASS_LIST_BY_DISTRICT_ID);
export const fetchClassListSuccess = createAction(FETCH_CLASS_LIST_SUCCESS);
export const fetchStudentListAction = createAction(FETCH_STUDENT_LIST_BY_GROUP_ID);
export const fetchStudentListSuccess = createAction(FETCH_STUDENT_LIST_SUCCESS);
export const dropPlaylistAction = createAction(DROP_PLAYLIST_ACTION);
export const fetchPlaylistDroppedAccessList = createAction(FETCH_PLAYLIST_ACCESS_LIST);
export const updateDroppedAccessList = createAction(UPDATE_DROPPED_ACCESS_LIST);
export const addItemIntoPlaylistModuleAction = createAction(PLAYLIST_ADD_ITEM_INTO_MODULE);
export const addSubresourceToPlaylistAction = createAction(PLAYLIST_ADD_SUBRESOURCE);
export const removeSubResourceAction = createAction(PLAYLIST_REMOVE_SUBRESOURCE);
export const fetchDifferentiationStudentListAction = createAction(FETCH_DIFFERENTIATION_STUDENT_LIST);
export const updateDifferentiationStudentListAction = createAction(UPDATE_DIFFERENTIATION_STUDENT_LIST);
export const fetchDifferentiationWorkAction = createAction(FETCH_DIFFERENTIATION_WORK);
export const setDifferentiationWorkAction = createAction(SET_DIFFERENTIATION_WORK);
export const addRecommendationsAction = createAction(ADD_RECOMMENDATIONS_ACTIONS);
export const updateFetchWorkLoadingStateAction = createAction(UPDATE_FETCH_DIFFERENTIATION_WORK_LOADING_STATE);
export const updateDestinationCurriculumSequenceRequestAction = createAction(
  UPDATE_DESTINATION_CURRICULUM_SEQUENCE_REQUEST
);
export const updateWorkStatusDataAction = createAction(UPDATE_WORK_STATUS_DATA);
export const addTestToDifferentationAction = createAction(ADD_TEST_TO_DIFFERENTIATION);
export const addResourceToDifferentiationAction = createAction(ADD_RESOURCE_TO_DIFFERENTIATION);
export const addSubResourceToTestInDiffAction = createAction(ADD_SUB_RESOURCE_IN_DIFFERENTIATION);
export const removeSubResourceInDiffAction = createAction(REMOVE_SUB_RESOURCE_FROM_TEST);

export const getSignedRequestAction = createAction(GET_SIGNED_REQUEST_FOR_RESOURCE_REQUEST);
export const updateSinedRequestAction = createAction(UPDATE_SIGNED_REQUEST_FOR_RESOURCE);
export const duplicateManageContentAction = createAction(DUPLICATE_MANAGE_CONTENT);
export const cancelPlaylistCustomizeAction = createAction(CANCEL_PLAYLIST_CUSTOMIZE);
export const publishCustomizedPlaylistAction = createAction(PUBLISH_CUSTOMIZED_DRAFT_PLAYLIST);
export const setEmbeddedVideoPreviewModal = createAction(SET_VIDEO_PREVIEW_RESOURCE_MODAL);

export const getAllCurriculumSequencesAction = ids => {
  if (!ids) {
    return {
      type: FETCH_CURRICULUM_SEQUENCES_ERROR
    };
  }
  return {
    type: FETCH_CURRICULUM_SEQUENCES,
    payload: ids
  };
};
export const approveOrRejectSinglePlaylistRequestAction = createAction(APPROVE_OR_REJECT_SINGLE_PLAYLIST_REQUEST);
export const approveOrRejectSinglePlaylistSuccessAction = createAction(APPROVE_OR_REJECT_SINGLE_PLAYLIST_SUCCESS);
export const setPlaylistDataAction = createAction(SET_PLAYLIST_DATA);
export const receiveCurrentPlaylistMetrics = createAction(FETCH_PLAYLIST_METRICS);
export const updatePlaylistMetrics = createAction(UPDATE_PLAYLIST_METRICS);
export const fetchPlaylistInsightsAction = createAction(FETCH_PLAYLIST_INSIGHTS);
export const onSuccessPlaylistInsightsAction = createAction(FETCH_PLAYLIST_INSIGHTS_SUCCESS);
export const onErrorPlaylistInsightsAction = createAction(FETCH_PLAYLIST_INSIGHTS_ERROR);

// Manage Modules Actions
export const toggleManageModulesVisibilityCSAction = createAction(TOGGLE_MANAGE_MODULE);
export const createNewModuleCSAction = createAction(ADD_MODULE);
export const updateModuleCSAction = createAction(UPDATE_MODULE);
export const deleteModuleCSAction = createAction(DELETE_MODULE);
export const resequenceModulesCSAction = createAction(ORDER_MODULES);
export const updatePlaylistCSAction = createAction(UPDATE_CUSTOMIZED_PLAYLIST);
export const resetDestinationAction = createAction(RESET_DESTINATION);
export const setOriginalDestinationData = createAction(SET_DESTINATION_ORIGINAL);
export const resetDestinationFlags = createAction(RESET_DESTINATION_FLAGS);

// State getters
const getCurriculumSequenceState = state => state.curriculumSequence;

export const getDifferentiationStudentListSelector = state => state.curriculumSequence.differentiationStudentList;

export const getDifferentiationWorkSelector = state => state.curriculumSequence.differentiationWork;

export const getDifferentiationWorkLoadingStateSelector = state =>
  state.curriculumSequence.isFetchingDifferentiationWork;

export const getWorkStatusDataSelector = state => state.curriculumSequence.workStatusData;

const getPublisher = state => {
  if (!state.curriculumSequence) return "";

  return state.curriculumSequence.selectedPublisher;
};

const getDestinationCurriculumSequence = state => state.curriculumSequence.destinationCurriculumSequence;

function* makeApiRequest(idsForFetch = []) {
  try {
    const unflattenedItems = yield all(idsForFetch.map(id => call(curriculumSequencesApi.getCurriculums, id)));

    // We're using flatten because return from the server
    // is array even if it's one item, so we flatten it
    const items = flatten(unflattenedItems);
    const { authors } = items[0];
    const userId = yield select(getUserId);
    if (authors && authors.map(author => author._id).includes(userId)) {
      items[0].isAuthor = true;
    } else {
      items[0].isAuthor = false;
    }
    // Normalize data
    if (idsForFetch.length > 1) {
      const curriculumSequenceSchema = new schema.Entity("curriculumSequenceList", {}, { idAttribute: "_id" });
      const userListSchema = [curriculumSequenceSchema];

      const {
        result: allCurriculumSequences,
        entities: { curriculumSequenceList: curriculumSequenceListObject }
      } = normalize(items, userListSchema);

      yield put(
        updateCurriculumSequenceList({
          allCurriculumSequences,
          curriculumSequenceListObject
        })
      );
    } else {
      yield put(updateCurriculumSequenceAction(items));
    }
  } catch (error) {
    if (error.data.message === "permission denied") {
      yield put(push("/author/playlists"));
      yield call(notification, { messageKey: "curriculumMakeApiErr" });
    } else {
      notification({ type: "warning", messageKey: "curriculumMakeApiWarn" });
    }
  }
}

function* fetchItemsFromApi({ payload: ids }) {
  yield call(makeApiRequest, ids);
}

/**
 * @typedef {Object} PutCurriculumSequencePayload
 * @property {string} id
 * @property {import('./components/CurriculumSequence').CurriculumSequenceType} curriculumSequence
 */

/**
 * @param {Object<String, String>} args
 * @param {PutCurriculumSequencePayload} [args.payload]
 */
function* putCurriculumSequence({ payload }) {
  const { id, curriculumSequence, isPlaylist = false } = payload;
  const oldData = cloneDeep(curriculumSequence);
  try {
    const dataToSend = omit(curriculumSequence, [
      "authors",
      "createdDate",
      "updatedDate",
      "sharedWith",
      "sharedType",
      "isAuthor",
      "collectionName",
      "testItems"
    ]);
    dataToSend.modules = dataToSend.modules.map(mod => {
      mod.data = mod.data.map(test => omit(test, ["standards", "alignment", "assignments", "testType", "status"]));
      return mod;
    });
    const response = yield curriculumSequencesApi.updateCurriculumSequence(id, dataToSend);
    const { authors, version, _id } = response;
    const userId = yield select(getUserId);
    if (authors && authors.map(author => author._id).includes(userId)) {
      response.isAuthor = true;
    } else {
      response.isAuthor = false;
    }
    oldData._id = _id;
    oldData.version = version;
    notification({ type: "success", msg: `Successfully saved ${response.title || ""}` });
    yield put(updateCurriculumSequenceAction(oldData));
    if (isPlaylist) {
      yield put(toggleManageModulesVisibilityCSAction(false));
    }
  } catch (error) {
    notification({ messageKey: "putCurriculumErr" });
  }
}

function* postSearchCurriculumSequence({ payload }) {
  try {
    const { publisher, type } = payload;
    const response = yield call(curriculumSequencesApi.searchCurriculumSequences, {
      publisher,
      type
    });
    const ids = response.map(curriculum => curriculum._id);
    yield call(makeApiRequest, ids);
  } catch (error) {
    notification({ messageKey: "commonErr" });
  }
}

function* searchGuides({ payload }) {
  try {
    const { publisher, type } = payload;
    const response = yield call(curriculumSequencesApi.searchCurriculumSequences, {
      publisher,
      type
    });
    yield put(searchGuideResultAction(response));
  } catch (error) {
    notification({ messageKey: "commonErr" });
  }
}

function* searchContent() {
  try {
    const publisher = yield select(getPublisher);
    const type = CURRICULUM_TYPE_CONTENT;
    const response = yield call(curriculumSequencesApi.searchCurriculumSequences, {
      publisher,
      type
    });
    yield put(searchContentResultAction(response));
  } catch (error) {
    notification({ messageKey: "commonErr" });
  }
}

function* changeGuide({ ids }) {
  try {
    yield call(makeApiRequest, ids);
  } catch (error) {
    notification({ messageKey: "commonErr" });
  }
}

function* setPublisher({ payload }) {
  try {
    const response = yield call(curriculumSequencesApi.searchCurriculumSequences, {
      publisher: payload,
      type: "guide"
    });
    yield put(searchGuideResultAction(response));
  } catch (error) {
    notification({ messageKey: "commonErr" });
    yield searchGuideResultAction([]);
  }
}

function* setGuide() {
  // Future logic based on guide selection
}

function* setContentCurriculum({ payload }) {
  const ids = [payload];
  yield call(makeApiRequest, ids);
}

function* saveGuideAlignment() {
  const state = yield select(getCurriculumSequenceState);
  const ids = [state.selectedGuide];
  yield call(makeApiRequest, ids);
}

function* assign({ payload }) {
  const { assignment, assignData } = payload;
  const { user } = yield select(getUserSelector);

  assignData.testId = assignment.testId;

  try {
    yield call(assignmentApi.create, {
      assignedBy: user._id,
      assignments: [assignData]
    });
  } catch (error) {
    notification({ type: "warning", msg: error.message });
    return error;
  }

  assignment.assigned = true;

  yield put({
    type: UPDATE_ASSIGNMENT,
    payload: assignment
  });
  notification({ type: "info", msg: `${assignment.id} successfully assigned` });
  return assignment;
}

function* createAssignmentNow({ payload }) {
  const currentAssignment = payload;

  /** @type {State} */
  const curriculumSequenceState = yield select(getCurriculumSequenceState);
  const destinationCurriculumSequence = {
    ...curriculumSequenceState.destinationCurriculumSequence
  };

  // Fetch test and see if it's published
  yield put(receiveTestByIdAction(currentAssignment.testId));
  yield take(RECEIVE_TEST_BY_ID_SUCCESS);
  const test = yield select(getTestSelector);

  // Publish it if it's not already published
  if (test.status === DRAFT) {
    yield put(publishTestAction(currentAssignment.testId));
    yield take(UPDATE_TEST_STATUS);
  }

  const { user } = yield select(getUserSelector);
  const userClass = user.orgData.defaultClass;
  const assignData = { ...curriculumSequenceState.dataForAssign };

  yield put(fetchGroupMembersAction({ classId: userClass }));
  yield take(SET_GROUP_MEMBERS);
  const students = yield select(getStudentsSelector);

  // NOTE: assign count is missing, how to implement it?
  assignData.class.push({ students, _id: userClass });

  const curriculumAssignment = getCurriculumAsssignmentMatch(currentAssignment, destinationCurriculumSequence);

  // assignment already in curriculum
  if (!isEmpty(curriculumAssignment)) {
    const assignData = curriculumSequenceState.dataForAssign;
    yield assign({ payload: { assignment: currentAssignment, assignData } });
    yield saveCurriculumSequence();
    return;
  }

  // assignment not in destination curriculum
  if (isEmpty(curriculumAssignment)) {
    const destinationModules = destinationCurriculumSequence.modules;

    // Create misc unit if it doesn't exist
    const haveMiscUnit = destinationModules.map(m => m.name.toLowerCase()).indexOf("misc") !== -1;

    const lastModuleId =
      destinationModules[destinationModules.length - 1] && destinationModules[destinationModules.length - 1].id;

    // NOTE: what happens if no modules are present?
    if (!haveMiscUnit) {
      const newUnit = {
        id: v4(),
        data: [],
        name: "Misc"
      };

      try {
        /* eslint-disable-next-line */
        yield addNewUnit({
          payload: {
            afterUnitId: lastModuleId,
            newUnit,
            shouldSave: false
          }
        });
        /* eslint-disable-next-line */
        yield addContentToCurriculumSequence({
          payload: {
            contentToAdd: currentAssignment,
            toUnit: newUnit
          }
        });
        yield assign({ payload: { assignment: currentAssignment, assignData } });
      } catch (error) {
        notification({ messageKey: "createMiscErr" });
        console.warn("Error create misc unit.", error);
        return;
      }
    }

    try {
      // Find misc unit
      const miscUnitIndex = destinationModules.map(m => m.name.toLowerCase()).indexOf("misc");

      /* eslint-disable*/
      const response = yield addContentToCurriculumSequence({
        payload: {
          contentToAdd: currentAssignment,
          toUnit: destinationModules[miscUnitIndex]
        }
      });
      const assignResult = yield assign({ payload: { assignment: currentAssignment, assignData } });

      if (response instanceof Error) return response;
      if (assignResult instanceof Error) return assignResult;
      /* eslint-enable */
    } catch (error) {
      console.warn("Add content to misc unit failed.");
      notification({ messageKey: "createMiscErr" });
      return;
    }

    destinationCurriculumSequence.modules = [
      ...destinationCurriculumSequence.modules.map(moduleItem => {
        const updatedModule = { ...moduleItem };
        const updatedModuleData = moduleItem.data.map(dataItem => {
          const updatedDataItem = { ...dataItem };
          return updatedDataItem;
        });

        updatedModule.data = updatedModuleData;
        return updatedModule;
      })
    ];

    try {
      yield curriculumSequencesApi.updateCurriculumSequence(
        destinationCurriculumSequence._id,
        destinationCurriculumSequence
      );

      yield put(updateCurriculumSequenceAction(destinationCurriculumSequence));
      /* eslint-disable-next-line */
      yield saveCurriculumSequence();
    } catch (error) {
      notification({ messageKey: "updatingCurriculumErr" });
      console.warn("There was an error updating the curriculum sequence", error);
    }
  }
}

export function* updateDestinationCurriculumSequencesaga({ payload }) {
  try {
    let curriculumSequence = yield select(getDestinationCurriculumSequence);
    if (payload.customizeDraft) {
      curriculumSequence = {
        ...curriculumSequence,
        title: `${curriculumSequence.title} - ${moment().format("MM/DD/YYYY HH:mm")}`
      };
    }
    yield put(putCurriculumSequenceAction({ id: curriculumSequence._id, curriculumSequence }));
  } catch (err) {
    notification({ messageKey: "updatingCurriculumErr" });
    console.error("update curriculum sequence Error", err);
  }
}

export function* getSignedRequestSaga({ payload }) {
  try {
    yield put(updateSinedRequestAction(null));
    const request = yield call(curriculumSequencesApi.getSignedRequest, payload);
    yield put(updateSinedRequestAction(request));
  } catch (err) {
    notification({ messageKey: "loadingResourceErr" });
  }
}

function* addContentToCurriculumSequence({ payload }) {
  // TODO: change unit to module to stay consistent
  const { contentToAdd, toUnit } = payload;

  if (!contentToAdd || !toUnit) return;

  // Prevent duplicated items to be added
  if (toUnit.data.map(item => item.id).indexOf(contentToAdd.id) !== -1) {
    notification({ type: "warning", messageKey: "assignmentExists" });
    return new Error("Assignment already exists.");
  }

  const updatedUnit = { ...toUnit };
  updatedUnit.data.push(contentToAdd);

  yield put({
    type: ADD_CONTENT_TO_CURRICULUM_RESULT,
    payload: updatedUnit
  });
}

function* saveCurriculumSequence({ payload }) {
  // call api and update curriculum
  const destinationCurriculumSequence = { ...(yield select(getDestinationCurriculumSequence)) };

  const id = destinationCurriculumSequence._id;
  delete destinationCurriculumSequence._id;

  yield putCurriculumSequence({
    payload: { id, curriculumSequence: destinationCurriculumSequence, isPlaylist: payload?.isPlaylist }
  });
}

function* setDataForAssign(payload) {
  yield put({
    type: SET_DATA_FOR_ASSIGN,
    payload
  });
}

function* setSelectedItemsForAssign({ payload }) {
  yield put(setCurrentAssignmentAction(payload));
  yield put({
    type: SET_SELECTED_ITEMS_FOR_ASSIGN,
    payload
  });
}

function* addNewUnit({ payload }) {
  const { afterUnitId, newUnit, shouldSave = true } = payload;

  const curriculumSequenceState = yield select(getCurriculumSequenceState);
  const destinationCurriculumSequence = {
    ...curriculumSequenceState.destinationCurriculumSequence
  };

  newUnit.id = v4();

  const modules = cloneDeep(destinationCurriculumSequence.modules);
  const moduleIds = destinationCurriculumSequence.modules.map(module => module.id);
  const insertIndex = moduleIds.indexOf(afterUnitId);
  modules.splice(insertIndex + 1, 0, newUnit);

  yield put({
    type: ADD_NEW_UNIT,
    payload: modules
  });

  if (shouldSave) {
    yield call(saveCurriculumSequence);
  }
}

function* removeUnit({ payload }) {
  const unitId = payload;
  const curriculumSequenceState = yield select(getCurriculumSequenceState);
  const destinationCurriculumSequence = {
    ...curriculumSequenceState.destinationCurriculumSequence
  };

  const modules = cloneDeep(destinationCurriculumSequence.modules);
  const moduleIds = destinationCurriculumSequence.modules.map(module => module.id);
  const unitIndex = moduleIds.indexOf(unitId);
  modules.splice(unitIndex, 1);

  yield put({
    type: REMOVE_UNIT,
    payload: modules
  });
}

function* fetchAssigned() {
  try {
    const assigned = yield call(assignmentApi.fetchAssigned, "");

    yield put({
      type: FETCH_ASSIGNED_RESULT,
      payload: assigned.assignments
    });
  } catch (error) {
    return error;
  }
}

function* duplicateManageContentSaga({ payload }) {
  try {
    const { _id: originalId, title: originalTitle } = payload;
    const duplicatedDraftPlaylist = yield call(curriculumSequencesApi.duplicatePlayList, {
      _id: originalId,
      title: originalTitle,
      forUseThis: true
    });

    yield put(updateCurriculumSequenceAction(duplicatedDraftPlaylist));
    yield put(setOriginalDestinationData(payload));
    yield put(toggleManageContentActiveAction());
    yield put(push(`/author/playlists/customize/${originalId}/${duplicatedDraftPlaylist._id}`));
  } catch (error) {
    console.error(error);
    notification({ messageKey: "commonErr" });
  }
}

function* useThisPlayListSaga({ payload }) {
  try {
    const { _id, title, grades, subjects, groupId, onChange, isStudent } = payload;
    yield call(userContextApi.setLastUsedPlayList, { _id, title, grades, subjects });
    yield call(userContextApi.setRecentUsedPlayLists, { _id, title, grades, subjects });
    yield put(receiveLastPlayListAction());
    if (!isStudent) {
      yield put(receiveRecentPlayListsAction());
    }
    yield put(getAllCurriculumSequencesAction([_id]));
    const location = yield select(state => state.router.location.pathname);
    const urlHasUseThis = location.match(/use-this/g);
    if (isStudent && onChange) {
      yield put(push({ pathname: `/home/playlist/${_id}`, state: { currentGroupId: groupId } }));
      yield put(receiveCurrentPlaylistMetrics({ groupId, playlistId: _id }));
    } else if (onChange && !urlHasUseThis) {
      yield put(push({ pathname: `/author/playlists/${_id}`, state: { from: "playlistLibrary" } }));
    } else {
      yield put(
        push({
          pathname: `/author/playlists/playlist/${_id}/use-this`,
          state: { from: "myPlaylist" }
        })
      );
      yield put(receiveCurrentPlaylistMetrics({ playlistId: _id }));
    }
  } catch (error) {
    console.error(error);
    notification({ messageKey: "commonErr" });
  }
}

function* approveOrRejectSinglePlaylistSaga({ payload }) {
  try {
    if (
      payload.status === "published" &&
      (!payload.collections || (payload.collections && !payload.collections.length))
    ) {
      notification({ messageKey: "playlistNotAssociated" });
      return;
    }
    yield call(curriculumSequencesApi.updatePlaylistStatus, payload);
    yield put(approveOrRejectSinglePlaylistSuccessAction(payload));
    notification({ type: "success", messageKey: "playlistUpdated" });
  } catch (error) {
    console.error(error);
    notification({ messageKey: "playlistUpdateFailed" });
  }
}

function* fetchClassListByDistrictId() {
  try {
    const data = yield call(groupApi.fetchMyGroups);
    const classList = data.map(x => ({ classId: x._id, className: x.name }));
    yield put(
      fetchClassListSuccess({ classList: classList.map(x => ({ id: x.classId, name: x.className, type: "class" })) })
    );
  } catch (error) {
    notification({ msg: error?.data?.message });
    console.error(error);
  }
}

function* fetchStudentListByGroupId({ payload }) {
  try {
    const requestPayload = {
      districtId: payload.districtId,
      groupIds: [payload.classId]
    };
    const studentList = yield call(groupApi.fetchStudentsByGroupId, requestPayload);
    yield put(
      fetchStudentListSuccess({
        studentList: studentList.map(x => ({
          id: x.studentId,
          name: `${x?.firstName || ""} ${x?.lastName || ""}`,
          type: "student",
          classId: payload.classId
        }))
      })
    );
  } catch (error) {
    notification({ msg: error?.data?.message });
    console.error(error);
  }
}

function* dropPlaylist({ payload }) {
  try {
    const result = yield call(groupApi.dropPlaylist, payload);
    return result;
  } catch (error) {
    notification({ messageKey: "dropPlaylistErr" });
    console.error(error);
  }
}

function* fetchPlaylistAccessList({ payload }) {
  try {
    if (payload) {
      const { districtId, playlistId } = payload;
      const result = yield call(groupApi.fetchPlaylistAccess, playlistId);
      if (result) {
        yield put(updateDroppedAccessList(result));
        const classIds = [...result?.classList?.map(x => x?._id), ...result?.studentList?.map(x => x?.groupId)];
        if (classIds?.length) {
          yield all(classIds.map(classId => put(fetchStudentListAction({ districtId, classId }))));
        }
      }
    }
  } catch (error) {
    notification({ messageKey: "fetchClassErr" });
    console.error(error);
  }
}

function* fetchPlaylistMetricsSaga({ payload }) {
  try {
    const { playlistId } = payload || {};
    if (!playlistId) {
      throw new Error("Insufficient Data for fetching playlist metrics: PlaylistId is required");
    }
    const result = yield call(curriculumSequencesApi.fetchPlaylistMetrics, payload);
    if (result) {
      yield put(updatePlaylistMetrics(result));
    }
  } catch (error) {
    notification({ messageKey: "fetchPlaylistErr" });
    console.error(error);
  }
}

function* fetchPlaylistInsightsSaga({ payload }) {
  try {
    const { playlistId } = payload || {};
    if (!playlistId) {
      throw new Error("Insufficient Data for fetching playlist insights: playlistId is required");
    }
    const result = yield call(curriculumSequencesApi.fetchPlaylistInsights, payload);
    if (result) {
      yield put(onSuccessPlaylistInsightsAction(result));
    }
  } catch (error) {
    yield put(onErrorPlaylistInsightsAction(error));
    notification({ messageKey: "fetchPlaylistInsightsErr" });
    console.error(error);
  }
}

function* fetchDifferentiationStudentListSaga({ payload }) {
  try {
    const { studentList = [] } = yield call(assignmentApi.getDifferentiationStudentList, payload);
    yield put(updateDifferentiationStudentListAction(studentList));
  } catch (err) {
    console.error(err);
    yield call(notification, { msg: err.data.message });
  }
}

function structureWorkData(workData, statusData, firstLoad = false) {
  const newState = produce(workData, draft => {
    if (firstLoad) {
      Object.keys(statusData).forEach(recommentdationKey => {
        const testRecommendations = statusData[recommentdationKey]
          .filter(x => x.derivedFrom === "TESTS")
          .map(({ resourceId, resourceName, testStandards }) => ({
            testId: resourceId,
            description: resourceName,
            testStandards
          }));

        const lowerCasekey = recommentdationKey.toLowerCase();
        draft[lowerCasekey] = draft[lowerCasekey] || [];

        draft[lowerCasekey].push(...testRecommendations);
      });
    }

    Object.keys(draft).forEach(type => {
      const currentStatusArray = statusData[type.toUpperCase()];
      if (!currentStatusArray) {
        draft[type].forEach(i => {
          i.status = "RECOMMENDED";
        });
      } else {
        draft[type].forEach(i => {
          const currentStatus = currentStatusArray.find(
            s =>
              (s.derivedFrom === "STANDARDS" && s.standardIdentifiers.includes(i.standardIdentifier)) ||
              (s.derivedFrom === "TESTS" && s.resourceId === i.testId)
          );
          if (currentStatus) {
            const { masteryRange, studentTestActivities, users } = currentStatus;
            i.status = "ADDED";
            i.masteryRange = [masteryRange.min, masteryRange.max];
            i.averageMastery = (sumBy(studentTestActivities, "score") / sumBy(studentTestActivities, "maxScore")) * 100;
            i.notStartedCount = users.length - studentTestActivities.length;
          } else {
            i.status = "RECOMMENDED";
            i.masteryRange = [currentStatusArray[0].masteryRange.min, currentStatusArray[0].masteryRange.max];
          }
        });
      }
    });
  });
  return newState;
}

function* fetchDifferentiationWorkSaga({ payload }) {
  try {
    yield put(updateFetchWorkLoadingStateAction(true));
    const workData = yield call(recommendationsApi.getDifferentiationWork, payload.testId);
    const statusData = yield call(recommendationsApi.getRecommendationsStatus, {
      assignmentId: payload.assignmentId,
      groupId: payload.groupId
    });
    yield put(updateWorkStatusDataAction(statusData));
    const structuredData = structureWorkData(workData, statusData, true);
    yield put(setDifferentiationWorkAction(structuredData));
    yield put(updateFetchWorkLoadingStateAction(false));
  } catch (err) {
    console.error(err);
    yield put(setDifferentiationWorkAction({}));
    yield put(updateFetchWorkLoadingStateAction(false));
    yield call(notification, { msg: err.data.message });
  }
}

function* addRecommendationsSaga({ payload }) {
  try {
    let response = null;
    if (Array.isArray(payload)) {
      for (const payloadItem of payload) {
        response = yield call(recommendationsApi.acceptRecommendations, payloadItem);
      }
    } else {
      response = yield call(recommendationsApi.acceptRecommendations, payload);
    }
    payload = Array.isArray(payload) ? payload[0] : payload;
    yield put(updateFetchWorkLoadingStateAction(true));
    const statusData = yield call(recommendationsApi.getRecommendationsStatus, {
      assignmentId: payload.assignmentId,
      groupId: payload.groupId
    });
    yield put(updateWorkStatusDataAction(statusData));
    const workData = yield select(getDifferentiationWorkSelector);
    const structuredData = structureWorkData(workData, statusData);
    yield put(setDifferentiationWorkAction(structuredData));
    yield call(notification, { msg: response.message });
    yield put(updateFetchWorkLoadingStateAction(false));
  } catch (err) {
    console.error(err);
    yield call(notification, { msg: err.data.message });
  }
}

function* cancelPlaylistCustomize({ payload }) {
  try {
    const { parentId } = payload;
    const parentPlaylist = yield select(state => state.curriculumSequence.originalData);
    if (parentPlaylist && parentPlaylist._id) {
      yield put(updateCurriculumSequenceAction(parentPlaylist));
    } else if (parentId) {
      yield put(makeApiRequest([parentId]));
    } else throw new Error("Parent playlist id is missing");
    yield put(toggleManageContentActiveAction());
    yield put(push(`/author/playlists/playlist/${parentId}/use-this`));
  } catch (e) {
    console.error("Cancel customize playlist error - ", e);
    notification({ messageKey: "cancelPlaylistCustomizationErr" });
  }
}

function* publishDraftCustomizedPlaylist({ payload }) {
  try {
    yield put(resetDestinationFlags());
    yield updateDestinationCurriculumSequencesaga({ payload: { customizeDraft: true } });
    yield call(curriculumSequencesApi.publishPlaylist, payload);
    yield put(push(`/author/playlists/playlist/${payload.id}/use-this`));
  } catch (e) {
    console.error("Customized draft playlist publish failed - ", e);
    notification({ messageKey: "publishDraftPlaylistErr" });
  }
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(FETCH_CURRICULUM_SEQUENCES, fetchItemsFromApi),
    yield takeLatest(PUT_CURRICULUM_SEQUENCE, putCurriculumSequence),
    yield takeLatest(SEARCH_CURRICULUM_SEQUENCES, postSearchCurriculumSequence),
    yield takeLatest(SEARCH_GUIDES, searchGuides),
    yield takeLatest(SEARCH_CONTENT_CURRICULUMS, searchContent),
    yield takeLatest(CHANGE_GUIDE, changeGuide),
    yield takeLatest(SET_PUBLISHER, setPublisher),
    yield takeLatest(SET_GUIDE, setGuide),
    yield takeLatest(SET_CONTENT_CURRICULUM, setContentCurriculum),
    yield takeLatest(SAVE_GUIDE_ALIGNMENT, saveGuideAlignment),
    yield takeLatest(CREATE_ASSIGNMENT_NOW, createAssignmentNow),
    yield takeLatest(SAVE_CURRICULUM_SEQUENCE, saveCurriculumSequence),
    yield takeLatest(SET_DATA_FOR_ASSIGN_INIT, setDataForAssign),
    yield takeLatest(SET_SELECTED_ITEMS_FOR_ASSIGN_INIT, setSelectedItemsForAssign),
    yield takeLatest(ADD_NEW_UNIT_INIT, addNewUnit),
    yield takeLatest(REMOVE_UNIT_INIT, removeUnit),
    yield takeLatest(FETCH_ASSIGNED_REQUEST, fetchAssigned),
    yield takeLatest(ADD_CONTENT_TO_CURRICULUM_RESULT, moveContentToPlaylistSaga),
    yield takeLatest(USE_THIS_PLAYLIST, useThisPlayListSaga),
    yield takeLatest(APPROVE_OR_REJECT_SINGLE_PLAYLIST_REQUEST, approveOrRejectSinglePlaylistSaga),
    yield takeLatest(FETCH_CLASS_LIST_BY_DISTRICT_ID, fetchClassListByDistrictId),
    yield takeLatest(FETCH_STUDENT_LIST_BY_GROUP_ID, fetchStudentListByGroupId),
    yield takeLatest(DROP_PLAYLIST_ACTION, dropPlaylist),
    yield takeLatest(FETCH_PLAYLIST_ACCESS_LIST, fetchPlaylistAccessList),
    yield takeLatest(FETCH_PLAYLIST_METRICS, fetchPlaylistMetricsSaga),
    yield takeLatest(FETCH_PLAYLIST_INSIGHTS, fetchPlaylistInsightsSaga),
    yield takeLatest(FETCH_DIFFERENTIATION_STUDENT_LIST, fetchDifferentiationStudentListSaga),
    yield takeLatest(FETCH_DIFFERENTIATION_WORK, fetchDifferentiationWorkSaga),
    yield takeLatest(ADD_RECOMMENDATIONS_ACTIONS, addRecommendationsSaga),
    yield takeEvery(UPDATE_DESTINATION_CURRICULUM_SEQUENCE_REQUEST, updateDestinationCurriculumSequencesaga),
    yield takeLatest(GET_SIGNED_REQUEST_FOR_RESOURCE_REQUEST, getSignedRequestSaga),
    yield takeLatest(DUPLICATE_MANAGE_CONTENT, duplicateManageContentSaga),
    yield takeLatest(CANCEL_PLAYLIST_CUSTOMIZE, cancelPlaylistCustomize),
    yield takeLatest(PUBLISH_CUSTOMIZED_DRAFT_PLAYLIST, publishDraftCustomizedPlaylist)
  ]);
}

/**
 * @typedef {object} Class
 * @property {String=} _id
 * @property {Number} status
 * @property {Number} totalNumber
 * @property {number} submittedNumber
 */

/**
 * @typedef {object} AssignData
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {String} openPolicy
 * @property {String} closePolicy
 * @property {Class[]} class
 * @property {Boolean} specificStudents
 * @property {string} testId
 */

/**
 * @typedef {object} State
 * @property {string[]} allCurriculumSequences
 * @property {Object<string, import('./components/CurriculumSequence').CurriculumSequenceType>} byId
 * @property {import('./components/CurriculumSequence').CurriculumSearchResult} guides
 * @property {import('./components/CurriculumSequence').CurriculumSearchResult} contentCurriculums
 * @property {string} selectedGuide
 * @property {string} selectedContent
 * @property {import('./components/CurriculumSequence').CurriculumSequenceType}
 * destinationCurriculumSequence
 * @property {string[]} checkedUnitItems
 * @property {boolean} isContentExpanded
 * @property {any[]} selectedItemsForAssign
 * @property {AssignData} dataForAssign
 */

/**
 * @typedef {object} NewUnit
 * @property {string} id
 * @property {string} name
 * @property {any[]} data
 */

const getDefaultAssignData = () => ({
  startDate: moment().valueOf(),
  endDate: moment().valueOf(),
  openPolicy: "Automatically on Start Date",
  closePolicy: "Automatically on Due Date",
  class: [],
  specificStudents: false,
  students: [],
  testId: ""
});

// Reducers
const initialState = {
  activeRightPanel: "manageContent",
  allCurriculumSequences: [],
  destinationDirty: false,
  originalData: null,
  /**
   * @type {Object.<string, import('./components/CurriculumSequence').CurriculumSequenceType>}}
   */
  byId: {},

  /**
   * search result of type = "guide"
   * @type {{id: string, titile: string}[]}
   */
  guides: [],

  /**
   * search result of type = "content"
   * @type {{id: string, title: string}[]}
   */
  contentCurriculums: [],

  /** Selected guide that will appear on the left side */
  selectedGuide: "",

  /** Selected content that will appear on the right side */
  selectedContent: "",

  /** ids of guides that are checkmarked */
  checkedUnitItems: [],

  isContentExpanded: false,

  selectedItemsForAssign: [],

  destinationCurriculumSequence: {},

  assigned: [],

  dataForAssign: getDefaultAssignData(),

  dropPlaylistSource: {
    searchSource: {
      classList: [],
      studentList: []
    },
    droppedAccess: {
      classList: [],
      studentList: []
    }
  },
  playlistMetrics: [],
  classListFetching: false,
  studentListFetching: false,
  playlistInsights: {},
  loadingInsights: true,
  differentiationStudentList: [],
  differentiationWork: {},
  isFetchingDifferentiationWork: false,
  workStatusData: {},

  // Playlist Test Details State
  playlistTestDetailsModal: {
    isVisible: false,
    currentTestId: null
  },
  isVideoResourcePreviewModal: false
};

/**
 * @param {State} state
 * @param {any} param1
 */
const setCurriculumSequencesReducer = (state, { payload }) => {
  // Go trough all sequences and if type is guide, replace current guide
  const idForRemoval = Object.keys(state.byId)
    .map(key => state.byId[key])
    .filter(item => item.type === "guide")
    .map(item => item._id)[0];

  const newGuideId = Object.keys(payload.curriculumSequenceListObject)
    .map(key => payload.curriculumSequenceListObject[key])
    .filter(item => item.type === "guide")
    .map(item => item._id)[0];

  const contentIds = Object.keys(payload.curriculumSequenceListObject)
    .map(key => payload.curriculumSequenceListObject[key])
    .filter(item => item.type === "content")
    .map(item => item._id);
  // Set to latest content Id
  let latestContentCurriculumId;
  if (contentIds.length > 0 && !state.selectedContent) {
    latestContentCurriculumId = contentIds[contentIds.length - 1];
  } else if (state.selectedContent) {
    latestContentCurriculumId = state.selectedContent;
  } else {
    latestContentCurriculumId = "";
  }

  if (newGuideId && idForRemoval) {
    delete state.byId[idForRemoval];
    state.byId[newGuideId] = payload.allCurriculumSequences[newGuideId];
    state.allCurriculumSequences.splice(state.allCurriculumSequences.indexOf(idForRemoval), 1);
  }

  state.allCurriculumSequences = [...state.allCurriculumSequences, ...payload.allCurriculumSequences];
  state.byId = { ...state.byId, ...payload.curriculumSequenceListObject };
  state.destinationCurriculumSequence = { ...state.byId[newGuideId] };
  state.selectedGuide = newGuideId;
  state.selectedContent = latestContentCurriculumId;
  state.checkedUnitItems = [];
};

/**
 * @param {State} state
 * @param {Object} param2
 * @param {import('./components/CurriculumSequence').CurriculumSequenceType} [param2.payload]
 */
const updateCurriculumSequenceReducer = (state, { payload }) => {
  const curriculumSequence = payload;
  const id = (curriculumSequence?.[0] && curriculumSequence[0]._id) || curriculumSequence._id;

  state.byId[id] = curriculumSequence?.[0] || curriculumSequence;
  // if (curriculumSequence.type === "guide") {
  state.destinationCurriculumSequence = curriculumSequence[0] || curriculumSequence;
  state.originalData = state.destinationCurriculumSequence;
  state.destinationDirty = false;
  // }
};

/**
 * @param {State} state
 * @param {Object} param2
 * @param {import('./components/CurriculumSequence').ModuleData} [param2.payload]
 */
const updateAssignmentReducer = (state, { payload }) => {
  const assignment = payload;
  const updatedModules = state.destinationCurriculumSequence.modules.map(module => {
    module.data = module.data.map(moduleDataItem => {
      if (moduleDataItem.testId === payload.testId) {
        return assignment;
      }
      return moduleDataItem;
    });
    return module;
  });

  state.destinationCurriculumSequence.modules = updatedModules;
};

const searchGuidesReducer = (state, { payload }) => {
  state.guides = payload;

  // When publisher is changed and new guides are available - set them to first one
  if (
    payload &&
    payload[0] &&
    payload[0]._id &&
    payload.map(guides => guides._id).indexOf(state.selectedGuide) === -1
  ) {
    const defaultSelectedGuide = payload[0]._id;
    state.selectedGuide = defaultSelectedGuide;
  }
};

const setPublisherReducer = (state, { payload }) => {
  state.selectedPublisher = payload;
};

const setGuideReducer = (state, { payload }) => {
  state.selectedGuide = payload;
};

const setContentCurriculumReducer = (state, { payload }) => {
  state.selectedContent = payload;
};

const searchContentReducer = (state, { payload }) => {
  state.contentCurriculums = payload;
};

/**
 * @param {State} state
 * @param {any} param1
 */
const toggleCheckedUnitItemReducer = (state, { payload }) => {
  const currentlyCheckedItemId = payload;
  const existingItemIndex = state.checkedUnitItems.indexOf(currentlyCheckedItemId);
  if (existingItemIndex === -1) {
    state.checkedUnitItems.push(currentlyCheckedItemId);
  } else {
    state.checkedUnitItems.splice(existingItemIndex, 1);
  }
};

const toggleAddContentReducer = state => {
  state.isContentExpanded = !state.isContentExpanded;
};

/**
 * @param {State} state
 * @param {any} param1
 */
const createAssignmentReducer = (state, { payload }) => {
  const assignmentApiResponse = payload;
  const curriculumSequenceState = { ...state };
  const testIdsFromResponse = assignmentApiResponse.map(item => item.testId);
  const destinationCurriculumSequence = {
    ...state.destinationCurriculumSequence
  };

  let updatedCurriculumSequence;
  curriculumSequenceState.allCurriculumSequences.forEach(curriculumId => {
    updatedCurriculumSequence = curriculumSequenceState.byId[curriculumId];
    if (updatedCurriculumSequence.type !== "guide") {
      return;
    }

    if (curriculumSequenceState.byId) {
      updatedCurriculumSequence.modules = [
        ...curriculumSequenceState.byId[curriculumId].modules.map(moduleItem => {
          const updatedModule = { ...moduleItem };
          const updatedModuleData = moduleItem.data.map(dataItem => {
            const updatedDataItem = { ...dataItem };
            if (testIdsFromResponse.indexOf(dataItem.testId) !== -1) {
              updatedDataItem.assigned = true;
            }
            return updatedDataItem;
          });

          updatedModule.data = updatedModuleData;
          return updatedModule;
        })
      ];
    }
  });

  if (!updatedCurriculumSequence) {
    return { ...state };
  }

  state.selectedItemsForAssign = [];
  state.destinationCurriculumSequence = {
    ...destinationCurriculumSequence,
    modules: updatedCurriculumSequence.modules
  };
};

/**
 * @param {State} state
 * @param {Object<String, String>} args
 * @param {String|null} [args.payload]
 * we pass null when we deliberatly cancel the selected item without any user feedback
 * otherwise we pass *testId*
 */
const setSelectedItemsForAssignReducer = (state, { payload }) => {
  // we pass null when we deliberatly cancel the selected item without any user feedback
  if (!payload && payload !== null) {
    notification({ type: "info", messageKey: "noTestId" });
    state.selectedItemsForAssign.pop();
  } else if (payload === null) {
    state.selectedItemsForAssign = [];
    state.dataForAssign = getDefaultAssignData();
  } else if (typeof payload === "string") {
    state.selectedItemsForAssign.push(payload);
  } else if (Array.isArray(payload)) {
    state.selectedItemsForAssign = payload;
  }
};

/**
 * @param {State} state
 * @param {any} param1
 */
const setDataForAssignReducer = (state, { payload }) => {
  if (!payload) {
    state.dataForAssign = getDefaultAssignData();
    return;
  }
  state.dataForAssign = payload;
};

/**
 * @param {State} state
 * @param {Object<String, String>} args
 * @param {import('./components/CurriculumSequence').CurriculumSequenceType} [args.payload]
 */

function* moveContentToPlaylistSaga(payload) {
  try {
    const state = yield select(getCurriculumSequenceState);
    const newState = moveContentInPlaylist(state, payload);
    yield put(
      putCurriculumSequenceAction({
        id: newState.destinationCurriculumSequence._id,
        curriculumSequence: newState.destinationCurriculumSequence
      })
    );
  } catch (e) {
    notification({ messageKey: "movingTestErr" });
  }
}

const moveContentInPlaylist = (state, { payload }) => {
  const { toModuleIndex, toContentIndex, fromModuleIndex, fromContentIndex } = payload;
  let newPlaylist;
  if (!toContentIndex) {
    newPlaylist = produce(state.destinationCurriculumSequence, draft => {
      if (toModuleIndex != 0 && !toModuleIndex) {
        return notification({ messageKey: "invalidModuleSelected" });
      }
      draft.modules[toModuleIndex].data.push(draft.modules[fromModuleIndex].data[fromContentIndex]);
      draft.modules[fromModuleIndex].data.splice(fromContentIndex, 1);
    });
  } else {
    newPlaylist = produce(stable.destinationCurriculumSequence, draft => {
      if (toModuleIndex != 0 && !toModuleIndex) {
        return notification({ messageKey: "invalidModuleSelected" });
      }
      draft.modules[toModuleIndex].data.splice(
        toContentIndex,
        0,
        draft.modules[fromModuleIndex].data[fromContentIndex]
      );
      draft.modules[fromModuleIndex].data.splice(fromContentIndex, 1);
    });
  }
  return {
    ...state,
    destinationCurriculumSequence: {
      ...state.destinationCurriculumSequence,
      modules: newPlaylist.modules
    }
  };
};

/**
 * @param {State} state
 * @param {Object<String, Object>} param2
 * @param {Object<String, Object>} [param2.payload]
 * @param {String} [param2.payload.moduleId]
 * @param {String} [param2.payload.itemId]
 */
const removeItemFromUnitReducer = (state, { payload }) => {
  const { moduleId, itemId } = payload;
  const destinationCurriculumSequence = cloneDeep(state.destinationCurriculumSequence);
  const modules = [...destinationCurriculumSequence.modules];

  const moduleIndex = destinationCurriculumSequence.modules.map(m => m.id).indexOf(moduleId);

  const itemIndex = destinationCurriculumSequence.modules[moduleIndex].data.map(d => d.id).indexOf(itemId);

  modules[moduleIndex].data.splice(itemIndex, 1);

  destinationCurriculumSequence.modules = modules;

  return {
    ...state,
    destinationCurriculumSequence: {
      ...destinationCurriculumSequence,
      modules
    }
  };
};

/**
 * @param {State} state
 * @param {Object<String, Object>} param2
 * @param {Object<String, Object>} [param2.payload]
 * @param {String} [param2.payload.afterUnitId]
 * @param {import('./components/CurriculumSequence').Module} [param2.payload.newUnit]
 */
const addNewUnitReducer = (state, { payload }) => {
  const modules = payload;
  const destinationCurriculumSequence = {
    ...state.destinationCurriculumSequence
  };

  return {
    ...state,
    destinationCurriculumSequence: {
      ...destinationCurriculumSequence,
      modules
    }
  };
};

/**
 * @param {State} state
 * @param {Object<String, Object>} param2
 * @param {Object<String, Object>} [param2.payload]
 * @param {String} [param2.payload.afterUnitId]
 * @param {import('./components/CurriculumSequence').Module} [param2.payload.newUnit]
 */
const removeUnitReducer = (state, { payload }) => {
  const modules = payload;
  const destinationCurriculumSequence = {
    ...state.destinationCurriculumSequence
  };

  return {
    ...state,
    destinationCurriculumSequence: {
      ...destinationCurriculumSequence,
      modules
    }
  };
};

/**
 * @param {State} state
 * @param {Object<String, Object>} param2
 *
 */
const loadAssignedReducer = (state, { payload }) => ({
  ...state,
  assigned: payload
});

/**
 * @param {import('./components/CurriculumSequence').ModuleData} unitItem
 * @param {import('./components/CurriculumSequence').CurriculumSequenceType} curriculumSequence
 */
function getCurriculumAsssignmentMatch(unitItem, curriculumSequence) {
  let matchingUnitItem = {};

  // here we should go with checking the testIds instead

  curriculumSequence.modules.forEach(m => {
    m.data.forEach(d => {
      if (d.testId === unitItem.testId) {
        matchingUnitItem = d;
      }
    });
  });

  return { ...matchingUnitItem };
}

function approveOrRejectSinglePlaylistReducer(state, { payload }) {
  return {
    ...state,
    destinationCurriculumSequence: {
      ...state.destinationCurriculumSequence,
      status: payload.status,
      collections: payload.collections ? payload.collections : state.destinationCurriculumSequence.collections
    }
  };
}

function setPlaylistDataReducer(state, { payload }) {
  return {
    ...state,
    destinationCurriculumSequence: {
      ...state.destinationCurriculumSequence,
      ...payload
    }
  };
}

function updateClassList(state, { payload }) {
  return {
    ...state,
    dropPlaylistSource: {
      ...state.dropPlaylistSource,
      searchSource: {
        ...state.dropPlaylistSource.searchSource,
        classList: payload.classList
      }
    },
    classListFetching: false
  };
}

function updateStudentList(state, { payload }) {
  return {
    ...state,
    dropPlaylistSource: {
      ...state.dropPlaylistSource,
      searchSource: {
        ...state.dropPlaylistSource.searchSource,
        studentList: uniqBy(state?.dropPlaylistSource?.searchSource?.studentList.concat(payload.studentList), "id")
      }
    },
    studentListFetching: false
  };
}

function updatePlaylistDroppedAccessList(state, { payload }) {
  return {
    ...state,
    dropPlaylistSource: {
      ...state.dropPlaylistSource,
      droppedAccess: {
        classList: payload.classList,
        studentList: payload.studentList
      }
    }
  };
}

function updatePlaylistMetricsList(state, { payload }) {
  return {
    ...state,
    playlistMetrics: payload
  };
}

function onSuccessPlaylistInsights(state, { payload }) {
  return {
    ...state,
    playlistInsights: payload,
    loadingInsights: false
  };
}

function onErrorPlaylistInsights(state) {
  return {
    ...state,
    playlistInsights: {},
    loadingInsights: true
  };
}

const createNewModuleState = (title, description, moduleId, moduleGroupName) => ({
  title,
  description,
  moduleId,
  moduleGroupName,
  data: []
});

function toggleManageModuleHandler(state, { payload }) {
  return { ...state, isManageModulesVisible: payload };
}

function updateDifferentiationStudentList(state, { payload }) {
  state.differentiationStudentList = payload;
}
export const PLAYLIST_REORDER_TESTS = "[playlist] destination reorder test";
export const playlistDestinationReorderTestsAction = createAction(PLAYLIST_REORDER_TESTS);

export const REMOVE_TEST_FROM_MODULE_PLAYLIST = "[playlist edit] test remove from module";
export const playlistTestRemoveFromModuleAction = createAction(REMOVE_TEST_FROM_MODULE_PLAYLIST);

export const TOGGLE_MANAGE_CONTENT_ACTIVE = "[playlist] toggle manage content";
export const toggleManageContentActiveAction = createAction(TOGGLE_MANAGE_CONTENT_ACTIVE);

// Playlist Test Details Modal
export const TOGGLE_PLAYLIST_TEST_DETAILS_MODAL_WITH_ID = "[playlist] toggle test details modal";
export const togglePlaylistTestDetailsModalWithId = createAction(TOGGLE_PLAYLIST_TEST_DETAILS_MODAL_WITH_ID);

export default createReducer(initialState, {
  [UPDATE_CURRICULUM_SEQUENCE_LIST]: setCurriculumSequencesReducer,
  [UPDATE_CURRICULUM_SEQUENCE]: updateCurriculumSequenceReducer,
  [SEARCH_GUIDES_RESULT]: searchGuidesReducer,
  [SEARCH_CONTENT_CURRICULUMS_RESULT]: searchContentReducer,
  [SET_PUBLISHER]: setPublisherReducer,
  [SET_GUIDE]: setGuideReducer,
  [SET_CONTENT_CURRICULUM]: setContentCurriculumReducer,
  [TOGGLE_CHECKED_UNIT_ITEM]: toggleCheckedUnitItemReducer,
  [TOGGLE_ADD_CONTENT]: toggleAddContentReducer,
  [CREATE_ASSIGNMENT_OK]: createAssignmentReducer,
  [SET_SELECTED_ITEMS_FOR_ASSIGN]: setSelectedItemsForAssignReducer,
  [SET_DATA_FOR_ASSIGN]: setDataForAssignReducer,
  [REMOVE_ITEM_FROM_UNIT]: removeItemFromUnitReducer,
  [ADD_NEW_UNIT]: addNewUnitReducer,
  [REMOVE_UNIT]: removeUnitReducer,
  [UPDATE_ASSIGNMENT]: updateAssignmentReducer,
  [FETCH_ASSIGNED_RESULT]: loadAssignedReducer,
  [APPROVE_OR_REJECT_SINGLE_PLAYLIST_SUCCESS]: approveOrRejectSinglePlaylistReducer,
  [SET_PLAYLIST_DATA]: setPlaylistDataReducer,
  [FETCH_CLASS_LIST_BY_DISTRICT_ID]: state => ({ ...state, classListFetching: true }),
  [FETCH_CLASS_LIST_SUCCESS]: updateClassList,
  [FETCH_STUDENT_LIST_BY_GROUP_ID]: state => ({ ...state, studentListFetching: true }),
  [FETCH_STUDENT_LIST_SUCCESS]: updateStudentList,
  [UPDATE_DROPPED_ACCESS_LIST]: updatePlaylistDroppedAccessList,
  [UPDATE_PLAYLIST_METRICS]: updatePlaylistMetricsList,
  [FETCH_PLAYLIST_INSIGHTS_SUCCESS]: onSuccessPlaylistInsights,
  [FETCH_PLAYLIST_INSIGHTS_ERROR]: onErrorPlaylistInsights,
  [TOGGLE_MANAGE_MODULE]: toggleManageModuleHandler,
  [ADD_MODULE]: (state, { payload }) => {
    const newModule = createNewModuleState(
      payload?.title || payload?.moduleName,
      payload?.description,
      payload.moduleId,
      payload.moduleGroupName
    );
    if (!state.destinationCurriculumSequence.modules) {
      state.destinationCurriculumSequence.modules = [];
    }
    if (payload?.afterModuleIndex !== undefined) {
      state.destinationCurriculumSequence?.modules?.splice(payload.afterModuleIndex, 0, newModule);
    } else {
      state.destinationCurriculumSequence?.modules?.push(newModule);
    }
    return state;
  },
  [UPDATE_MODULE]: (state, { payload }) => {
    const { id, title, description, moduleId, moduleGroupName } = payload;
    if (payload !== undefined) {
      state.destinationCurriculumSequence.modules[id].title = title;
      state.destinationCurriculumSequence.modules[id].description = description;
      state.destinationCurriculumSequence.modules[id].moduleId = moduleId;
      state.destinationCurriculumSequence.modules[id].moduleGroupName = moduleGroupName;
    }
    return state;
  },
  [DELETE_MODULE]: (state, { payload }) => {
    if (payload !== undefined) {
      state.destinationCurriculumSequence?.modules?.splice(payload, 1);
    }
    return state;
  },
  [ORDER_MODULES]: (state, { payload }) => {
    const { oldIndex, newIndex } = payload;
    const obj = state.destinationCurriculumSequence?.modules?.splice(oldIndex, 1);
    state.destinationCurriculumSequence?.modules?.splice(newIndex, 0, obj[0]);
    return state;
  },
  [UPDATE_DIFFERENTIATION_STUDENT_LIST]: updateDifferentiationStudentList,
  [SET_DIFFERENTIATION_WORK]: (state, { payload }) => {
    state.differentiationWork = payload;
  },
  [ADD_TEST_TO_DIFFERENTIATION]: (state, { payload }) => {
    const { type, testId, masteryRange, title, testStandards } = payload;
    const alreadyPresent = Object.keys(state.differentiationWork)
      .flatMap(x => state.differentiationWork?.[x] || [])
      .find(x => x?.testId === testId);
    if (!alreadyPresent) {
      state.differentiationWork[type].push({
        testId,
        description: title,
        status: "RECOMMENDED",
        masteryRange,
        testStandards
      });
    }
  },
  [ADD_RESOURCE_TO_DIFFERENTIATION]: (state, { payload }) => {
    const { type, contentId, masteryRange, contentTitle, contentType, contentUrl } = payload;
    const alreadyPresent = Object.keys(state.differentiationWork)
      .flatMap(x => state.differentiationWork?.[x] || [])
      .find(x => x.contentId === contentId);
    if (!alreadyPresent) {
      state.differentiationWork[type].push({
        contentId,
        description: contentTitle,
        status: "RECOMMENDED",
        masteryRange,
        contentType,
        contentUrl
      });
    }
  },
  [UPDATE_WORK_STATUS_DATA]: (state, { payload }) => {
    state.workStatusData = payload;
  },
  [UPDATE_FETCH_DIFFERENTIATION_WORK_LOADING_STATE]: (state, { payload }) => {
    state.isFetchingDifferentiationWork = payload;
  },
  [PLAYLIST_REMOVE_SUBRESOURCE]: (state, { payload }) => {
    const { moduleIndex, contentId, itemIndex } = payload;
    if (state.destinationCurriculumSequence.modules[moduleIndex].data[itemIndex].resources) {
      state.destinationCurriculumSequence.modules[moduleIndex].data[
        itemIndex
      ].resources = state.destinationCurriculumSequence.modules[moduleIndex].data[itemIndex].resources.filter(
        x => x.contentId !== contentId
      );
    }
  },
  [PLAYLIST_ADD_SUBRESOURCE]: (state, { payload }) => {
    const { moduleIndex, item, itemIndex } = payload;
    const { id: contentId, contentType, type, fromPlaylistTestsBox, standardIdentifiers, status, ...itemObj } = item;
    if (!state.destinationCurriculumSequence.modules[moduleIndex].data[itemIndex].resources) {
      state.destinationCurriculumSequence.modules[moduleIndex].data[itemIndex].resources = [];
    }
    const resources = state.destinationCurriculumSequence.modules[moduleIndex].data[itemIndex].resources;
    if (!resources.find(x => x.contentId === contentId)) {
      resources.push({ contentId, contentType, ...itemObj });
    }
  },
  [PLAYLIST_ADD_ITEM_INTO_MODULE]: (state, { payload }) => {
    const { moduleIndex, item, afterIndex } = payload;
    const content = {
      ...item,
      standards: [],
      assignments: []
    };
    if (afterIndex || afterIndex === 0) {
      state.destinationCurriculumSequence.modules[moduleIndex].data.splice(afterIndex + 1, 0, content);
    } else {
      state.destinationCurriculumSequence.modules[moduleIndex].data.push(content);
    }
    state.destinationDirty = true;
  },
  [PLAYLIST_REORDER_TESTS]: (state, { payload }) => {
    const { oldIndex, newIndex, mIndex } = payload;
    const [takenOutTest] = state.destinationCurriculumSequence.modules[mIndex].data.splice(oldIndex, 1);
    state.destinationCurriculumSequence.modules[mIndex].data.splice(newIndex, 0, takenOutTest);
    state.destinationDirty = true;
  },
  [REMOVE_TEST_FROM_MODULE_PLAYLIST]: (state, { payload }) => {
    const { moduleIndex, itemId } = payload;
    if (state?.destinationCurriculumSequence?.modules?.[moduleIndex]?.data?.find(x => x.contentId === itemId)) {
      state.destinationCurriculumSequence.modules[moduleIndex].data = state.destinationCurriculumSequence.modules[
        moduleIndex
      ].data.filter(x => x.contentId !== itemId);
      state.destinationDirty = true;
    }
  },
  [TOGGLE_MANAGE_CONTENT_ACTIVE]: (state, { payload }) => {
    state.activeRightPanel = payload;
  },
  [UPDATE_SIGNED_REQUEST_FOR_RESOURCE]: (state, { payload }) => {
    state.signedRequest = payload;
  },
  [TOGGLE_PLAYLIST_TEST_DETAILS_MODAL_WITH_ID]: (state, { payload }) => {
    if (payload?.id) {
      state.playlistTestDetailsModal.isVisible = true;
      state.playlistTestDetailsModal.currentTestId = payload.id;
    } else {
      state.playlistTestDetailsModal.isVisible = false;
      state.playlistTestDetailsModal.currentTestId = null;
    }
  },
  [RESET_DESTINATION]: state => {
    if (state.originalData) {
      state.destinationCurriculumSequence = state.originalData;
    } else {
      state.destinationCurriculumSequence = {};
    }
    state.activeRightPanel = "manageContent";

    state.destinationDirty = false;
  },
  [SET_DESTINATION_ORIGINAL]: (state, { payload }) => {
    state.originalData = payload;
  },
  [RESET_DESTINATION_FLAGS]: state => {
    state.activeRightPanel = "manageContent";
    state.destinationDirty = false;
  },
  [SET_VIDEO_PREVIEW_RESOURCE_MODAL]: (state, { payload }) => {
    state.isVideoResourcePreviewModal = payload;
  },
  [ADD_SUB_RESOURCE_IN_DIFFERENTIATION]: (state, { payload }) => {
    const { type, parentTestId, contentId, contentTitle, contentUrl, contentType } = payload;
    state.differentiationWork[type].forEach((x, i) => {
      if (x.testId === parentTestId) {
        const subResource = {
          contentId,
          contentTitle,
          contentUrl,
          contentType
        };
        if (!state.differentiationWork[type][i].resources) {
          state.differentiationWork[type][i].resources = [subResource];
        } else {
          if (!state.differentiationWork[type][i].resources.find(y => y.contentId === contentId)) {
            state.differentiationWork[type][i].resources.push(subResource);
          }
        }
      }
    });
  },
  [REMOVE_SUB_RESOURCE_FROM_TEST]: (state, { payload }) => {
    const { type, parentTestId, contentId } = payload;
    state.differentiationWork[type].forEach((x, i) => {
      if (x.testId === parentTestId) {
        state.differentiationWork[type][i].resources = state.differentiationWork[type][i].resources.filter(
          y => y.contentId !== contentId
        );
      }
    });
  }
});
