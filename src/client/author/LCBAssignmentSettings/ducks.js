import { createSlice } from "redux-starter-kit";
import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { assignmentApi } from "@edulastic/api";
import { message } from "antd";
import { omitBy, isUndefined, isEmpty, invert, set, get } from "lodash";
import { assignmentPolicyOptions, assignmentStatusOptions } from "@edulastic/constants";

const slice = createSlice({
  initialState: {
    assignment: null,
    loading: false,
    updateSettings: {}
  },
  reducers: {
    loadAssignment: state => {
      state.loading = true;
    },
    updateAssignmentClassSettings: state => {
      state.loading = true;
    },
    updateAssignmentClassSettingsSucess: state => {
      state.loading = false;
      state.originalAssignment = state.assignment;
      state.updateSettings = {};
    },
    loadAssignmentSucess: (state, { payload }) => {
      state.loading = false;
      state.assignment = payload;
      state.originalAssignment = payload;
    },
    updateAssignmentClassSettingsError: state => {
      state.assignment = state.originalAssignment;
      state.loading = false;
      state.updateSettings = {};
    },
    updateAssignment: (state, { payload }) => {
      Object.assign(state.assignment, payload);
    },
    changeAttribute: (state, { payload }) => {
      const { key, value } = payload;
      if (["startDate", "endDate"].includes(key)) {
        state.assignment.class[0][key] = value.valueOf();
        state.updateSettings[key] = value.valueOf();
      } else {
        state.assignment[key] = value;
        state.updateSettings[key] = value;
        if (key === "openPolicy" && value === assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE) {
          set(state.assignment, "class[0].startDate", Date.now());
          state.updateSettings.startDate = Date.now();
        } else if (
          key === "closePolicy" &&
          value === assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE
        ) {
          const newDueDate = new Date(
            get(state.assignment, "class[0].startDate", Date.now()) + 1000 * 60 * 60 * 24 * 7
          );
          set(state.assignment, "class[0].endDate", newDueDate.setHours(23, 59, 59));
          state.updateSettings.endDate = newDueDate.setHours(23, 59, 59);
        }
      }
    }
  }
});

export { slice };

const assignmentStatusArray = [
  assignmentStatusOptions.NOT_OPEN,
  assignmentStatusOptions.IN_PROGRESS,
  assignmentStatusOptions.IN_GRADING,
  assignmentStatusOptions.DONE,
  assignmentStatusOptions.ARCHIVED
];
const assignmentStatusOptionsKeys = invert(assignmentStatusArray);
function* loadAssignmentSaga({ payload }) {
  try {
    const { assignmentId, classId } = payload;
    const data = yield call(assignmentApi.getById, assignmentId);
    /**
     * filtering out other classes
     */
    data.class = (data.class || []).filter(x => x._id === classId);
    /**
     * logic for picking correct status for a class considering redirect
     */
    const statusKeys = data.class.map(x => parseInt(assignmentStatusOptionsKeys[x.status], 10));
    const statusKey = Math.min(statusKeys);
    if (data.class[0]) {
      const { releaseScore } = data.class[0];
      if (releaseScore) {
        data.releaseScore = releaseScore;
      }
      data.class[0].status = assignmentStatusArray[statusKey];
      data.class[0].endDate = Math.max(data.class.map(x => x.endDate));
      if (!data.class[0].startDate) {
        data.class[0].startDate = Date.now();
      }
      if (!data.class[0].endDate) {
        const newEndDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
        data.class[0].endDate = newEndDate.setHours(23, 59, 59);
      }
    }
    /**
     * if class level openPolicy and  closePolicy present,
     * override the top level with class level
     */
    const { openPolicy, closePolicy } = data.class[0] || {};
    if (openPolicy) {
      data.openPolicy = openPolicy;
    }
    if (closePolicy) {
      data.closePolicy = closePolicy;
    }
    yield put(slice.actions.loadAssignmentSucess(data));
  } catch (e) {
    console.warn("error", e, e.stack);
    yield put(slice.actions.stopLoading());
    yield call(message.error, e?.data?.message || "Loading assignment failed");
  }
}

function getSettingsSelector(state) {
  const assignment = state.LCBAssignmentSettings?.updateSettings || {};
  const { openPolicy, closePolicy, releaseScore, startDate, endDate, calcType } = assignment;
  return omitBy(
    {
      openPolicy,
      closePolicy,
      releaseScore,
      startDate,
      endDate,
      calcType
    },
    isUndefined
  );
}

function* updateAssignmentClassSettingsSaga({ payload }) {
  const { assignmentId, classId } = payload;
  try {
    const settings = yield select(getSettingsSelector);
    if (isEmpty(settings)) {
      yield call(message.error, "no changes to be saved");
      return;
    }
    yield call(assignmentApi.updateClassSettings, { assignmentId, classId, settings });
    yield put(slice.actions.updateAssignmentClassSettingsSucess());
    yield call(message.success, "Settings updated successfully");
  } catch (e) {
    console.log(e, "------");
    yield put(slice.actions.updateAssignmentClassSettingsError());
    yield call(message.error, e?.data?.message || "Updating assignment settings failed");
    console.warn("error", e, e.stack);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.loadAssignment, loadAssignmentSaga),
    yield takeEvery(slice.actions.updateAssignmentClassSettings, updateAssignmentClassSettingsSaga)
  ]);
}
