import { createAction, createReducer } from 'redux-starter-kit';
import { message } from 'antd';
import {
  takeLatest,
  put,
  call,
  all,
  select
} from 'redux-saga/effects';
import { flatten, cloneDeep } from 'lodash';
import { v4 } from 'uuid';
import { normalize, schema } from 'normalizr';
import { curriculumSequencesApi, assignmentApi } from '@edulastic/api';
import { setCurrentAssignmentAction } from '../TestPage/components/Assign/ducks';
import * as moment from 'moment';

// Constants
export const CURRICULUM_TYPE_GUIDE = 'guide';
export const CURRICULUM_TYPE_CONTENT = 'content';

// Types
export const FETCH_CURRICULUM_SEQUENCES = '[curriculum-sequence] fetch list of curriculum sequences';
export const UPDATE_CURRICULUM_SEQUENCE = '[curriculum-sequence-ui] update curriculum sequence';
export const UPDATE_CURRICULUM_SEQUENCE_LIST = '[curriculum-sequence-ui] update curriculum sequence list';
export const FETCH_CURRICULUM_SEQUENCES_ERROR = '[curriculum-sequence-ui] error no ids provided';
export const PUT_CURRICULUM_SEQUENCE = '[curriculum-sequence] put curriculum sequence';
export const SEARCH_CURRICULUM_SEQUENCES = '[curriculum-sequence] search curriculum sequences';
export const SEARCH_GUIDES = '[curriculum-sequence] search curriculum sequences - guides';
export const SEARCH_GUIDES_RESULT = '[curriculum-sequence] search curriculum sequences - guides - result';
export const SEARCH_CONTENT_CURRICULUMS = '[curriculum-sequence] search curriculum sequences - content';
export const SEARCH_CONTENT_CURRICULUMS_RESULT = '[curriculum-sequence] search curriculum sequences - content - result';
export const CHANGE_GUIDE = '[curriculum-sequence] change curriculum sequence (guide)';
export const SET_PUBLISHER = '[curriculum-sequence] set selected publisher';
export const SET_GUIDE = '[curriculum-sequence] set selected guide';
export const SAVE_GUIDE_ALIGNMENT = '[curriculum-sequence] save guide alignment';
export const SET_CONTENT_CURRICULUM = '[curriculum-sequence] set selected content';
export const TOGGLE_CHECKED_UNIT_ITEM = '[curriculum-sequence] toggle checked unit item';
export const TOGGLE_ADD_CONTENT = '[curriculum-sequence-ui] toggle add content';
export const CREATE_ASSIGNMENT = '[curriculum-sequence] create assignment';
export const CREATE_ASSIGNMENT_OK = '[curriculum-sequence] create assignment ok';
export const SET_SELECTED_ITEMS_FOR_ASSIGN = '[curriculum-sequence] set selected items for assign';
export const SET_SELECTED_ITEMS_FOR_ASSIGN_INIT = '[curriculum-sequence] set selected items for assign init';
export const SET_DATA_FOR_ASSIGN_INIT = '[curriculum-sequence] set data for assign init';
export const SET_DATA_FOR_ASSIGN = '[curriculum-sequence] set data for assign';
export const ADD_CONTENT_TO_CURRICULUM = '[curriculum-sequence] add content to curriculum';
export const ADD_CONTENT_TO_CURRICULUM_RESULT = '[curriculum-sequence] add content to curriculum result';
export const REMOVE_ITEM_FROM_UNIT = '[curriculum-sequence] remove item from unit';
export const SAVE_CURRICULUM_SEQUENCE = '[curriculum-sequence] save curriculum sequence';
export const ADD_NEW_UNIT_TO_DESTINATION = '[curriculum-sequence] add new unit to destination';


// Actions
export const updateCurriculumSequenceList = createAction(UPDATE_CURRICULUM_SEQUENCE_LIST);
export const updateCurriculumSequenceAction = createAction(UPDATE_CURRICULUM_SEQUENCE);
export const searchCurriculumSequences = createAction(SEARCH_CURRICULUM_SEQUENCES);
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
export const createAssignmentAction = createAction(CREATE_ASSIGNMENT);
export const setSelectedItemsForAssignAction = createAction(SET_SELECTED_ITEMS_FOR_ASSIGN_INIT);
export const setDataForAssignAction = createAction(SET_DATA_FOR_ASSIGN_INIT);
export const addContentToCurriculumSequenceAction = createAction(ADD_CONTENT_TO_CURRICULUM);
export const saveCurriculumSequenceAction = createAction(SAVE_CURRICULUM_SEQUENCE);
export const addNewUnitToDestinationAction = createAction(ADD_NEW_UNIT_TO_DESTINATION);
export const removeItemFromUnitAction = createAction(REMOVE_ITEM_FROM_UNIT);
export const putCurriculumSequenceAction = createAction(PUT_CURRICULUM_SEQUENCE);


