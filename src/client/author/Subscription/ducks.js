import { captureSentryException, notification } from '@edulastic/common'
import { message } from 'antd'
import { isEmpty, uniq, compact } from 'lodash'
import moment from 'moment'
import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import {
  subscriptionApi,
  paymentApi,
  segmentApi,
  userApi,
} from '@edulastic/api'
import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { push } from 'react-router-redux'
import {
  fetchUserAction,
  getUserId as getUserIdSelector,
} from '../../student/Login/ducks'
import { fetchMultipleSubscriptionsAction } from '../ManageSubscription/ducks'
import { getUserSelector, isPremiumUserSelector } from '../src/selectors/user'
import { fetchDashboardTiles } from '../Dashboard/ducks'

// selectors
const subscriptionSelector = (state) => state.subscription
export const getSubscriptionDataSelector = createSelector(
  subscriptionSelector,
  (state) => state.subscriptionData
)
export const getCartVisibleSelector = createSelector(
  subscriptionSelector,
  (state) => state.cartVisible
)
export const getCartQuantities = createSelector(
  subscriptionSelector,
  (state) => state.cartQuantities
)

export const getSubscriptionSelector = createSelector(
  getSubscriptionDataSelector,
  (state) => state.subscription
)
export const getSuccessSelector = createSelector(
  getSubscriptionDataSelector,
  (state) => state.success
)
export const getProducts = createSelector(
  subscriptionSelector,
  (state) => state.products
)
export const trialPeriodTextSelector = createSelector(
  getProducts,
  (products) =>
    products?.filter((o) => o.type === 'PREMIUM')?.displayText ||
    products?.filter((o) => o.type !== 'STUDENT_LICENSE')?.[0]?.displayText
)
export const getItemBankSubscriptions = createSelector(
  getSubscriptionDataSelector,
  (state) => state.itemBankSubscriptions
)
export const getIsVerificationPending = createSelector(
  subscriptionSelector,
  (state) => state.verificationPending
)
export const getPremiumProductId = createSelector(
  getSubscriptionDataSelector,
  (state) => state.premiumProductId
)
export const getIsSubscriptionExpired = createSelector(
  subscriptionSelector,
  (state) => state.isSubscriptionExpired
)
export const getAddOnProductIds = createSelector(
  subscriptionSelector,
  (state) => state.addOnProductIds
)
export const getShowTrialConfirmationMessageSelector = createSelector(
  subscriptionSelector,
  (state) => state.showTrialConfirmationMessage
)
export const getBookKeepersInviteSuccessStatus = createSelector(
  subscriptionSelector,
  (state) => state.isBookKeepersInviteSuccess
)
export const getRequestOrSubmitActionStatus = createSelector(
  subscriptionSelector,
  (state) => state.isRequestOrSubmitActionPending
)
export const getRequestOrSubmitSuccessVisibility = createSelector(
  subscriptionSelector,
  (state) => state.isRequestOrSubmitSuccessModalVisible
)
export const getRequestQuoteVisibility = createSelector(
  subscriptionSelector,
  (state) => state.isRequestQuoteModalVisible
)

export const getShowHeaderTrialModal = createSelector(
  subscriptionSelector,
  (state) => state?.showHeaderTrialModal
)

export const getIsPaidPremium = createSelector(
  getSubscriptionSelector,
  isPremiumUserSelector,
  (sub, isPremiumUser) => {
    const subType = sub?.subType
    return !(
      !subType ||
      subType === 'TRIAL_PREMIUM' ||
      (subType === 'partial_premium' && !isPremiumUser)
    )
  }
)

export const getIsAboutToExpire = createSelector(
  getSubscriptionSelector,
  (sub) => {
    const subEndDate = sub?.subEndDate
    return subEndDate
      ? Date.now() + 30 * 24 * 60 * 60 * 1000 > subEndDate &&
          Date.now() < subEndDate + 10 * 24 * 60 * 60 * 1000
      : false
  }
)

