import { createSlice, createAction } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { manageSubscriptionsApi, adminApi } from '@edulastic/api'
import { combineReducers } from 'redux'
import { put, takeEvery, call, all } from 'redux-saga/effects'
import { notification } from '@edulastic/common'
import { keyBy } from 'lodash'

// ACTIONS
const GET_DISTRICT_DATA = '[admin-upgrade] GET_DISTRICT_DATA'
const UPGRADE_DISTRICT_SUBSCRIPTION =
  '[admin-upgrade] UPGRADE_DISTRICT_SUBSCRIPTION'
const UPGRADE_USER_SUBSCRIPTION = '[admin-upgrade] UPGRADE_USER_SUBSCRIPTION'
const SEARCH_USERS_BY_EMAIL_IDS = '[admin-upgrade] SEARCH_USERS_BY_EMAIL_IDS'
const SEARCH_SCHOOLS_BY_ID = '[admin-upgrade] SEARCH_SCHOOLS_BY_ID'
const BULK_SCHOOLS_SUBSCRIBE = '[admin-upgrade] BULK_SCHOOLS_SUBSCRIBE'
const UPGRADE_PARTIAL_PREMIUM_USER =
  '[admin-upgrade] UPGRADE_PARTIAL_PREMIUM_USER'
const SAVE_ORG_PERMISSIONS = '[admin] save org permissions'
const GET_SUBSCRIPTION = '[admin] get subscription'

// ACTION CREATORS
export const getDistrictDataAction = createAction(GET_DISTRICT_DATA)
export const upgradeDistrictSubscriptionAction = createAction(
  UPGRADE_DISTRICT_SUBSCRIPTION
)
export const upgradeUserSubscriptionAction = createAction(
  UPGRADE_USER_SUBSCRIPTION
)
export const searchUsersByEmailIdAction = createAction(
  SEARCH_USERS_BY_EMAIL_IDS
)
export const searchSchoolsByIdAction = createAction(SEARCH_SCHOOLS_BY_ID)
export const bulkSchoolsSubscribeAction = createAction(BULK_SCHOOLS_SUBSCRIBE)
export const upgradePartialPremiumUserAction = createAction(
  UPGRADE_PARTIAL_PREMIUM_USER
)
export const saveOrgPermissionsAction = createAction(SAVE_ORG_PERMISSIONS)
export const getSubscriptionAction = createAction(GET_SUBSCRIPTION)

// SLICE's
export const manageSubscriptionsBydistrict = createSlice({
  slice: 'manageSubscriptionsBydistrict', // slice is optional, and could be blank ''
  initialState: {
    loading: false,
    listOfDistricts: [],
    selectedDistrict: {},
  },
  reducers: {
    setLoader: (state, { payload }) => {
      state.loading = payload
    },
    success: (state, { payload }) => {
      // if only a single district is returned, the returned district becomes the selected District by default
      if (payload.data.length === 1) {
        ;[state.selectedDistrict] = payload.data
      } else {
        state.listOfDistricts = payload.data
      }
    },
    selectDistrict: (state, { payload: index }) => {
      state.selectedDistrict = state.listOfDistricts[index]
      // here the autocomplete dataSource becomes empty so that user is not presented with same data when he types
      state.listOfDistricts = []
    },
    subscribeSuccess: (state, { payload }) => {
      state.selectedDistrict.subscription = payload.subscription
    },
  },
})

const manageSubscriptionsByUsers = createSlice({
  slice: 'manageSubscriptionsByUsers', // slice is optional, and could be blank ''
  initialState: {
    validEmailIdsList: null,
    subscriptionData: {},
  },
  reducers: {
    success: (state, { payload }) => {
      // here once subscription is completed, the table has to re-render and show the updated values,
      // hence, these updatedSubType key is set.
      payload.forEach((item, index) => {
        const { subscription = {} } = item
        if (!state.validEmailIdsList[index].subscription) {
          state.validEmailIdsList[index].subscription = {}
        }
        if (item.success) {
          state.validEmailIdsList[index].subscription = subscription
        }
        state.validEmailIdsList[index].subscription.updatedSubTypeSuccess =
          item.success
      })
    },
    searchEmailIdsSuccess: (state, { payload }) => {
      state.validEmailIdsList = payload.data
    },
  },
})

export const manageSubscriptionsBySchool = createSlice({
  slice: 'manageSubscriptionsBySchool', // slice is optional, and could be blank ''
  initialState: {
    searchedSchoolsData: {},
    currentEditableRow: null,
    editableRowFieldValues: {},
  },
  reducers: {
    success: (state, { payload }) => {
      state.searchedSchoolsData = payload
    },
    bulkSubscriptionSuccess: (state, { payload }) => {
      payload.forEach((item) => {
        const { subscription = {} } = item
        if (item.success) {
          state.searchedSchoolsData[
            subscription.schoolId
          ].subscription = subscription
        }
        state.searchedSchoolsData[
          subscription.schoolId
        ].subscription.updatedSubTypeSuccess = item.success
      })
    },
    updateCurrentEditableRow: (state, { payload }) => {
      if (payload) {
        const { schoolId, ...rest } = payload
        state.currentEditableRow = schoolId
        state.editableRowFieldValues = rest
      } else {
        state.currentEditableRow = null
        state.editableRowFieldValues = {}
      }
    },
    setEditableRowFieldValues: (state, { payload: { fieldName, value } }) => {
      state.editableRowFieldValues[fieldName] = value
    },
  },
})