export const getAllCurriculumSequences = (ids) => {
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

// State getters
const getCurriculumSequenceState = state => state.curriculumSequence;
const getPublisher = (state) => {
  if (!state.curriculumSequence) return '';

  return state.curriculumSequence.selectedPublisher;
};
const getSelectedContent = (state) => {
  if (!state.selectedContent) return '';

  return state.curriculumSequence.selectedContent;
};
const getSelectedItemsForAssign = (state) => {
  if (
    !state.curriculumSequence.selectedItemsForAssign ||
    state.curriculumSequence.selectedItemsForAssign.length === 0
  ) {
    return [];
  }
  return state.curriculumSequence.selectedItemsForAssign;
};

const getDestinationCurriculumSequence = (state) => {
  return state.curriculumSequence.destinationCurriculumSequence;
};

function* makeApiRequest(idsForFetch = []) {
  try {
    const unflattenedItems = yield all(
      idsForFetch.map(id => call(curriculumSequencesApi.getCurriculums, id))
    );

    // We're using flatten because return from the server
    // is array even if it's one item, so we flatten it
    const items = flatten(unflattenedItems);

    // Normalize data
    const curriculumSequenceSchema = new schema.Entity('curriculumSequenceList', {}, { idAttribute: '_id' });
    const userListSchema = [curriculumSequenceSchema];

    const {
      result: allCurriculumSequences,
      entities: { curriculumSequenceList: curriculumSequenceListObject }
    } = normalize(items, userListSchema);

    yield put(updateCurriculumSequenceList({ allCurriculumSequences, curriculumSequenceListObject }));
  } catch (error) {
    message.warning(`We're sorry, seems to be a problem contacting the server, try again in a few minutes`);
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
    const response = yield curriculumSequencesApi
      .updateCurriculumSequence(id, curriculumSequence);

    message.success(`Successfully saved ${response.title}`);
    yield put(updateCurriculumSequenceAction(response));
  } catch (error) {
    message.error('There was an error updating the curriculum sequence');
  }
}

function* postSearchCurriculumSequence({ payload }) {
  try {
    const { publisher, type } = payload;
    const response = yield call(curriculumSequencesApi.searchCurriculumSequences, { publisher, type });
    const ids = response.map(curriculum => curriculum._id);
    yield call(makeApiRequest, ids);
  } catch (error) {
    message.error('Something went wrong, please try again');
  }
}

function* searchGuides({ payload }) {
  try {
    const { publisher, type } = payload;
    const response = yield call(curriculumSequencesApi.searchCurriculumSequences, { publisher, type });
    yield put(searchGuideResultAction(response));
  } catch (error) {
    message.error('Something went wrong, please try again');
  }
}

function* searchContent() {
  try {
    const publisher = yield select(getPublisher);
    const type = CURRICULUM_TYPE_CONTENT;
    const response = yield call(curriculumSequencesApi.searchCurriculumSequences, { publisher, type });
    yield put(searchContentResultAction(response));
  } catch (error) {
    message.error('Something went wrong, please try again');
  }
}

function* changeGuide({ ids }) {
  try {
    yield call(makeApiRequest, ids);
  } catch (error) {
    message.error('Something went wrong, please try again');
  }
}

function* setPublisher({ payload }) {
  try {
    const response = yield call(curriculumSequencesApi.searchCurriculumSequences, { publisher: payload, type: 'guide' });
    yield put(searchGuideResultAction(response));
  } catch (error) {
    message.error('Something went wrong, please try again');
    yield searchGuideResultAction([]);
  }
}

function* setGuide({ payload }) {
  // Future logic based on guide selection
}

function* setContentCurriculum({ payload }) {
  const ids = [payload];
  yield call(makeApiRequest, ids);
}

function* saveGuideAlignment({ payload }) {
  const state = yield select(getCurriculumSequenceState);
  const ids = [state.selectedGuide];
  yield call(makeApiRequest, ids);
}

function* createAssignment({ payload }) {
  const assignment = payload;

  /** @type {String[]} */
  const selectedItemsForAssign = yield select(getSelectedItemsForAssign);
  const assignments = selectedItemsForAssign
    .filter(testId => testId)
    .map(testId => ({ ...assignment, testId }));

  /** @type {State} */
  const curriculumSequenceState = yield select(getCurriculumSequenceState);
  const nextCurriculumSequenceState = cloneDeep(curriculumSequenceState);

  /** @type {AssignData[]} */
  const assignmentApiResponse = yield call(assignmentApi.create, assignments);
  const testIdsFromResponse = assignmentApiResponse.map(item => item.testId);

  /** @type {import('./components/CurriculumSequence').CurriculumSequenceType} */
  let updatedCurriculumSequence;
  curriculumSequenceState.allCurriculumSequences.forEach((curriculumId) => {
    updatedCurriculumSequence = curriculumSequenceState.byId[curriculumId];
    if (updatedCurriculumSequence.type !== 'guide') {
      return;
    }

    if (curriculumSequenceState.byId) {
      updatedCurriculumSequence.modules = [...curriculumSequenceState.byId[curriculumId].modules.map((moduleItem) => {
        const updatedModule = { ...moduleItem };
        const updatedModuleData = moduleItem.data.map((dataItem) => {
          const updatedDataItem = { ...dataItem };
          if (testIdsFromResponse.indexOf(dataItem.testId) !== -1) {
            updatedDataItem.assigned = true;
          }
          return updatedDataItem;
        });

        updatedModule.data = updatedModuleData;
        return updatedModule;
      })];

      nextCurriculumSequenceState.byId[curriculumId] = updatedCurriculumSequence;
    }
  });

  if (!updatedCurriculumSequence) {
    // NOTE: Should we notify the user about this? This shouldn' happen.
    console.warn(`You wanted to updated curriculum sequence but it's missing from state`);
    return;
  }

  try {
    // Persist on server
    yield curriculumSequencesApi
      .updateCurriculumSequence(updatedCurriculumSequence._id, updatedCurriculumSequence)

    message.success('Successfully assigned');
  } catch (error) {
    message.error('There was an error updating the curriculum sequence');
    console.warn('There was an error updating the curriculum sequence', error);
    return;
  }

  try {
    yield put({ type: CREATE_ASSIGNMENT_OK, payload: assignmentApiResponse });
  } catch (error) {
    message.error('Assign was not successful, please try again');
    console.warn('createAssignment error', error);
  }
}

/**
* @param {Object<String, String>} args
* @param {import('./components/CurriculumSequence').ModuleData} [args.contentToAdd]
* @param {import('./components/CurriculumSequence').Module} [args.toUnit]

*/
function* addContentToCurriculumSequence({ payload }) {
  // TODO: change unit to module to stay consistent
  const { contentToAdd, toUnit } = payload;

  if (!contentToAdd || !toUnit) return;

  // Prevent duplicated items to be added
  if (toUnit.data.map(item => item.id).indexOf(contentToAdd.id) !== -1) {
    message.warning('Assignment already exists.');
    return;
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
  const destinationCurriculumSequence = yield select(getDestinationCurriculumSequence);

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
    yield takeLatest(CREATE_ASSIGNMENT, createAssignment),
    yield takeLatest(ADD_CONTENT_TO_CURRICULUM, addContentToCurriculumSequence),
    yield takeLatest(SAVE_CURRICULUM_SEQUENCE, saveCurriculumSequence),
    yield takeLatest(SET_DATA_FOR_ASSIGN_INIT, setDataForAssign),
    yield takeLatest(SET_SELECTED_ITEMS_FOR_ASSIGN_INIT, setSelectedItemsForAssign)
  ]);
}

