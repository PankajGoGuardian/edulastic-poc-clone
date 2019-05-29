import { createSlice, createAction } from "redux-starter-kit";
import { createSelector } from "reselect";
import { combineReducers } from "redux";
import { put, takeEvery, call, all } from "redux-saga/effects";
import { adminApi } from "@edulastic/api";
import { message } from "antd";
import { keyBy } from "lodash";

// ACTIONS
const GET_DISTRICT_DATA = "[admin-upgrade] GET_DISTRICT_DATA";
const UPGRADE_DISTRICT_SUBSCRIPTION = "[admin-upgrade] UPGRADE_DISTRICT_SUBSCRIPTION";
const UPGRADE_USER_SUBSCRIPTION = "[admin-upgrade] UPGRADE_USER_SUBSCRIPTION";
const SEARCH_USERS_BY_EMAIL_IDS = "[admin-upgrade] SEARCH_USERS_BY_EMAIL_IDS";
const SEARCH_SCHOOLS_BY_ID = "[admin-upgrade] SEARCH_SCHOOLS_BY_ID";
const BULK_SCHOOLS_SUBSCRIBE = "[admin-upgrade] BULK_SCHOOLS_SUBSCRIBE";
const UPGRADE_PARTIAL_PREMIUM_USER = "[admin-upgrade] UPGRADE_PARTIAL_PREMIUM_USER";

// ACTION CREATORS
export const getDistrictDataAction = createAction(GET_DISTRICT_DATA);
export const upgradeDistrictSubscriptionAction = createAction(UPGRADE_DISTRICT_SUBSCRIPTION);
export const upgradeUserSubscriptionAction = createAction(UPGRADE_USER_SUBSCRIPTION);
export const searchUsersByEmailIdAction = createAction(SEARCH_USERS_BY_EMAIL_IDS);
export const searchSchoolsByIdAction = createAction(SEARCH_SCHOOLS_BY_ID);
export const bulkSchoolsSubscribeAction = createAction(BULK_SCHOOLS_SUBSCRIBE);
export const upgradePartialPremiumUserAction = createAction(UPGRADE_PARTIAL_PREMIUM_USER);

// SLICE's
export const manageSubscriptionsBydistrict = createSlice({
  slice: "manageSubscriptionsBydistrict", // slice is optional, and could be blank ''
  initialState: {
    loading: false,
    listOfDistricts: [],
    selectedDistrict: {}
  },
  reducers: {
    setLoader: (state, { payload }) => {
      state.loading = payload;
    },
    success: (state, { payload }) => {
      // if only a single district is returned, the returned district becomes the selected District by default
      if (payload.data.length === 1) {
        [state.selectedDistrict] = payload.data;
      } else {
        state.listOfDistricts = payload.data;
      }
    },
    selectDistrict: (state, { payload: index }) => {
      state.selectedDistrict = state.listOfDistricts[index];
      // here the autocomplete dataSource becomes empty so that user is not presented with same data when he types
      state.listOfDistricts = [];
    },
    subscribeSuccess: (state, { payload }) => {
      state.selectedDistrict.subscription = payload.subscription;
    }
  }
});

const manageSubscriptionsByUsers = createSlice({
  slice: "manageSubscriptionsByUsers", // slice is optional, and could be blank ''
  initialState: {
    validEmailIdsList: null,
    subscriptionData: {}
  },
  reducers: {
    success: (state, { payload }) => {
      // here once subscription is completed, the table has to re-render and show the updated values,
      // hence, these updatedSubType key is set.
      payload.forEach((item, index) => {
        const { subscription = {} } = item;
        if (!state.validEmailIdsList[index].subscription) {
          state.validEmailIdsList[index].subscription = {};
        }
        if (item.success) {
          state.validEmailIdsList[index].subscription = subscription;
        }
        state.validEmailIdsList[index].subscription.updatedSubTypeSuccess = item.success;
      });
    },
    searchEmailIdsSuccess: (state, { payload }) => {
      state.validEmailIdsList = payload.data;
    }
  }
});

export const manageSubscriptionsBySchool = createSlice({
  slice: "manageSubscriptionsBySchool", // slice is optional, and could be blank ''
  initialState: {
    searchedSchoolsData: {},
    currentEditableRow: null,
    editableRowFieldValues: {}
  },
  reducers: {
    success: (state, { payload }) => {
      state.searchedSchoolsData = payload;
    },
    bulkSubscriptionSuccess: (state, { payload }) => {
      payload.forEach(item => {
        const { subscription = {} } = item;
        if (item.success) {
          state.searchedSchoolsData[subscription.schoolId].subscription = subscription;
        }
        state.searchedSchoolsData[subscription.schoolId].subscription.updatedSubTypeSuccess = item.success;
      });
    },
    updateCurrentEditableRow: (state, { payload }) => {
      if (payload) {
        const { schoolId, ...rest } = payload;
        state.currentEditableRow = schoolId;
        state.editableRowFieldValues = rest;
      } else {
        state.currentEditableRow = null;
        state.editableRowFieldValues = {};
      }
    },
    setEditableRowFieldValues: (state, { payload: { fieldName, value } }) => {
      state.editableRowFieldValues[fieldName] = value;
    }
  }
});

