import { message } from "antd";
import { createSlice } from "redux-starter-kit";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { subscriptionApi, paymentApi } from "@edulastic/api";
import { fetchUserAction } from "../../student/Login/ducks";

const slice = createSlice({
  name: "subscription",
  initialState: {
    verificationPending: false,
    subscriptionData: {},
    error: ""
  },
  reducers: {
    fetchUserSubscriptionStatus: state => {
      state.verificationPending = true;
    },
    updateUserSubscriptionStatus: (state, { payload }) => {
      state.verificationPending = false;
      state.subscriptionData = payload.data;
      state.error = payload.error;
    },
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
    },
    stripePaymentAction: state => {
      state.verificationPending = true;
    },
    stripePaymentSuccess: (state, { payload }) => {
      state.verificationPending = false;
      state.subscriptionData = payload;
      state.error = "";
    },
    stripePaymentFailure: (state, { payload }) => {
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
      yield put(slice.actions.upgradeLicenseKeySuccess(apiUpgradeUserResponse));
      yield call(message.success, { content: "Verified!", key: "verify-license", duration: 2 });
      yield put(fetchUserAction({ background: true }));
    }
  } catch (err) {
    yield put(slice.actions.upgradeLicenseKeyFailure(err?.data?.message));
    yield call(message.error, {
      content: "The License Key entered is either already used or not valid. Please contact your admin.",
      key: "verify-license",
      duration: 2
    });
    console.error("ERROR WHILE VERIFYING USER LICENSE KEY : ", err);
  }
}

function* handleStripePayment({ payload }) {
  try {
    const { stripe, data } = payload;
    yield call(message.loading, { content: "Processing Payment, please wait", key: "verify-license" });
    const { token, error } = yield stripe.createToken(data);
    if (token) {
      const apiPaymentResponse = yield call(paymentApi.pay, { token });
      if (apiPaymentResponse.success) {
        yield put(slice.actions.stripePaymentSuccess(apiPaymentResponse));
        yield call(message.success, { content: "Payment Successful", key: "handle-payment", duration: 2 });
        yield put(fetchUserAction({ background: true }));
      } else {
        yield call(message.error, {
          content: "API Response failed: " + error,
          key: "handle-payment",
          duration: 2
        });
        console.error("API Response failed");
      }
    } else {
      yield call(message.error, {
        content: "Creating token failed : " + error,
        key: "handle-payment",
        duration: 2
      });
      console.error("ERROR WHILE PROCESSING PAYMENT [Create Token] : ", error);
    }
  } catch (err) {
    yield put(slice.actions.stripePaymentFailure(err?.data?.message));
    yield call(message.error, {
      content: "Payment Failed : " + err?.data?.message,
      key: "handle-payment",
      duration: 2
    });
    console.error("ERROR WHILE PROCESSING PAYMENT : ", err);
  }
}

function* fetchUserSubscription() {
  try {
    const apiUserSubscriptionStatus = yield call(subscriptionApi.subscriptionStatus);
    if (apiUserSubscriptionStatus.result) {
      const data = { success: true, subscription: apiUserSubscriptionStatus.result };

      yield put(slice.actions.updateUserSubscriptionStatus({ data, error: "" }));
    } else yield put(slice.actions.updateUserSubscriptionStatus({ data: {}, error: apiUserSubscriptionStatus.result }));
  } catch (err) {
    yield put(slice.actions.updateUserSubscriptionStatus({ data: {}, error: apiUserSubscriptionStatus.result }));
    console.error("ERROR WHILE FETCHING USER SUBSCRIPTION : ", err);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.upgradeLicenseKeyPending, upgradeUserLicense),
    yield takeEvery(slice.actions.stripePaymentAction, handleStripePayment),
    yield takeEvery(slice.actions.fetchUserSubscriptionStatus, fetchUserSubscription)
  ]);
}
