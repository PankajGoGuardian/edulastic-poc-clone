import { message } from 'antd'
import moment from 'moment'
import { isEmpty } from 'lodash'
import { captureSentryException, notification } from '@edulastic/common'
import { createSlice } from 'redux-starter-kit'
import { takeEvery, call, put, all } from 'redux-saga/effects'
import { subscriptionApi, paymentApi } from '@edulastic/api'
import { fetchUserAction } from '../../student/Login/ducks'

const slice = createSlice({
  name: 'subscription',
  initialState: {
    isSubscriptionExpired: false,
    verificationPending: false,
    subscriptionData: {},
    error: '',
    showTrialSubsConfirmation: false,
    showTrialConfirmationMessage: '',
    products: [],
    isPaymentServiceModalVisible: false,
    showHeaderTrialModal: false,
  },
  reducers: {
    fetchUserSubscriptionStatus: (state) => {
      state.verificationPending = true
    },
    disablePending: (state) => {
      state.verificationPending = false
    },
    updateUserSubscriptionStatus: (state, { payload }) => {
      state.verificationPending = false
      state.subscriptionData = payload.data
      state.error = payload.error
    },
    upgradeLicenseKeyPending: (state) => {
      state.verificationPending = true
    },
    upgradeLicenseKeySuccess: (state, { payload }) => {
      state.verificationPending = false
      state.subscriptionData = payload
      state.error = ''
    },
    upgradeLicenseKeyFailure: (state, { payload }) => {
      state.verificationPending = false
      state.subscriptionData = {}
      state.error = payload
    },
    stripePaymentAction: (state) => {
      state.verificationPending = true
    },
    stripePaymentSuccess: (state, { payload }) => {
      state.verificationPending = false
      state.subscriptionData = payload
      state.error = ''
    },
    stripePaymentFailure: (state, { payload }) => {
      state.verificationPending = false
      state.subscriptionData = {}
      state.error = payload
    },
    updateUserSubscriptionExpired: (state, { payload }) => {
      state.isSubscriptionExpired = true
      state.verificationPending = false
      state.subscriptionData = payload
      state.error = ''
    },
    startTrialAction: (state) => {
      state.verificationPending = true
    },
    startTrialSuccessAction: (state, { payload }) => {
      state.verificationPending = false
      state.subscriptionData = payload
      state.error = ''
    },
    startTrialFailureAction: (state, { payload }) => {
      state.verificationPending = false
      state.subscriptionData = {}
      state.error = payload
    },
    resetSubscriptions: (state) => {
      state.subscriptionData = {}
    },
    trialSubsConfirmationAction: (state, { payload }) => {
      state.showTrialSubsConfirmation = payload
    },
    trialConfirmationMessageAction: (state, { payload }) => {
      state.showTrialConfirmationMessage = payload
    },
    setAddOnProducts: (state, { payload }) => {
      state.products = payload
    },
    setPaymentServiceModal: (state, { payload }) => {
      state.isPaymentServiceModalVisible = payload
    },
    setShowHeaderTrialModal: (state, { payload }) => {
      state.showHeaderTrialModal = payload
    },
  },
})

export { slice }

function* showSuccessNotifications(apiPaymentResponse, isTrial = false) {
  const { subscriptions, itemBankPermissions = [] } = apiPaymentResponse
  const hasSubscriptions = Object.keys(subscriptions).length > 0
  const hasItemBankPermissions = !isEmpty(itemBankPermissions)
  const subscriptionPeriod = isTrial ? '14 days' : 'an year'
  const premiumType = isTrial ? 'Trial Premium' : 'Premium'
  if (hasSubscriptions && !hasItemBankPermissions) {
    const { subEndDate } = subscriptions
    const formatSubEndDate = moment(subEndDate).format('DD MMM, YYYY')
    if (!isTrial) {
      yield call(notification, {
        type: 'success',
        msg: `Congratulations! Your account is upgraded to ${premiumType} version for ${subscriptionPeriod} and the subscription will expire on ${formatSubEndDate}`,
        key: 'handle-payment',
      })
    }
    yield put(
      slice.actions.trialConfirmationMessageAction({
        hasTrial: 'onlyPremiumTrial',
        subEndDate: formatSubEndDate,
      })
    )
  } else if (hasItemBankPermissions && !hasSubscriptions) {
    const { subEndDate } = itemBankPermissions[0]
    const itemBankNames = itemBankPermissions.map((x) => x.name).join(', ')
    const formatSubEndDate = moment(subEndDate).format('DD MMM, YYYY')
    if (!isTrial) {
      yield call(notification, {
        type: 'success',
        msg: `Congratulations! You are subscribed to ${itemBankNames} ${premiumType} Itembank(s) for ${subscriptionPeriod} and the subscription will expire on ${formatSubEndDate}`,
        key: 'handle-payment',
      })
    }
    yield put(
      slice.actions.trialConfirmationMessageAction({
        hasTrial: 'onlySparkTrial',
        subEndDate: formatSubEndDate,
      })
    )
  } else if (hasItemBankPermissions && hasSubscriptions) {
    const { subEndDate } = subscriptions
    const itemBankNames = itemBankPermissions.map((x) => x.name).join(', ')
    const formatSubEndDate = moment(subEndDate).format('DD MMM, YYYY')
    if (!isTrial) {
      yield call(notification, {
        type: 'success',
        msg: `Congratulations! Your account is upgraded to ${premiumType} version and You are now subscribed to ${itemBankNames}
              Premium Itembank for ${subscriptionPeriod} and the subscription will expire on ${formatSubEndDate}`,
        key: 'handle-payment',
      })
    }
    yield put(
      slice.actions.trialConfirmationMessageAction({
        hasTrial: 'haveBothSparkAndPremiumTrial',
        subEndDate: formatSubEndDate,
      })
    )
  }
}

