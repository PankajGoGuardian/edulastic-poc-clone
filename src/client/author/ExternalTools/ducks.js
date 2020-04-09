import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { message } from "antd";
import { settingsApi } from "@edulastic/api";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { has, pick } from "lodash";

const FETCH_EXTERNAL_TOOL_PROVIDER = "[External Tool Provider] fetch tool";
// const FETCH_EXTERNAL_TOOL_PROVIDER_BEGIN = "[External Tool Provider] fetch tool begin";
const FETCH_EXTERNAL_TOOL_PROVIDER_SUCCESS = "[External Tool Provider] fetch tool success";
const FETCH_EXTERNAL_TOOL_PROVIDER_FAILURE = "[External Tool Provider] fetch tool failure";
const DELETE_EXTERNAL_TOOL_PROVIDER = "[External Tool Provider] delete tool";
const SAVE_EXTERNAL_TOOL_PROVIDER = "[External Tool Provider] save tool provider";
const UPDATE_EXTERNAL_TOOL_PROVIDER = "[External Tool Provider] update tool provider";

export const fetchExternalToolProviderAction = createAction(FETCH_EXTERNAL_TOOL_PROVIDER);
// export const fetchExternalToolProviderBeginAction = createAction(FETCH_EXTERNAL_TOOL_PROVIDER_BEGIN);
export const fetchExternalToolProviderSuccessAction = createAction(FETCH_EXTERNAL_TOOL_PROVIDER_SUCCESS);
export const fetchExternalToolProviderFailureAction = createAction(FETCH_EXTERNAL_TOOL_PROVIDER_FAILURE);
export const deleteExternalToolProviderAction = createAction(DELETE_EXTERNAL_TOOL_PROVIDER);
export const saveExternalToolProviderAction = createAction(SAVE_EXTERNAL_TOOL_PROVIDER);
export const updateExternalToolProviderAction = createAction(UPDATE_EXTERNAL_TOOL_PROVIDER);

const initialState = {
  data: []
};

const initialFormData = {
  toolName: "",
  toolType: "",
  settings: {
    consumerKey: "",
    sharedSecret: "",
    privacy: "",
    configurationType: "",
    matchBy: "",
    domain: "",
    customParams: ""
  }
};

export const reducer = createReducer(initialState, {
  [FETCH_EXTERNAL_TOOL_PROVIDER_SUCCESS]: (state, { payload }) => {
    state.data = payload;
  },
  [FETCH_EXTERNAL_TOOL_PROVIDER_FAILURE]: (state, { payload }) => {
    state.data = [];
  },
  [UPDATE_EXTERNAL_TOOL_PROVIDER]: (state, { payload }) => {
    const { index, data } = payload;
    state.data[index] = data;
  }
});

function* fetchExternalToolProviderSaga({ payload }) {
  try {
    const toolsList = yield call(settingsApi.getExternalTools, payload);
    yield put(fetchExternalToolProviderSuccessAction(toolsList));
  } catch (err) {
    yield call(message.error, "Unable to get tools List");
    yield put(fetchExternalToolProviderFailureAction());
  }
}

function* saveExternalToolProviderSaga({ payload }) {
  try {
    const { orgId, data } = payload;
    if (has(data, "_id")) {
      const externalToolId = data._id;
      const newData = pick(data, ["toolName", "toolType", "settings"]);
      const toolsList = yield call(settingsApi.updateExternalTools, { orgId, externalToolId, body: newData });
      yield put(fetchExternalToolProviderSuccessAction(toolsList));
    } else {
      const toolsList = yield call(settingsApi.createExternalTools, { orgId, body: data });
      yield put(fetchExternalToolProviderSuccessAction(toolsList));
    }
  } catch (err) {
    const errorMessage = err?.data?.message;
    yield call(message.error, errorMessage || "Unable to save Tool");
  }
}

function* deleteExternalToolProviderSaga({ payload }) {
  try {
    const { orgId, id } = payload;
    const toolsList = yield call(settingsApi.deleteExternalTools, { orgId, externalToolId: id });
    yield put(fetchExternalToolProviderSuccessAction(toolsList));
  } catch (err) {
    yield call(message.error, "Unable to Delete Tool");
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(FETCH_EXTERNAL_TOOL_PROVIDER, fetchExternalToolProviderSaga),
    yield takeEvery(SAVE_EXTERNAL_TOOL_PROVIDER, saveExternalToolProviderSaga),
    yield takeEvery(DELETE_EXTERNAL_TOOL_PROVIDER, deleteExternalToolProviderSaga)
  ]);
}

const stateExternalToolsSelector = state => state.externalToolsReducer;
export const getFormData = createSelector(
  stateExternalToolsSelector,
  state => state.data
);
