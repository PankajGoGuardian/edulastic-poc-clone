import { createAction, createReducer } from "redux-starter-kit";
import * as moment from "moment";
import { message } from "antd";
import { takeLatest, put, call, all, select, take } from "redux-saga/effects";
import { flatten, cloneDeep, isEmpty, keyBy, omit } from "lodash";
import { v4 } from "uuid";
import { normalize, schema } from "normalizr";
import { push } from "connected-react-router";
import { curriculumSequencesApi, assignmentApi, userContextApi, groupApi } from "@edulastic/api";
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
import {
  fetchGroupMembersAction,
  SET_GROUP_MEMBERS,
  getStudentsSelector,
  getGroupsSelector
} from "../sharedDucks/groups";
import { receiveLastPlayListAction, receiveRecentPlayListsAction } from "../Playlist/ducks";

// Constants
export const CURRICULUM_TYPE_GUIDE = "guide";
export const CURRICULUM_TYPE_CONTENT = "content";
const PUBLISHED = "published";
const DRAFT = "draft";

// Types
export const FETCH_CURRICULUM_SEQUENCES =
  "[curriculum-sequence] fetch list of curriculum sequences";
export const UPDATE_CURRICULUM_SEQUENCE = "[curriculum-sequence-ui] update curriculum sequence";
export const UPDATE_CURRICULUM_SEQUENCE_LIST =
  "[curriculum-sequence-ui] update curriculum sequence list";
export const FETCH_CURRICULUM_SEQUENCES_ERROR = "[curriculum-sequence-ui] error no ids provided";
export const PUT_CURRICULUM_SEQUENCE = "[curriculum-sequence] put curriculum sequence";
export const SEARCH_CURRICULUM_SEQUENCES = "[curriculum-sequence] search curriculum sequences";
export const SEARCH_GUIDES = "[curriculum-sequence] search curriculum sequences - guides";
export const SEARCH_GUIDES_RESULT =
  "[curriculum-sequence] search curriculum sequences - guides - result";
export const SEARCH_CONTENT_CURRICULUMS =
  "[curriculum-sequence] search curriculum sequences - content";
export const SEARCH_CONTENT_CURRICULUMS_RESULT =
  "[curriculum-sequence] search curriculum sequences - content - result";
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
export const SET_SELECTED_ITEMS_FOR_ASSIGN_INIT =
  "[curriculum-sequence] set selected items for assign init";
export const SET_DATA_FOR_ASSIGN_INIT = "[curriculum-sequence] set data for assign init";
export const SET_DATA_FOR_ASSIGN = "[curriculum-sequence] set data for assign";
export const ADD_CONTENT_TO_CURRICULUM_RESULT =
  "[curriculum-sequence] add content to curriculum result";
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
export const USE_THIS_PLAYLIST = "[playlist] use this play list";
export const APPROVE_OR_REJECT_SINGLE_PLAYLIST_REQUEST =
  "[curriculum-sequence] approve or reject single playlist request";
export const APPROVE_OR_REJECT_SINGLE_PLAYLIST_SUCCESS =
  "[curriculum-sequence] approve or reject single playlist success";
export const SET_PLAYLIST_DATA = "[curriculum-sequence] set playlist data";
export const FETCH_CLASS_LIST_BY_DISTRICT_ID = "[drop-playlist] fetch class list by district id";
export const FETCH_CLASS_LIST_SUCCESS = "[drop-playlist] fetch class list success";
export const FETCH_STUDENT_LIST_BY_GROUP_ID = "[drop-playlist] fetch student list by group id";
export const FETCH_STUDENT_LIST_SUCCESS = "[drop-playlist] fetch student list success";
export const DROP_PLAYLIST_ACTION = "[drop-playlist] drop playlist - grant/revoke access";
export const FETCH_PLAYLIST_ACCESS_LIST = "[drop-playlist] fetch playlist access list";
export const UPDATE_DROPPED_ACCESS_LIST = "[drop-playlist] update playlist access list";

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
export const approveOrRejectSinglePlaylistRequestAction = createAction(
  APPROVE_OR_REJECT_SINGLE_PLAYLIST_REQUEST
);
export const approveOrRejectSinglePlaylistSuccessAction = createAction(
  APPROVE_OR_REJECT_SINGLE_PLAYLIST_SUCCESS
);
export const setPlaylistDataAction = createAction(SET_PLAYLIST_DATA);

// State getters
const getCurriculumSequenceState = state => state.curriculumSequence;

const getPublisher = state => {
  if (!state.curriculumSequence) return "";

  return state.curriculumSequence.selectedPublisher;
};