/**
 * @typedef {object} Class
 * @property {String=} _id
 * @property {Number} status
 * @property {Number} totalNumber
 * @property {submittedNumber} number
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
 * @property {import('./components/CurriculumSequence').CurriculumSequenceType} destinationCurriculumSequence
 * @property {string[]} checkedUnitItems
 * @property {boolean} isContentExpanded
 * @property {any[]} selectedItemsForAssign
 * @property {AssignData} dataForAssign
 */

/**
 *       class: item.class,
students: item.students,
specificStudents: item.specificStudents || false,
openPolicy: item.openPolicy || '',
closePolicy: item.closePolicy || '',
openDate: item.startDate,
closeDate: item.endDate,
 */


const getDefaultAssignData = () => ({
  startDate: moment(),
  endDate: moment(),
  openPolicy: 'Automatically on Start Date',
  closePolicy: 'Automatically on Due Date',
  class: [],
  specificStudents: false,
  students: []
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
  selectedGuide: '',

  /** Selected content that will appear on the right side */
  selectedContent: '',

  /** ids of guides that are checkmarked */
  checkedUnitItems: [],

  isContentExpanded: false,

  selectedItemsForAssign: [],

  destinationCurriculumSequence: {},

  dataForAssign: getDefaultAssignData()
};

/**
 * @param {State} state
 * @param {any} param1
 */
const setCurriculumSequencesReducer = (state, { payload }) => {
  // Go trough all sequences and if type is guide, replace current guide
  const idForRemoval = Object
    .keys(state.byId)
    .map(key => state.byId[key])
    .filter(item => item.type === 'guide')
    .map(item => item._id)[0];

  const newGuideId = Object
    .keys(payload.curriculumSequenceListObject)
    .map(key => payload.curriculumSequenceListObject[key])
    .filter(item => item.type === 'guide')
    .map(item => item._id)[0];

  const contentIds = Object
    .keys(payload.curriculumSequenceListObject)
    .map(key => payload.curriculumSequenceListObject[key])
    .filter(item => item.type === 'content')
    .map(item => item._id);
  // Set to latest content Id
  let latestContentCurriculumId;
  if (contentIds.length > 0 && !state.selectedContent) {
    latestContentCurriculumId = contentIds[contentIds.length - 1];
  } else if (state.selectedContent) {
    latestContentCurriculumId = state.selectedContent;
  } else {
    latestContentCurriculumId = '';
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

const updateCurriculumSequenceReducer = (state, { payload }) => {
  const { id, curriculumSequence } = payload;
  state.byId[id] = curriculumSequence;
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

const toggleAddContentReducer = (state) => {
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
  const destinationCurriculumSequence = { ...state.destinationCurriculumSequence };

  let updatedCurriculumSequence;
  curriculumSequenceState.allCurriculumSequences.forEach((curriculumId) => {
    updatedCurriculumSequence = curriculumSequenceState.byId[curriculumId];
    if (updatedCurriculumSequence.type !== 'guide') {
      return;
    }

    if (curriculumSequenceState.byId) {
      updatedCurriculumSequence.modules = [...curriculumSequenceState.byId[curriculumId].modules.map((moduleItem) => {
        const updatedModule = { ...moduleItem };
        const updatedModuleData = moduleItem.data.map((dataItem) => {
          const updatedDataItem = { ...dataItem };
          if (testIdsFromResponse.indexOf(dataItem.testId) !== -1) {
            updatedDataItem.assigned = true;
          }
          return updatedDataItem;
        });

        updatedModule.data = updatedModuleData;
        return updatedModule;
      })];
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
    message.info('No testId for this item');
    state.selectedItemsForAssign.pop();
  } else if (payload === null) {
    state.selectedItemsForAssign = [];
    state.dataForAssign = getDefaultAssignData();
  } else if (typeof payload === 'string') {
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
const addContentToCurriculumSequenceReducer = (state, { payload }) => {
  const updatedModule = payload;
  const destinationCurriculumSequence = { ...state.destinationCurriculumSequence };
  const updatedModules = [...destinationCurriculumSequence
    .modules.map((module) => {
      if (module.id === updatedModule.id) {
        return updatedModule;
      }
      return module;
    })];

  return {
    ...state,
    destinationCurriculumSequence: {
      ...destinationCurriculumSequence,
      modules: updatedModules
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

  const moduleIndex = destinationCurriculumSequence
    .modules
    .map(m => m.id)
    .indexOf(moduleId);

  const itemIndex = destinationCurriculumSequence
    .modules[moduleIndex]
    .data
    .map(d => d.id).indexOf(itemId);

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
const addNewUnitToDestinationReducer = (state, { payload }) => {
  // { afterUnitId, newUnit }
  const { afterUnitId, newUnit } = payload;
  const destinationCurriculumSequence = { ...state.destinationCurriculumSequence };
  newUnit.id = v4();

  const modules = cloneDeep(destinationCurriculumSequence.modules);
  const moduleIds = destinationCurriculumSequence.modules.map(module => module.id);
  const insertIndex = moduleIds.indexOf(afterUnitId);
  modules.splice(insertIndex + 1, 0, newUnit);

  return {
    ...state,
    destinationCurriculumSequence: {
      ...destinationCurriculumSequence,
      modules
    }
  };
};

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
  [ADD_CONTENT_TO_CURRICULUM_RESULT]: addContentToCurriculumSequenceReducer,
  [REMOVE_ITEM_FROM_UNIT]: removeItemFromUnitReducer,
  [ADD_NEW_UNIT_TO_DESTINATION]: addNewUnitToDestinationReducer
});