function* upgradeUserLicense({ payload }) {
  try {
    yield call(message.loading, {
      content: 'Verifying License...',
      key: 'verify-license',
    })
    const apiUpgradeUserResponse = yield call(
      subscriptionApi.upgradeUsingLicenseKey,
      payload
    )
    if (apiUpgradeUserResponse.success) {
      yield put(slice.actions.upgradeLicenseKeySuccess(apiUpgradeUserResponse))
      notification({
        type: 'success',
        msg: { content: 'Verified!', key: 'verify-license' },
      })
      yield put(fetchUserAction({ background: true }))
    }
  } catch (err) {
    yield put(slice.actions.upgradeLicenseKeyFailure(err?.data?.message))
    notification({
      messageKey: 'theLisenceKeyEnteredIEitherUseOrNotValid',
      Key: 'verify-license',
    })
    console.error('ERROR WHILE VERIFYING USER LICENSE KEY : ', err)
  }
}

function* fetchUserSubscription() {
  try {
    const apiUserSubscriptionStatus = yield call(
      subscriptionApi.subscriptionStatus
    )
    const { result } = apiUserSubscriptionStatus || {}
    const premiumProductId = result?.products.find(
      (product) => product.type === 'PREMIUM'
    )?.id
    const data = {
      isPremiumTrialUsed: result?.isPremiumTrialUsed,
      itemBankSubscriptions: result?.itemBankSubscriptions,
      usedTrialItemBankId: result?.usedTrialItemBankId,
      premiumProductId,
    }

    yield put(
      slice.actions.setAddOnProducts(
        apiUserSubscriptionStatus?.result?.products || []
      )
    )
    if (apiUserSubscriptionStatus?.result.subscription === -1) {
      yield put(slice.actions.updateUserSubscriptionExpired(data))
      return
    }
    if (result.subscription) {
      Object.assign(data, {
        subscription: result.subscription,
      })
      if (result.subscription._id) {
        Object.assign(data, {
          success: true,
        })
      }
      yield put(slice.actions.updateUserSubscriptionStatus({ data, error: '' }))
    } else
      yield put(
        slice.actions.updateUserSubscriptionStatus({
          data: {},
          error: result,
        })
      )
  } catch (err) {
    yield put(
      slice.actions.updateUserSubscriptionStatus({ data: {}, error: err })
    )
    console.error('ERROR WHILE FETCHING USER SUBSCRIPTION : ', err)
    captureSentryException(err)
  }
}

function* handleStripePayment({ payload }) {
  try {
    const { stripe, data, productIds } = payload
    yield call(message.loading, {
      content: 'Processing Payment, please wait',
      key: 'verify-license',
    })
    const { token, error } = yield stripe.createToken(data)
    if (token) {
      const apiPaymentResponse = yield call(paymentApi.pay, {
        productIds,
        token,
      })
      if (apiPaymentResponse.success) {
        yield put(slice.actions.stripePaymentSuccess(apiPaymentResponse))
        yield put(slice.actions.setPaymentServiceModal(false))
        yield call(showSuccessNotifications, apiPaymentResponse)
        yield call(fetchUserSubscription)
        yield put(fetchUserAction({ background: true }))
      } else {
        notification({
          msg: `API Response failed: ${error}`,
          Key: 'handle-payment',
        })
        console.error('API Response failed')
      }
    } else {
      notification({
        msg: `Creating token failed : ${error.message}`,
        Key: 'handle-payment',
      })
      yield put(slice.actions.disablePending())
      console.error('ERROR WHILE PROCESSING PAYMENT [Create Token] : ', error)
    }
  } catch (err) {
    yield put(slice.actions.stripePaymentFailure(err?.data?.message))
    notification({
      msg: `Payment Failed : ${err?.response?.data?.message}`,
      Key: 'handle-payment',
    })
    console.error('ERROR WHILE PROCESSING PAYMENT : ', err)
    captureSentryException(err)
  }
}

function* handleFreeTrialSaga({ payload }) {
  try {
    const apiPaymentResponse = yield call(paymentApi.pay, payload)
    if (apiPaymentResponse.success) {
      yield put(slice.actions.startTrialSuccessAction(apiPaymentResponse))
      yield put(slice.actions.resetSubscriptions())
      yield call(showSuccessNotifications, apiPaymentResponse, true)
      yield call(fetchUserSubscription)
      yield put(fetchUserAction({ background: true }))
      yield put(slice.actions.trialSubsConfirmationAction(true))
    } else {
      notification({
        type: 'error',
        msg: `API Response failed`,
        Key: 'handle-trial',
      })
      console.error('API Response failed')
    }
  } catch (err) {
    yield put(slice.actions.startTrialFailureAction(err?.data?.message))
    notification({
      msg: `Trial Subscription : ${err?.response?.data?.message}`,
      Key: 'handle-trial',
    })
    console.error('ERROR WHILE PROCESSING TRIAL SUBSCRIPTION : ', err)
    captureSentryException(err)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.upgradeLicenseKeyPending, upgradeUserLicense),
    yield takeEvery(slice.actions.stripePaymentAction, handleStripePayment),
    yield takeEvery(slice.actions.startTrialAction, handleFreeTrialSaga),
    yield takeEvery(
      slice.actions.fetchUserSubscriptionStatus,
      fetchUserSubscription
    ),
  ])
}