const getSelectedItemsForAssign = state => {
  if (
    !state.curriculumSequence.selectedItemsForAssign ||
    state.curriculumSequence.selectedItemsForAssign.length === 0
  ) {
    return [];
  }
  return state.curriculumSequence.selectedItemsForAssign;
};

const getDestinationCurriculumSequence = state =>
  state.curriculumSequence.destinationCurriculumSequence;

function* makeApiRequest(idsForFetch = []) {
  try {
    const unflattenedItems = yield all(
      idsForFetch.map(id => call(curriculumSequencesApi.getCurriculums, id))
    );

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
      const curriculumSequenceSchema = new schema.Entity(
        "curriculumSequenceList",
        {},
        { idAttribute: "_id" }
      );
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
      yield call(
        message.error,
        "You can no longer use this as sharing access has been revoked by author."
      );
    } else {
      message.warning(
        `We're sorry, seems to be a problem contacting the server, try again in a few minutes`
      );
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
  const { id, curriculumSequence } = payload;

  try {
    const dataToSend = omit(curriculumSequence, [
      "authors",
      "createdDate",
      "updatedDate",
      "sharedWith",
      "sharedType"
    ]);
    const response = yield curriculumSequencesApi.updateCurriculumSequence(id, dataToSend);

    message.success(`Successfully saved ${response.title}`);
    yield put(updateCurriculumSequenceAction(response));
  } catch (error) {
    message.error("There was an error updating the curriculum sequence");
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
    message.error("Something went wrong, please try again");
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
    message.error("Something went wrong, please try again");
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
    message.error("Something went wrong, please try again");
  }
}

function* changeGuide({ ids }) {
  try {
    yield call(makeApiRequest, ids);
  } catch (error) {
    message.error("Something went wrong, please try again");
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
    message.error("Something went wrong, please try again");
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
    message.warning(error.message);
    return error;
  }

  assignment.assigned = true;

  yield put({
    type: UPDATE_ASSIGNMENT,
    payload: assignment
  });

  message.info(`${assignment.id} successfully assigned`);

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

  const curriculumAssignment = getCurriculumAsssignmentMatch(
    currentAssignment,
    destinationCurriculumSequence
  );

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
      destinationModules[destinationModules.length - 1] &&
      destinationModules[destinationModules.length - 1].id;

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
        message.error("Sorry, something went wrong and assign now failed.");
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
      message.error("Sorry, something went wrong and assign now failed.");
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
      message.error("There was an error updating the curriculum sequence");
      console.warn("There was an error updating the curriculum sequence", error);
    }
  }
}

function* addContentToCurriculumSequence({ payload }) {
  // TODO: change unit to module to stay consistent
  const { contentToAdd, toUnit } = payload;

  if (!contentToAdd || !toUnit) return;

  // Prevent duplicated items to be added
  if (toUnit.data.map(item => item.id).indexOf(contentToAdd.id) !== -1) {
    message.warning("Assignment already exists.");
    return new Error("Assignment already exists.");
  }

  const updatedUnit = { ...toUnit };
  updatedUnit.data.push(contentToAdd);

  yield put({
    type: ADD_CONTENT_TO_CURRICULUM_RESULT,
    payload: updatedUnit
  });
}