export const manageSubscriptionsByUserSegments = createSlice({
  slice: 'manageSubscriptionsByUserSegments', // slice is optional, and could be blank ''
  initialState: {
    partialPremiumData: {},
    gradeSubject: [],
  },
  reducers: {
    setPartialPremiumData: (state, { payload }) => {
      const { subscription: { gradeSubject = [] } = {} } = payload
      state.partialPremiumData = payload
      state.gradeSubject = gradeSubject
    },
    setGradeSubjectValue: (state, { payload: { type, index, value } }) => {
      state.gradeSubject[index][type] = value
    },
    addGradeSubjectRow: (state) => {
      state.gradeSubject.push({
        grade: '',
        subject: '',
      })
    },
    deleteGradeSubjectRow: (state, { payload: index }) => {
      state.gradeSubject.splice(index, 1)
    },
    setSubsciptions: (state, { payload }) => {
      state.partialPremiumData = payload || {}
      state.gradeSubject = payload?.gradeSubject || []
    },
  },
})

export const manageSubscriptionsByLicenses = createSlice({
  slice: 'manageSubscriptionsByLicenses',
  initialState: {
    loading: false,
    licenses: [],
    count: 0,
    searchType: null,
  },
  reducers: {
    fetchLicenses: (state) => {
      state.loading = true
    },
    fetchLicensesSuccess: (state, { payload }) => {
      state.loading = false
      state.licenses = payload.licenses
      state.count = payload.count
    },
    fetchLicensesError: (state) => {
      state.loading = false
    },
    setSearchType: (state, { payload }) => {
      state.searchType = payload
    },
    viewLicense: (state, { payload }) => {}, // TODO!
    deleteLicense: (state, { payload }) => {},
  },
})

// SELECTORS
const upGradeStateSelector = (state) => state.admin.upgradeData

export const getDistrictDataSelector = createSelector(
  upGradeStateSelector,
  ({ districtSearchData }) => districtSearchData
)

export const getUsersDataSelector = createSelector(
  upGradeStateSelector,
  ({ manageUsers }) => manageUsers
)

export const getManageSubscriptionBySchoolData = createSelector(
  upGradeStateSelector,
  ({ manageSchoolsData }) => manageSchoolsData
)

export const getManageSubscriptionByUserSegmentsData = createSelector(
  upGradeStateSelector,
  ({ manageUserSegmentData }) => manageUserSegmentData
)

export const getManageSubscriptionByLicensesData = createSelector(
  upGradeStateSelector,
  ({ manageLicensesData }) => manageLicensesData
)

// REDUCERS
const reducer = combineReducers({
  districtSearchData: manageSubscriptionsBydistrict.reducer,
  manageUsers: manageSubscriptionsByUsers.reducer,
  manageSchoolsData: manageSubscriptionsBySchool.reducer,
  manageUserSegmentData: manageSubscriptionsByUserSegments.reducer,
  manageLicensesData: manageSubscriptionsByLicenses.reducer,
})

// API's
const {
  getSubscription,
  searchUpdateDistrict: searchUpdateDistrictApi,
  manageSubscription: manageSubscriptionApi,
  searchUsersByEmailsOrIds: searchUsersByEmailsOrIdsApi,
  searchSchoolsById: searchSchoolsByIdApi,
  saveOrgPermissionsApi,
} = adminApi

// SAGAS
function* getDistrictData({ payload }) {
  try {
    yield put(manageSubscriptionsBydistrict.actions.setLoader(true))
    const item = yield call(searchUpdateDistrictApi, payload)
    yield put(manageSubscriptionsBydistrict.actions.setLoader(false))
    yield put(manageSubscriptionsBydistrict.actions.success(item))
  } catch (err) {
    console.error(err)
  }
}

function* upgradeDistrict({ payload }) {
  try {
    const { result } = yield call(manageSubscriptionApi, payload)
    if (result.success) {
      notification({ type: 'success', msg: result.message })
      yield put(
        manageSubscriptionsBydistrict.actions.subscribeSuccess(
          result.subscriptionResult[0]
        )
      )
    }
  } catch (err) {
    console.error(err)
  }
}

function* upgradeUserData({ payload }) {
  console.log('payload', payload)
  try {
    const { result } = yield call(manageSubscriptionApi, payload)
    if (result.success) {
      notification({ type: 'success', msg: result.message })
      yield put(
        manageSubscriptionsByUsers.actions.success(result.subscriptionResult)
      )
    } else {
      notification({ msg: result.message })
    }
  } catch (err) {
    console.error(err)
  }
}

