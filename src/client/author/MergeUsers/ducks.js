import { message } from "antd";
import { createSlice } from "redux-starter-kit";
import { takeLatest, call, put } from "redux-saga/effects";
import { userApi } from "@edulastic/api";

// slice
const slice = createSlice({
  name: "mergeUsers",
  initialState: {
    userDetails: [],
    // mergedUser: {},
    loadingUserDetails: false
  },
  reducers: {
    fetchUserDetailsRequest: state => {
      state.loadingUserDetails = true;
      state.mergedUser = {};
    },
    fetchUserDetailsSuccess: (state, { payload }) => {
      state.userDetails = payload;
      state.loadingUserDetails = false;
    },
    fetchUserDetailsFailed: state => {
      state.userDetails = [];
      state.loadingUserDetails = false;
    },
    mergeUsersRequest: state => {
      state.loadingUserDetails = true;
    },
    // TODO: remove if not needed after mockup is finalized
    mergeUsersSuccess: (state, { payload }) => {
      state.userDetails = [];
      state.mergedUser = payload;
      state.loadingUserDetails = false;
    },
    mergeUsersFailed: state => {
      state.loadingUserDetails = false;
      state.mergedUser = {};
    }
  }
});

export const { actions, reducer } = slice;

// sagas
function* fetchUserDetailsSaga({ payload }) {
  try {
    const { type, userIds } = payload;
    const response = yield call(userApi.fetchUsersForMerge, { type, userIds: userIds.join(",") });
    yield put(actions.fetchUserDetailsSuccess(response));
    // yield call(message.success, "Success fetching user details for merge");
  } catch (err) {
    yield put(actions.fetchUserDetailsFailed());
    yield call(message.error, "Failed to fetch user details for merge");
  }
}

function* mergeUsersSaga({ payload }) {
  try {
    const response = yield call(userApi.mergeUsers, payload);
    yield put(actions.mergeUsersSuccess({}));
    yield call(message.success, response.message);
  } catch (err) {
    yield put(actions.mergeUsersFailed());
    yield call(message.error, "Failed to merge selected users");
  }
}

export function* watcherSaga() {
  yield takeLatest(actions.fetchUserDetailsRequest, fetchUserDetailsSaga);
  yield takeLatest(actions.mergeUsersRequest, mergeUsersSaga);
}

// selectors
export const selectors = {
  loading: state => state?.mergeUsersReducer?.loading,
  userDetails: state => state?.mergeUsersReducer?.userDetails,
  mergedUser: state => state?.mergeUsersReducer?.mergedUser
};