export const getNeedsRenewal = createSelector(
  getSubscriptionSelector,
  getIsPaidPremium,
  getIsAboutToExpire,
  getIsSubscriptionExpired,
  (sub, isPaidPremium, isAboutToExpire, isSubscriptionExpired) => {
    const subType = sub?.subType
    return (
      ((isPaidPremium && isAboutToExpire) ||
        (!isPaidPremium && isSubscriptionExpired)) &&
      !['enterprise', 'partial_premium'].includes(subType)
    )
  }
)

const slice = createSlice({
  name: 'subscription', //! FIXME key should be `slice` not `name`
  initialState: {
    isSubscriptionExpired: false,
    verificationPending: false,
    subscriptionData: {},
    error: '',
    showTrialConfirmationMessage: '',
    products: [],
    showHeaderTrialModal: false,
    addOnProductIds: [],
    isBookKeepersInviteSuccess: false,
    isRequestQuoteModalVisible: false,
    isRequestOrSubmitActionPending: false,
    isRequestOrSubmitSuccessModalVisible: false,
    cartQuantities: {},
    cartVisible: false,
    proratedProducts: null,
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
    stripeMultiplePaymentAction: (state) => {
      state.verificationPending = true
    },
    edulasticAdminProductLicenseAction: (state) => {
      state.verificationPending = true
    },
    stripeMultiplePaymentFailureAction: (state) => {
      state.verificationPending = false
    },
    stripeMultiplePaymentSuccessAction: (state, { payload }) => {
      state.verificationPending = false
      state.multiplePaymentData = payload
    },
    stripePaymentSuccess: (state, { payload }) => {
      state.verificationPending = false
      state.subscriptionData = payload
      state.error = ''
      state.addOnProductIds = []
    },
    stripePaymentFailure: (state, { payload }) => {
      state.verificationPending = false
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
    trialConfirmationMessageAction: (state, { payload }) => {
      state.showTrialConfirmationMessage = payload
    },
    setAddOnProducts: (state, { payload }) => {
      state.products = payload
    },
    setShowHeaderTrialModal: (state, { payload }) => {
      state.showHeaderTrialModal = payload
    },
    setAddOnProductIds: (state, { payload }) => {
      state.addOnProductIds = payload
    },
    setBookKeepersInviteSuccess: (state, { payload }) => {
      state.isBookKeepersInviteSuccess = payload
    },
    bulkInviteBookKeepersAction: () => {},
    requestInvoiceAction: (state) => {
      state.isRequestOrSubmitActionPending = true
    },
    submitPOAction: (state) => {
      state.isRequestOrSubmitActionPending = true
    },
    requestOrSubmitActionSuccess: (state, { payload }) => {
      state.isRequestOrSubmitActionPending = false
      state.isRequestOrSubmitSuccessModalVisible = payload
    },
    requestOrSubmitActionFailure: (state) => {
      state.isRequestOrSubmitActionPending = false
    },
    toggleRequestOrSubmitSuccessModal: (state, { payload }) => {
      state.isRequestOrSubmitSuccessModalVisible = payload
    },
    setCartQuantities: (state, { payload }) => {
      if (!Object.keys(payload).find((x) => payload[x])) {
        // empty qantities - so closing cart
        state.cartVisible = false
      }
      state.cartQuantities = payload
    },
    setCartVisible: (state, { payload }) => {
      state.cartVisible = payload
    },
    setRequestQuoteModal: (state, { payload }) => {
      state.isRequestQuoteModalVisible = payload
    },
    setProratedProducts: (state, { payload }) => {
      state.proratedProducts = payload
    },
  },
})

export { slice }

function* showSuccessNotifications(apiPaymentResponse, isTrial = false) {
  const { subscriptions, itemBankPermissions = [] } = apiPaymentResponse
  const hasSubscriptions = Object.keys(subscriptions).length > 0
  const hasItemBankPermissions = !isEmpty(itemBankPermissions)
  const displayText = yield select(trialPeriodTextSelector)
  const subscriptionPeriod = isTrial ? `${displayText}` : 'an year'
  const premiumType = isTrial ? 'Trial Premium' : 'Premium'
  const { user } = yield select(getUserSelector)
  const eventType = isTrial ? 'trial' : 'purchase'
  if (hasSubscriptions) {
    const { subEndDate } = subscriptions
    segmentApi.trackProductPurchase({
      user,
      data: {
        event: `order premium ${eventType}`,
        Premium_status: eventType,
        Premium_purchase_date: new Date(),
        Premium_expiry_date: new Date(subEndDate),
      },
    })
  }
  if (hasItemBankPermissions) {
    const purchaseDate = new Date()
    itemBankPermissions.forEach((permissions) => {
      const { name, subEndDate } = permissions
      const [pFirstName, pSecondName] = name.split(' ')
      let productName = `${pFirstName[0]}${pSecondName}`
      let eventName = `order ${productName.toLowerCase()} ${eventType}`
      if (name.split(' ').length === 1) {
        productName = `${pFirstName.toLowerCase()}`
        eventName = `order ${productName.toLowerCase()} ${eventType}`
      }
      const data = {
        event: eventName,
        [`${productName}_status`]: eventType,
        [`${productName}_purchase_date`]: purchaseDate,
        [`${productName}_expiry_date`]: new Date(subEndDate),
      }
      segmentApi.trackProductPurchase({
        user,
        data,
      })
    })
  }

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
        isTrial,
      })
    )
  } else if (hasItemBankPermissions && !hasSubscriptions) {
    const { subEndDate } = itemBankPermissions[0]
    const itemBankNames = itemBankPermissions.map((x) => x.name).join(', ')
    const defaultSelectedItemBankId = itemBankPermissions.map((x) => x.id)[0]
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
        isTrial,
        defaultSelectedItemBankId,
      })
    )
  } else if (hasItemBankPermissions && hasSubscriptions) {
    const { subEndDate } = subscriptions
    const itemBankNames = itemBankPermissions.map((x) => x.name).join(', ')
    const defaultSelectedItemBankId = itemBankPermissions.map((x) => x.id)[0]
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
        isTrial,
        defaultSelectedItemBankId,
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

function* fetchUserSubscription(...args) {
  try {
    const { payload } = args[0] || {}
    const apiUserSubscriptionStatus = yield call(
      subscriptionApi.subscriptionStatus,
      payload
    )

    const isCliUser = yield select(
      (state) => state.user?.user?.openIdProvider === 'CLI'
    )

    if (isCliUser && apiUserSubscriptionStatus?.result?.products) {
      apiUserSubscriptionStatus.result.products = apiUserSubscriptionStatus?.result?.products?.filter(
        (x) => !x?.type?.includes('ITEM_BANK_SPARK_')
      )
    }

    const { result } = apiUserSubscriptionStatus || {}
    if (result?.subscription?.status === 0) {
      result.subscription = null
      if (result?.itemBankSubscriptions?.length) {
        result.itemBankSubscriptions = result.itemBankSubscriptions.filter(
          (x) => x.isTrial
        )
      }
    }

    const premiumProductId = result?.products.find(
      (product) => product.type === 'PREMIUM'
    )?.id
    const data = {
      isPremiumTrialUsed: result?.isPremiumTrialUsed,
      itemBankSubscriptions: result?.itemBankSubscriptions,
      usedTrialItemBankIds: result?.usedTrialItemBankIds,
      premiumProductId,
    }

    yield put(
      slice.actions.setAddOnProducts(
        apiUserSubscriptionStatus?.result?.products || []
      )
    )
    if (apiUserSubscriptionStatus?.result?.subscription === -1) {
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

function* handleEdulasticAdminProductLicenseSaga({ payload }) {
  try {
    const {
      products,
      emailIds: userEmailIds,
      licenseIds,
      licenseOwnerId,
    } = payload
    const _products = products.reduce((allProducts, product) => {
      const { quantity, id, linkedProductId } = product
      allProducts[id || linkedProductId] = quantity
      return allProducts
    }, {})
    const apiPaymentResponse = yield call(paymentApi.licensePurchase, {
      products: _products,
      userEmailIds,
      licenseIds,
      licenseOwnerId,
    })
    if (apiPaymentResponse.licenseKeys) {
      yield put(
        slice.actions.stripeMultiplePaymentSuccessAction(
          apiPaymentResponse.licenseKeys
        )
      )
      yield put(
        fetchMultipleSubscriptionsAction({ background: true, licenseOwnerId })
      )
    }
  } catch (err) {
    notification({
      type: 'error',
      msg: 'Process failed.',
    })
    console.error(
      '[Edulastic Admin] ERROR WHILE PROCESSING LICENSE PURCHASE : ',
      err
    )
    captureSentryException(err)
  }
}

function* handleMultiplePurchasePayment({ payload }) {
  try {
    yield call(message.loading, {
      content: 'Processing Payment, please wait',
      key: 'verify-license',
    })
    const {
      stripe,
      data,
      productIds,
      emailIds: userEmailIds,
      licenseIds,
      licenseOwnerId,
      setPaymentServiceModal,
    } = payload
    const { token, error } = yield stripe.createToken(data)
    if (token) {
      const products = productIds.reduce((allProducts, product) => {
        const { quantity, id, linkedProductId } = product
        if (quantity) {
          allProducts[id || linkedProductId] = quantity
        }
        return allProducts
      }, {})
      const apiPaymentResponse = yield call(paymentApi.licensePurchase, {
        token,
        products,
        userEmailIds,
        licenseIds,
      })
      if (apiPaymentResponse.licenseKeys) {
        yield put(slice.actions.setCartQuantities({}))
        yield put(
          slice.actions.stripeMultiplePaymentSuccessAction(
            apiPaymentResponse.licenseKeys
          )
        )
        setPaymentServiceModal(false)
        yield put(fetchMultipleSubscriptionsAction({ licenseOwnerId }))
        yield put(fetchUserAction({ background: true }))
        yield put(push('/author/manage-subscriptions'))
        notification({
          type: 'success',
          msg: `Payment successful.`,
        })
      } else {
        notification({
          type: 'error',
          msg: `Payment failed.`,
        })
        yield put(slice.actions.stripeMultiplePaymentFailureAction())
      }
    } else {
      notification({
        type: 'error',
        msg: `Creating token failed : ${error.message}`,
      })
      yield put(slice.actions.stripeMultiplePaymentFailureAction())
      console.error('ERROR WHILE PROCESSING PAYMENT [Create Token] : ', error)
    }
  } catch (err) {
    yield put(slice.actions.stripeMultiplePaymentFailureAction())
    notification({
      type: 'error',
      msg: 'Payment failed.',
    })
    console.error('ERROR WHILE PROCESSING LICENSE PURCHASE : ', err)
    captureSentryException(err)
  }
}

function* handleStripePayment({ payload }) {
  try {
    const {
      stripe,
      data,
      productIds,
      setPaymentServiceModal,
      setShowTrialSubsConfirmation,
    } = payload
    yield call(message.loading, {
      content: 'Processing Payment, please wait',
      key: 'verify-license',
    })
    const { token, error } = yield stripe.createToken(data)
    const currentSubsctiption = yield select(getSubscriptionSelector) || {}
    const userWasOnFreePlan = ![
      'premium',
      'enterprise',
      'partial_premium',
    ].includes(currentSubsctiption?.subType)

    if (token) {
      const apiPaymentResponse = yield call(paymentApi.pay, {
        productIds: uniq(compact(productIds)),
        token,
      })
      if (apiPaymentResponse.success) {
        yield put(slice.actions.setCartQuantities({}))
        yield put(slice.actions.stripePaymentSuccess(apiPaymentResponse))
        setPaymentServiceModal(false)
        yield call(showSuccessNotifications, apiPaymentResponse)
        yield call(fetchUserSubscription)
        if (userWasOnFreePlan) {
          window.localStorage.setItem('author:dashboard:version', 0)
          yield put(fetchDashboardTiles())
        }
        yield put(fetchUserAction({ background: true }))
        yield put(fetchMultipleSubscriptionsAction({ background: true }))
        setShowTrialSubsConfirmation(true)
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
  const { productIds, setShowTrialSubsConfirmation } = payload
  try {
    const apiPaymentResponse = yield call(paymentApi.pay, { productIds })
    if (apiPaymentResponse.success) {
      yield put(slice.actions.startTrialSuccessAction(apiPaymentResponse))
      yield put(slice.actions.resetSubscriptions())
      yield call(showSuccessNotifications, apiPaymentResponse, true)
      yield call(fetchUserSubscription)
      yield put(fetchUserAction({ background: true }))
      setShowTrialSubsConfirmation(true)
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

function* bulkInviteBookKeepersSaga({ payload }) {
  try {
    if (payload?.userDetails?.length) {
      yield call(userApi.adddBulkTeacher, payload)
    }

    yield put(slice.actions.setBookKeepersInviteSuccess(true))
  } catch (err) {
    notification({
      type: 'error',
      msg: 'Something went wrong while inviting bookeepers',
    })
    captureSentryException(err)
  }
}

function* requestInvoiceSaga({ payload }) {
  try {
    const { closeCallback = () => {}, reqPayload } = payload
    const result = yield call(subscriptionApi.requestInvoice, reqPayload)
    if (result?.result?.success) {
      closeCallback()
      const msg = `We'll be back to you right away with your ${
        reqPayload.documentType === 'OTHER'
          ? reqPayload.typeDescription
          : (reqPayload.documentType || '').toLowerCase()
      }!`
      yield put(slice.actions.requestOrSubmitActionSuccess(msg))
    } else {
      yield put(slice.actions.requestOrSubmitActionFailure())
    }
  } catch (err) {
    yield put(slice.actions.requestOrSubmitActionFailure())
    notification({
      type: 'error',
      msg: 'Something went wrong. ',
    })
    captureSentryException(err)
  }
}

function* submitPOSaga({ payload }) {
  try {
    const { closeCallback = () => {}, reqPayload } = payload
    const result = yield call(subscriptionApi.submitPO, reqPayload)
    if (result?.result?.success) {
      closeCallback()
      const msg = `We'll be back to you right away with your purchase order!`
      yield put(slice.actions.requestOrSubmitActionSuccess(msg))
    } else {
      yield put(slice.actions.requestOrSubmitActionFailure())
    }
  } catch (err) {
    yield put(slice.actions.requestOrSubmitActionFailure())
    notification({
      type: 'error',
      msg: 'Something went wrong while submiting PO.',
    })
    captureSentryException(err)
  }
}

function* storeQuantitiesSaga({ payload }) {
  const userId = yield select(getUserIdSelector)
  const key = `cartQunatities:${userId}`
  localStorage[key] = JSON.stringify(payload)
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.upgradeLicenseKeyPending, upgradeUserLicense),
    yield takeEvery(slice.actions.stripePaymentAction, handleStripePayment),
    yield takeEvery(
      slice.actions.stripeMultiplePaymentAction,
      handleMultiplePurchasePayment
    ),
    yield takeEvery(
      slice.actions.edulasticAdminProductLicenseAction,
      handleEdulasticAdminProductLicenseSaga
    ),
    yield takeEvery(slice.actions.startTrialAction, handleFreeTrialSaga),
    yield takeEvery(
      slice.actions.fetchUserSubscriptionStatus,
      fetchUserSubscription
    ),
    yield takeEvery(
      slice.actions.bulkInviteBookKeepersAction,
      bulkInviteBookKeepersSaga
    ),
    yield takeEvery(slice.actions.requestInvoiceAction, requestInvoiceSaga),
    yield takeEvery(slice.actions.submitPOAction, submitPOSaga),
    yield takeEvery(slice.actions.setCartQuantities, storeQuantitiesSaga),
  ])
}
