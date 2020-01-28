import { message } from "antd";
import { createSlice } from "redux-starter-kit";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { subscriptionApi } from "@edulastic/api";
import { fetchUserAction } from "../../student/Login/ducks";

const slice = createSlice({
  name: "subscription",
  initialState: {
    verificationPending: false,
    subscriptionData: {},
    error: ""
  },
  reducers: {
    upgradeLicenseKeyPending: state => {
      state.verificationPending = true;
    },
    upgradeLicenseKeySuccess: (state, { payload }) => {
      state.verificationPending = false;
      state.subscriptionData = payload;
      state.error = "";
    },
    upgradeLicenseKeyFailure: (state, { payload }) => {
      state.verificationPending = false;
      state.subscriptionData = {};
      state.error = payload;
    }
  }
});

export { slice };

function* upgradeUserLicense({ payload }) {
  try {
    yield call(message.loading, { content: "Verifying License...", key: "verify-license" });
    const apiUpgradeUserResponse = yield call(subscriptionApi.upgradeUsingLicenseKey, payload);
    if (apiUpgradeUserResponse.success) {
      yield put(slice.actions.upgradeLicenseKeySuccess(apiUpgradeUserResponse.subscription));
      yield call(message.success, { content: "Verified!", key: "verify-license", duration: 2 });
      yield put(fetchUserAction({ background: true }));
    }
  } catch (err) {
    yield put(slice.actions.upgradeLicenseKeyFailure(err?.data?.message));
    yield call(message.error, {
      content: "License Upgrade Failed : " + err?.data?.message,
      key: "verify-license",
      duration: 2
    });
    console.error("ERROR WHILE VERIFYING USER LICENSE KEY ", err);
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(slice.actions.upgradeLicenseKeyPending, upgradeUserLicense)]);
}
