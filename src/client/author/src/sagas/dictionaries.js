import { takeLatest, takeEvery, call, put, all } from "redux-saga/effects";
import { dictionariesApi } from "@edulastic/api";
import { message } from "antd";
import {
  RECEIVE_DICT_CURRICULUMS_REQUEST,
  RECEIVE_DICT_CURRICULUMS_SUCCESS,
  RECEIVE_DICT_CURRICULUMS_ERROR,
  RECEIVE_DICT_STANDARDS_REQUEST,
  RECEIVE_DICT_STANDARDS_SUCCESS,
  RECEIVE_DICT_STANDARDS_ERROR,
  ADD_NEW_ALIGNMENT,
  ADD_DICT_ALIGNMENT,
  REMOVE_EXISTED_ALIGNMENT,
  REMOVE_DICT_ALINMENT
} from "../constants/actions";
import { ADD_ALIGNMENT, REMOVE_ALIGNMENT } from "../../sharedDucks/questions";
import _ from "lodash";

function* receiveCurriculumsSaga() {
  try {
    const items = yield call(dictionariesApi.receiveCurriculums);

    yield put({
      type: RECEIVE_DICT_CURRICULUMS_SUCCESS,
      payload: { items }
    });
  } catch (err) {
    console.error(err);
    const errorMessage = "Receive curriculums is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_DICT_CURRICULUMS_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveStandardsSaga({ payload }) {
  try {
    if (payload.curriculumId) {
      const { elo, tlo } = yield call(dictionariesApi.receiveStandards, payload);
      yield put({
        type: RECEIVE_DICT_STANDARDS_SUCCESS,
        payload: { elo, tlo }
      });
    } else {
      yield put({
        type: RECEIVE_DICT_STANDARDS_SUCCESS,
        payload: { elo: [], tlo: [] }
      });
    }
  } catch (err) {
    console.error(err);
    const errorMessage = "Receive standards is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_DICT_STANDARDS_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* addNewAlignmentSaga({ payload }) {
  yield put({
    type: ADD_ALIGNMENT,
    payload
  });
  const newPayload = _.cloneDeep(payload);
  newPayload.standards = [];
  delete newPayload.domains;
  yield put({
    type: ADD_DICT_ALIGNMENT,
    payload: newPayload
  });
}

function* removeExistedAlignmentSaga({ payload }) {
  yield put({
    type: REMOVE_ALIGNMENT,
    payload
  });
  yield put({ type: REMOVE_DICT_ALINMENT, payload });
}

export default function* watcherSaga() {
  yield all([
    yield takeLatest(RECEIVE_DICT_CURRICULUMS_REQUEST, receiveCurriculumsSaga),
    yield takeLatest(RECEIVE_DICT_STANDARDS_REQUEST, receiveStandardsSaga),
    yield takeEvery(ADD_NEW_ALIGNMENT, addNewAlignmentSaga),
    yield takeEvery(REMOVE_EXISTED_ALIGNMENT, removeExistedAlignmentSaga)
  ]);
}