function* searchUsersByEmailIds({ payload }) {
  try {
    const item = yield call(searchUsersByEmailsOrIdsApi, payload)
    if (item.result) {
      if (!item.result.data.length) {
        notification({ messageKey: 'userNotFound' })
      }
      yield put(
        manageSubscriptionsByUsers.actions.searchEmailIdsSuccess(item.result)
      )
    }
  } catch (err) {
    console.error(err)
  }
}

function* searchSchoolsById({ payload }) {
  try {
    const item = yield call(searchSchoolsByIdApi, payload)
    if (item.result) {
      const hashedResult = keyBy(item.result, 'schoolId')
      yield put(manageSubscriptionsBySchool.actions.success(hashedResult))
    }
  } catch (err) {
    console.error(err)
  }
}

function* bulkSchoolsSubscribe({ payload }) {
  try {
    const { result } = yield call(manageSubscriptionApi, payload)
    if (result.success) {
      notification({ type: 'success', msg: result.message })
      yield put(
        manageSubscriptionsBySchool.actions.bulkSubscriptionSuccess(
          result.subscriptionResult
        )
      )
      yield put(manageSubscriptionsBySchool.actions.updateCurrentEditableRow())
    } else {
      notification({ msg: result.message })
    }
  } catch (err) {
    console.error(err)
  }
}

function* upgradePartialPremiumUser({ payload }) {
  try {
    const { result } = yield call(manageSubscriptionApi, payload)
    if (result.success) {
      notification({ type: 'success', msg: result.message })
    } else {
      notification({ msg: result.message })
    }
  } catch (err) {
    console.error(err)
  }
}

function* saveOrgPermissionsSaga({ payload }) {
  try {
    yield call(saveOrgPermissionsApi, payload)
    yield call(notification, {
      type: 'success',
      message: 'savOrgPermissionSucc',
    })
  } catch (err) {
    console.error(err)
    yield call(notification, { message: 'savOrgPermissionErr' })
  }
}

function* getSubscriptionSaga({ payload }) {
  try {
    const subscription = yield call(getSubscription, payload)
    yield put(
      manageSubscriptionsByUserSegments.actions.setSubsciptions(subscription)
    )
  } catch (err) {
    yield call(notification, {
      type: 'error',
      msg: 'Failed to load subscriptions.',
    })
  }
}

function* fetchLicensesByTypeSaga({ payload }) {
  try {
    const result = yield call(
      manageSubscriptionsApi.fetchManageLicenses,
      payload
    )
    yield put(
      manageSubscriptionsByLicenses.actions.fetchLicensesSuccess(result)
    )
  } catch (err) {
    manageSubscriptionsByLicenses.actions.fetchLicensesError()
    yield call(notification, {
      type: 'error',
      msg: 'Failed to load subscriptions.',
    })
  }
}

function* deleteLicensesByIdsSaga({ payload }) {
  try {
    const { licenseIds, search } = payload
    const result = yield call(manageSubscriptionsApi.deleteLicenses, {
      licenseIds,
    })
    if (!result.error) {
      notification({ type: 'success', msg: result.message })
      const licenses = yield call(
        manageSubscriptionsApi.fetchManageLicenses,
        search
      )
      yield put(
        manageSubscriptionsByLicenses.actions.fetchLicensesSuccess(licenses)
      )
    } else {
      notification({ type: 'error', msg: result.message })
    }
  } catch (err) {
    notification({
      type: 'error',
      msg: 'Failed to delete subscriptions.',
    })
  }
}

function* watcherSaga() {
  yield all([
    yield takeEvery(GET_DISTRICT_DATA, getDistrictData),
    yield takeEvery(UPGRADE_DISTRICT_SUBSCRIPTION, upgradeDistrict),
    yield takeEvery(UPGRADE_USER_SUBSCRIPTION, upgradeUserData),
    yield takeEvery(SEARCH_USERS_BY_EMAIL_IDS, searchUsersByEmailIds),
    yield takeEvery(SEARCH_SCHOOLS_BY_ID, searchSchoolsById),
    yield takeEvery(BULK_SCHOOLS_SUBSCRIBE, bulkSchoolsSubscribe),
    yield takeEvery(UPGRADE_PARTIAL_PREMIUM_USER, upgradePartialPremiumUser),
    yield takeEvery(SAVE_ORG_PERMISSIONS, saveOrgPermissionsSaga),
    yield takeEvery(GET_SUBSCRIPTION, getSubscriptionSaga),
    yield takeEvery(
      manageSubscriptionsByLicenses.actions.fetchLicenses,
      fetchLicensesByTypeSaga
    ),
    yield takeEvery(
      manageSubscriptionsByLicenses.actions.deleteLicense,
      deleteLicensesByIdsSaga
    ),
  ])
}

export const sagas = [watcherSaga()]

export default reducer