export const manageSubscriptionsByUserSegments = createSlice({
  slice: "manageSubscriptionsByUserSegments", // slice is optional, and could be blank ''
  initialState: {
    partialPremiumData: {},
    gradeSubject: []
  },
  reducers: {
    setPartialPremiumData: (state, { payload }) => {
      const { subscription: { gradeSubject = [] } = {} } = payload;
      state.partialPremiumData = payload;
      state.gradeSubject = gradeSubject;
    },
    setGradeSubjectValue: (state, { payload: { type, index, value } }) => {
      state.gradeSubject[index][type] = value;
    },
    addGradeSubjectRow: state => {
      state.gradeSubject.push({
        grade: "",
        subject: ""
      });
    },
    deleteGradeSubjectRow: (state, { payload: index }) => {
      state.gradeSubject.splice(index, 1);
    }
  }
});

// SELECTORS
const upGradeStateSelector = state => state.admin.upgradeData;

export const getDistrictDataSelector = createSelector(
  upGradeStateSelector,
  ({ districtSearchData }) => districtSearchData
);

export const getUsersDataSelector = createSelector(
  upGradeStateSelector,
  ({ manageUsers }) => manageUsers
);

export const getManageSubscriptionBySchoolData = createSelector(
  upGradeStateSelector,
  ({ manageSchoolsData }) => manageSchoolsData
);

export const getManageSubscriptionByUserSegmentsData = createSelector(
  upGradeStateSelector,
  ({ manageUserSegmentData }) => manageUserSegmentData
);

// REDUCERS
const reducer = combineReducers({
  districtSearchData: manageSubscriptionsBydistrict.reducer,
  manageUsers: manageSubscriptionsByUsers.reducer,
  manageSchoolsData: manageSubscriptionsBySchool.reducer,
  manageUserSegmentData: manageSubscriptionsByUserSegments.reducer
});

// API's
const {
  searchUpdateDistrict: searchUpdateDistrictApi,
  manageSubscription: manageSubscriptionApi,
  searchUsersByEmailIds: searchUsersByEmailIdsApi,
  searchSchoolsById: searchSchoolsByIdApi
} = adminApi;

// SAGAS
function* getDistrictData({ payload }) {
  try {
    yield put(manageSubscriptionsBydistrict.actions.setLoader(true));
    const item = yield call(searchUpdateDistrictApi, payload);
    yield put(manageSubscriptionsBydistrict.actions.setLoader(false));
    yield put(manageSubscriptionsBydistrict.actions.success(item));
  } catch (err) {
    console.error(err);
  }
}

function* upgradeDistrict({ payload }) {
  try {
    const { result } = yield call(manageSubscriptionApi, payload);
    if (result.success) {
      message.success(result.message);
      yield put(manageSubscriptionsBydistrict.actions.subscribeSuccess(result.subscriptionResult[0]));
    }
  } catch (err) {
    console.error(err);
  }
}

function* upgradeUserData({ payload }) {
  try {
    const { result } = yield call(manageSubscriptionApi, payload);
    if (result.success) {
      message.success(result.message);
      yield put(manageSubscriptionsByUsers.actions.success(result.subscriptionResult));
    } else {
      message.error(result.message);
    }
  } catch (err) {
    console.error(err);
  }
}

function* searchUsersByEmailIds({ payload }) {
  try {
    const item = yield call(searchUsersByEmailIdsApi, payload);
    if (item.result) {
      if (!item.result.data.length) {
        message.error("No Records Found");
      }
      yield put(manageSubscriptionsByUsers.actions.searchEmailIdsSuccess(item.result));
    }
  } catch (err) {
    console.error(err);
  }
}

function* searchSchoolsById({ payload }) {
  try {
    const item = yield call(searchSchoolsByIdApi, payload);
    if (item.result) {
      const hashedResult = keyBy(item.result, "schoolId");
      yield put(manageSubscriptionsBySchool.actions.success(hashedResult));
    }
  } catch (err) {
    console.error(err);
  }
}

function* bulkSchoolsSubscribe({ payload }) {
  try {
    const { result } = yield call(manageSubscriptionApi, payload);
    if (result.success) {
      message.success(result.message);
      yield put(manageSubscriptionsBySchool.actions.bulkSubscriptionSuccess(result.subscriptionResult));
      yield put(manageSubscriptionsBySchool.actions.updateCurrentEditableRow());
    } else {
      message.error(result.message);
    }
  } catch (err) {
    console.error(err);
  }
}

function* upgradePartialPremiumUser({ payload }) {
  try {
    const { result } = yield call(manageSubscriptionApi, payload);
    if (result.success) {
      message.success(result.message);
    } else {
      message.error(result.message);
    }
  } catch (err) {
    console.error(err);
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
    yield takeEvery(UPGRADE_PARTIAL_PREMIUM_USER, upgradePartialPremiumUser)
  ]);
}

export const sagas = [watcherSaga()];

export default reducer;
