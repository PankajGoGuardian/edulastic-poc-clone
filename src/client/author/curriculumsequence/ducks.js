import { createAction, createReducer } from 'redux-starter-kit';
import { message } from 'antd';
import {
  takeLatest,
  put,
  call,
  all
} from 'redux-saga/effects';
import { flatten } from 'lodash';
import { normalize, schema } from 'normalizr';
import { curriculumSequencesApi } from '@edulastic/api';


// Types
export const FETCH_CURRICULUM_SEQUENCES = '[curriculum-sequence] fetch list of curriculum sequences';
export const UPDATE_CURRICULUM_SEQUENCE = '[curriculum-sequence-ui] update curriculum sequence';
export const UPDATE_CURRICULUM_SEQUENCE_LIST = '[curriculum-sequence-ui] update curriculum sequence list';
export const FETCH_CURRICULUM_SEQUENCES_ERROR = '[curriculum-sequence-ui] error no ids provided';

// Actions
export const updateCurriculumSequenceList = createAction(UPDATE_CURRICULUM_SEQUENCE_LIST);

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

export const updateCurriculumSequence = (id, curriculumSequence) => {
  return {
    type: UPDATE_CURRICULUM_SEQUENCE,
    payload: { id, curriculumSequence }
  };
};

// Sagas
export function* makeApiRequest(idsForFetch = []) {
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
}

export function* fetchItemsFromApi({ payload: ids }) {
  yield call(makeApiRequest, ids);
}

export function* putCurriculumSequence({ payload }) {
  const { id, curriculumSequence } = payload;
  yield curriculumSequencesApi
    .updateCurriculumSequence(id, curriculumSequence)
    .then(res => message.success(`Successfully saved ${res.data.result.title}`))
    .catch(err => message.error('Something went wrong, please try again'));
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(FETCH_CURRICULUM_SEQUENCES, fetchItemsFromApi),
    yield takeLatest(UPDATE_CURRICULUM_SEQUENCE, putCurriculumSequence)
  ]);
}

// Reducers
const initialState = {};

const setCurriculumSequencesReducer = (state, { payload }) => {
  state.allCurriculumSequences = payload.allCurriculumSequences;
  state.byId = payload.curriculumSequenceListObject;
};

const updateCurriculumSequenceReducer = (state, { payload }) => {
  const { id, curriculumSequence } = payload;
  state.byId[id] = curriculumSequence;
};


export default createReducer(initialState, {
  [UPDATE_CURRICULUM_SEQUENCE_LIST]: setCurriculumSequencesReducer,
  [UPDATE_CURRICULUM_SEQUENCE]: updateCurriculumSequenceReducer
});