function* saveCurriculumSequence() {
  // call api and update curriculum
  const destinationCurriculumSequence = { ...(yield select(getDestinationCurriculumSequence)) };

  const id = destinationCurriculumSequence._id;
  delete destinationCurriculumSequence._id;

  yield putCurriculumSequence({
    payload: { id, curriculumSequence: destinationCurriculumSequence }
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

function* useThisPlayListSaga({ payload }) {
  try {
    const { _id, title, onChange } = payload;
    yield call(userContextApi.setLastUsedPlayList, { _id, title });
    yield call(userContextApi.setRecentUsedPlayLists, { _id, title });
    yield put(receiveLastPlayListAction());
    yield put(receiveRecentPlayListsAction());
    yield put(getAllCurriculumSequencesAction([_id]));
    const location = yield select(state => state.router.location.pathname);
    const urlHasUseThis = location.match(/use-this/g);
    if (onChange && !urlHasUseThis) {
      yield put(push({ pathname: `/author/playlists/${_id}`, state: { from: "playlistLibrary" } }));
    } else {
      yield put(
        push({
          pathname: `/author/playlists/${_id}/use-this`,
          state: { from: "favouritePlaylist" }
        })
      );
    }
  } catch (error) {
    console.error(error);
    message.error("something went wrong");
  }
}

function* approveOrRejectSinglePlaylistSaga({ payload }) {
  try {
    if (
      payload.status === "published" &&
      (!payload.collections || (payload.collections && !payload.collections.length))
    ) {
      message.error("Playlist is not associated with any collection.");
      return;
    }
    yield call(curriculumSequencesApi.updatePlaylistStatus, payload);
    yield put(approveOrRejectSinglePlaylistSuccessAction(payload));
    message.success("Playlist Updated Successfully.");
  } catch (error) {
    console.error(error);
    message.error(error?.data?.message || "Playlist Update Failed.");
  }
}

function* fetchClassListByDistrictId({ payload }) {
  try {
    const data = yield call(groupApi.fetchMyGroups);
    const classList = data.map(x => ({ classId: x._id, className: x.name }));
    yield put(fetchClassListSuccess({ classList: classList.map(x => ({ id: x.classId, name: x.className, type: "class" })) }));
  } catch (error) {
    message.error(error?.data?.message);
    console.error(error);
  }
}

function* fetchStudentListByGroupId({ payload }) {
  try {
    const requestPayload = {
      districtId: payload.districtId,
      groupIds: [payload.classId]
    }
    const studentList = yield call(groupApi.fetchStudentsByGroupId, requestPayload);
    yield put(fetchStudentListSuccess({
      studentList: studentList.map(x => ({
        id: x.studentId, name: `${x?.firstName || ""} ${x?.lastName || ""}`,
        type: "student",
        classId: payload.classId
      }))
    }));
  } catch (error) {
    message.error(error?.data?.message);
    console.error(error);
  }
}

function* dropPlaylist({ payload }) {
  try {
    const result = yield call(groupApi.dropPlaylist, payload);
    return result;
  } catch (error) {
    message.error("DropPlaylist is failing");
    console.error(error);
  }
}

function* fetchPlaylistAccessList({ payload }) {
  try {
    if (payload) {
      const result = yield call(groupApi.fetchPlaylistAccess, payload);
      if (result) {
        yield put(updateDroppedAccessList(result));
      }
    }
  } catch (error) {
    message.error("DropPlaylist is failing");
    console.error(error);
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
    yield takeLatest(FETCH_PLAYLIST_ACCESS_LIST, fetchPlaylistAccessList)
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
  allCurriculumSequences: [],

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
  }
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

  state.allCurriculumSequences = [
    ...state.allCurriculumSequences,
    ...payload.allCurriculumSequences
  ];
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
  const id = curriculumSequence?.[0]._id;

  state.byId[id] = curriculumSequence?.[0] || curriculumSequence;
  // if (curriculumSequence.type === "guide") {
  state.destinationCurriculumSequence = curriculumSequence[0] || curriculumSequence;
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
    message.info("No testId for this item");
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
    message.error("Moving test failed");
  }
}

const moveContentInPlaylist = (state, { payload }) => {
  const { toModuleIndex, toContentIndex, fromModuleIndex, fromContentIndex } = payload;
  let newPlaylist;
  if (!toContentIndex) {
    newPlaylist = produce(state.destinationCurriculumSequence, draft => {
      if (toModuleIndex != 0 && !toModuleIndex) {
        return message.error("Invalid module selected");
      }
      draft.modules[toModuleIndex].data.push(draft.modules[fromModuleIndex].data[fromContentIndex]);
      draft.modules[fromModuleIndex].data.splice(fromContentIndex, 1);
    });
  } else {
    newPlaylist = produce(stable.destinationCurriculumSequence, draft => {
      if (toModuleIndex != 0 && !toModuleIndex) {
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

  const itemIndex = destinationCurriculumSequence.modules[moduleIndex].data
    .map(d => d.id)
    .indexOf(itemId);

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
      collections: payload.collections
        ? payload.collections
        : state.destinationCurriculumSequence.collections
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
    }
  }
}

function updateStudentList(state, { payload }) {
  return {
    ...state,
    dropPlaylistSource: {
      ...state.dropPlaylistSource,
      searchSource: {
        ...state.dropPlaylistSource.searchSource,
        studentList: state?.dropPlaylistSource?.searchSource?.studentList.concat(payload.studentList)
      }
    }
  }
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
  }
}

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
  [FETCH_CLASS_LIST_SUCCESS]: updateClassList,
  [FETCH_STUDENT_LIST_SUCCESS]: updateStudentList,
  [UPDATE_DROPPED_ACCESS_LIST]: updatePlaylistDroppedAccessList
});
