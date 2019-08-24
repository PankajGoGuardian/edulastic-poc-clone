import { createSelector } from "reselect";
import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { settingsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import { getUserOrgId } from "../src/selectors/user";
import { get } from "lodash";

const RECEIVE_STANDARDS_PROFICIENCY_REQUEST = "[Standards Proficiency] receive data request";
const RECEIVE_STANDARDS_PROFICIENCY_SUCCESS = "[Standards Proficiency] receive data success";
const RECEIVE_STANDARDS_PROFICIENCY_ERROR = "[Standards Proficiency] receive data error";
const UPDATE_STANDARDS_PROFICIENCY_REQUEST = "[Standards Proficiency] update data request";
const UPDATE_STANDARDS_PROFICIENCY_SUCCESS = "[Standards Proficiency] update data success";
const UPDATE_STANDARDS_PROFICIENCY_ERROR = "[Standards Proficiency] update data error";
const CREATE_STANDARDS_PROFICIENCY_REQUEST = "[Standards Proficiency] create data request";
const CREATE_STANDARDS_PROFICIENCY_SUCCESS = "[Standards Proficiency] create data success";
const CREATE_STANDARDS_PROFICIENCY_ERROR = "[Standards Proficiency] create data error";

const SET_STANDARDS_SCALE_DATA = "[Standards Proficiency] set scale data";
const SET_STANDARDS_CALCTYPE = "[Standards Proficiency] set calctype";
const SET_STANDARDS_DECAYINGATTR = "[Standards Proficiency] set decaying attribute value";
const SET_STANDARDS_MOVINGAVRATTR = "[Standards Proficiency] set moving average value value";
const DELETE_STANDARDS_PROFICIENCY = "[Standards Proficiency] delete";
const SET_EDITING_INDEX = "[Standards Proficiency] set editing index";

export const receiveStandardsProficiencyAction = createAction(RECEIVE_STANDARDS_PROFICIENCY_REQUEST);
export const receiveStandardsProficiencySuccessAction = createAction(RECEIVE_STANDARDS_PROFICIENCY_SUCCESS);
export const receiveStandardsProficiencyErrorAction = createAction(RECEIVE_STANDARDS_PROFICIENCY_ERROR);
export const updateStandardsProficiencyAction = createAction(UPDATE_STANDARDS_PROFICIENCY_REQUEST);
export const updateStandardsProficiencySuccessAction = createAction(UPDATE_STANDARDS_PROFICIENCY_SUCCESS);
export const updateStandardsProficiencyErrorAction = createAction(UPDATE_STANDARDS_PROFICIENCY_ERROR);
export const createStandardsProficiencyAction = createAction(CREATE_STANDARDS_PROFICIENCY_REQUEST);
export const createStandardsProficiencySuccessAction = createAction(CREATE_STANDARDS_PROFICIENCY_SUCCESS);
export const createStandardsProficiencyErrorAction = createAction(CREATE_STANDARDS_PROFICIENCY_ERROR);

export const setEditingIndexAction = createAction(SET_EDITING_INDEX);

export const deleteStandardsProficiencyAction = createAction(DELETE_STANDARDS_PROFICIENCY);

export const setScaleDataAction = createAction(SET_STANDARDS_SCALE_DATA);
export const setCalcTypeAction = createAction(SET_STANDARDS_CALCTYPE);
export const setDecayingAttrValueAction = createAction(SET_STANDARDS_DECAYINGATTR);
export const setMovingAttrValueAction = createAction(SET_STANDARDS_MOVINGAVRATTR);

// reducers
const initialState = {
  data: [],
  error: null,
  loading: false,
  updating: false,
  updateError: null,
  creating: false,
  createError: null,
  editingIndex: undefined
};

export const reducer = createReducer(initialState, {
  [RECEIVE_STANDARDS_PROFICIENCY_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_STANDARDS_PROFICIENCY_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.data = [];
    for (let el of payload) {
      if (el != null) {
        const { scale, calcType, calcAttribute } = el;
        const scaleData = [];
        for (let i = 0; i < scale.length; i++) {
          scaleData.push({
            key: i,
            score: scale[i].score,
            _id: scale[i]._id,
            shortName: scale[i].shortName,
            threshold: scale[i].threshold,
            masteryLevel: scale[i].masteryLevel,
            color: scale[i].color
          });
        }
        state.data.push({
          _id: el._id,
          name: el.name,
          calcType: calcType,
          calcDecayingAttr: calcType === "DECAYING_AVERAGE" ? calcAttribute : 65,
          calcMovingAvrAttr: calcType === "MOVING_AVERAGE" ? calcAttribute : 5,
          scale: scaleData,
          createdBy: el.createdBy
        });
      } else {
        state.data.push({
          _id: "",
          name: "Standard Proficiency",
          calcType: "MOST_RECENT",
          calcDecayingAttr: 65,
          calcMovingAvrAttr: 5,
          scale: [
            { key: 0, color: "#C8EB9B", score: 4, masteryLevel: "Exceeds Mastery", shortName: "E", threshold: 90 },
            { key: 1, color: "#F3FCCF", score: 3, masteryLevel: "Mastered", shortName: "M", threshold: 80 },
            { key: 2, color: "#FDFDC8", score: 2, masteryLevel: "Almost Mastered", shortName: "A", threshold: 60 },
            { key: 3, color: "#FDE2B3", score: 1, masteryLevel: "Not Mastered", shortName: "N", threshold: 0 }
          ]
        });
      }
    }
  },
  [RECEIVE_STANDARDS_PROFICIENCY_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_STANDARDS_PROFICIENCY_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_STANDARDS_PROFICIENCY_SUCCESS]: (state, { payload }) => {
    state.updating = false;
  },
  [UPDATE_STANDARDS_PROFICIENCY_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
  },
  [CREATE_STANDARDS_PROFICIENCY_REQUEST]: state => {
    state.creating = true;
  },
  [CREATE_STANDARDS_PROFICIENCY_SUCCESS]: (state, { payload }) => {
    state.creating = false;
  },
  [CREATE_STANDARDS_PROFICIENCY_ERROR]: (state, { payload }) => {
    state.creating = false;
    state.createError = payload.error;
  },
  [SET_STANDARDS_SCALE_DATA]: (state, { payload }) => {
    const { _id, data } = payload;
    state.data.find(x => x._id === _id).scale = data;
  },
  [SET_STANDARDS_CALCTYPE]: (state, { payload }) => {
    const { _id, data } = payload;
    state.data.find(x => x._id === _id).calcType = data;
  },
  [SET_STANDARDS_DECAYINGATTR]: (state, { payload }) => {
    const { _id, data } = payload;
    state.data.find(x => x._id === _id).calcDecayingAttr = data;
  },
  [SET_STANDARDS_MOVINGAVRATTR]: (state, { payload }) => {
    const { _id, data } = payload;
    state.data.find(x => x._id === _id).calcMovingAvrAttr = data;
  },
  [SET_EDITING_INDEX]: (state, { payload }) => {
    state.editingIndex = state.editingIndex === payload ? undefined : payload;
  }
});

// sagas
function* receiveStandardsProficiencySaga({ payload }) {
  const defaultOrgId = yield select(getUserOrgId);
  payload = payload || { orgId: defaultOrgId };
  try {
    const standardsProficiency = yield call(settingsApi.getStandardsProficiency, payload);
    standardsProficiency.sort((el1, el2) => (el1._id > el2._id ? -1 : 1));
    yield put(receiveStandardsProficiencySuccessAction(standardsProficiency));
  } catch (err) {
    const errorMessage = "Receive StandardsProficiency is failing";
    yield call(message.error, errorMessage);
    yield put(receiveStandardsProficiencyErrorAction({ error: errorMessage }));
  }
}

function* updateStandardsProficiencySaga({ payload }) {
  try {
    const updateStandardsProficiency = yield call(settingsApi.updateStandardsProficiency, payload);
    yield put(updateStandardsProficiencySuccessAction(updateStandardsProficiency));
  } catch (err) {
    const errorMessage = "Update StandardsProficiency is failing";
    yield call(message.error, errorMessage);
    yield put(updateStandardsProficiencyErrorAction({ error: errorMessage }));
  }
}

function* createStandardsProficiencySaga({ payload }) {
  const { index, ..._payload } = payload;
  try {
    const createStandardsProficiency = yield call(settingsApi.createStandardsProficiency, _payload);
    yield put(createStandardsProficiencySuccessAction({ ...createStandardsProficiency, index }));
    yield put(receiveStandardsProficiencyAction());

    yield put(setEditingIndexAction(0));
  } catch (err) {
    console.error(err);
    const errorMessage = "Update StandardsProficiency is failing";
    yield call(message.error, errorMessage);
    yield put(updateStandardsProficiencyErrorAction({ error: errorMessage }));
  }
}

function* deleteStandardsProficiencySaga({ payload: _id }) {
  try {
    const districtId = yield select(getUserOrgId);
    yield call(settingsApi.deleteStandardsProficiency, _id, districtId);
    yield put(receiveStandardsProficiencyAction());
  } catch (err) {
    console.warn("error deleting standardsProf", err);
    yield call(message.error, "Deleting standards proficiency failed");
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_STANDARDS_PROFICIENCY_REQUEST, receiveStandardsProficiencySaga)]);
  yield all([yield takeEvery(UPDATE_STANDARDS_PROFICIENCY_REQUEST, updateStandardsProficiencySaga)]);
  yield all([yield takeEvery(CREATE_STANDARDS_PROFICIENCY_REQUEST, createStandardsProficiencySaga)]);
  yield all([yield takeEvery(DELETE_STANDARDS_PROFICIENCY, deleteStandardsProficiencySaga)]);
}
