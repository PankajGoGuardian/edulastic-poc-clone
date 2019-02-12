import { createAction, createReducer } from 'redux-starter-kit';
import { message } from 'antd';
import {
  takeLatest,
  put,
  call,
  all,
  select
} from 'redux-saga/effects';
import { flatten } from 'lodash';
import { normalize, schema } from 'normalizr';
import { curriculumSequencesApi } from '@edulastic/api';

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

// Actions
export const updateCurriculumSequenceList = createAction(UPDATE_CURRICULUM_SEQUENCE_LIST);
export const updateCurriculumSequenceAction = createAction(UPDATE_CURRICULUM_SEQUENCE)
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

export const putCurriculumSequenceAction = (id, curriculumSequence) => {
  return {
    type: PUT_CURRICULUM_SEQUENCE,
    payload: { id, curriculumSequence }
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

// Sagas
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

function* putCurriculumSequence({ payload }) {
  const { id, curriculumSequence } = payload;
  const response = yield curriculumSequencesApi
    .updateCurriculumSequence(id, curriculumSequence)
    .catch(() => message.error('Something went wrong, please try again'));

  message.success(`Successfully saved ${response.title}`);

  put(updateCurriculumSequenceAction(response));
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
    yield takeLatest(SAVE_GUIDE_ALIGNMENT, saveGuideAlignment)
  ]);
}

/**
 * @typedef {object} State
 * @property {string[]} allCurriculumSequences
 * @property {object} byId
 * @property {import('./components/CurriculumSequence').CurriculumSearchResult} guides
 * @property {import('./components/CurriculumSequence').CurriculumSearchResult} contentCurriculums
 * @property {string} selectedGuide
 * @property {string} selectedContent
 * @property {string[]} checkedGuideUnits
 * @property {boolean} isContentExpanded
 */

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
  checkedGuideUnits: [],

  isContentExpanded: false
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
  state.selectedGuide = newGuideId;
  state.selectedContent = latestContentCurriculumId;
  state.checkedGuideUnits = [];
};

const updateCurriculumSequenceReducer = (state, { payload }) => {
  const { id, curriculumSequence } = payload;
  state.byId[id] = curriculumSequence;
};

const searchGuidesReducer = (state, { payload }) => {
  const defaultSelectedGuide = payload[0]._id;
  state.guides = payload;

  // When publisher is changed and new guides are available - set them to first one
  if (payload.map(guides => guides._id).indexOf(state.selectedGuide) === -1) {
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
 *
 * @param {State} state
 * @param {any} param1
 */
const toggleCheckedUnitItemReducer = (state, { payload }) => {
  const currentlyCheckedItemId = payload;
  const existingItemIndex = state.checkedGuideUnits.indexOf(currentlyCheckedItemId);
  if (existingItemIndex === -1) {
    state.checkedGuideUnits.push(currentlyCheckedItemId);
  } else {
    state.checkedGuideUnits.splice(existingItemIndex, 1);
  }
};

const toggleAddContentReducer = (state) => {
  state.isContentExpanded = !state.isContentExpanded;
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
  [TOGGLE_ADD_CONTENT]: toggleAddContentReducer
});
