import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { contentBucketApi, collectionsApi } from "@edulastic/api";
import { message } from "antd";
import { notification } from "@edulastic/common";
import i18next from "i18next";

const localizationPrefix = "manageDistrict";
const RECEIVE_BUCKETS_REQUEST = "[bucket] receive data request";
const RECEIVE_BUCKETS_SUCCESS = "[bucket] receive data success";
const RECEIVE_BUCKETS_ERROR = "[bucket] receive data error";
const UPDATE_BUCKET_REQUEST = "[bucket] update data request";
const UPDATE_BUCKET_SUCCESS = "[bucket] update data success";
const UPDATE_BUCKET_ERROR = "[bucket] update data error";
const CREATE_BUCKET_REQUEST = "[bucket] create data request";
const CREATE_BUCKET_SUCCESS = "[bucket] create data success";
const CREATE_BUCKET_ERROR = "[bucket] create data error";
const SET_ADD_COLLECTION_MODAL_VISIBILITY = "[bucket] set add to collection modal visible";
const SAVE_ITEMS_TO_BUCKET = "[bucket] save items to selected bucket";

export const receiveBucketsAction = createAction(RECEIVE_BUCKETS_REQUEST);
export const receiveBucketsSuccessAction = createAction(RECEIVE_BUCKETS_SUCCESS);
export const receiveBucketsErrorAction = createAction(RECEIVE_BUCKETS_ERROR);
export const updateBucketAction = createAction(UPDATE_BUCKET_REQUEST);
export const updateBucketSuccessAction = createAction(UPDATE_BUCKET_SUCCESS);
export const updateBucketErrorAction = createAction(UPDATE_BUCKET_ERROR);
export const createBucketAction = createAction(CREATE_BUCKET_REQUEST);
export const createBucketSuccessAction = createAction(CREATE_BUCKET_SUCCESS);
export const createBucketErrorAction = createAction(CREATE_BUCKET_ERROR);
export const setAddCollectionModalVisibleAction = createAction(SET_ADD_COLLECTION_MODAL_VISIBILITY);
export const saveItemsToBucketAction = createAction(SAVE_ITEMS_TO_BUCKET);

// reducers
const initialState = {
  data: [],
  loading: false,
  error: null,
  upserting: false,
  upsertError: null,
  isAddCollectionModalVisible: false
};

export const reducer = createReducer(initialState, {
  [RECEIVE_BUCKETS_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_BUCKETS_SUCCESS]: (state, { payload }) => {
    const bucketData = payload.map(({ _source, ...rest }) => ({
      ...rest,
      ..._source
    }));
    state.loading = false;
    state.data = bucketData;
  },
  [RECEIVE_BUCKETS_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_BUCKET_REQUEST]: state => {
    state.upserting = true;
  },
  [UPDATE_BUCKET_SUCCESS]: (state, { payload }) => {
    const bucketData = state.data.map(bucket => {
      if (bucket._id === payload._id) {
        return { ...bucket, ...payload };
      } else return bucket;
    });

    (state.upserting = false), (state.data = bucketData);
  },
  [UPDATE_BUCKET_ERROR]: (state, { payload }) => {
    state.upserting = false;
    state.updateError = payload.error;
  },
  [CREATE_BUCKET_REQUEST]: state => {
    state.upserting = true;
  },
  [CREATE_BUCKET_SUCCESS]: (state, { payload }) => {
    state.upserting = false;
    state.data = [payload, ...state.data];
  },
  [CREATE_BUCKET_ERROR]: (state, { payload }) => {
    state.upsertError = payload.error;
    state.upserting = false;
  },
  [SET_ADD_COLLECTION_MODAL_VISIBILITY]: (state, { payload }) => {
    state.isAddCollectionModalVisible = payload;
  }
});

// sagas
function* receiveBucketsSaga({ payload }) {
  try {
    const { result: buckets } = yield call(contentBucketApi.fetchBuckets, payload);
    yield put(receiveBucketsSuccessAction(buckets));
  } catch (err) {
    const errorMessage = i18next.t(`${localizationPrefix}:content.buckets.bucketsLoadErrorMsg`);
    yield call(message.error, errorMessage);
    yield put(receiveBucketsErrorAction({ error: errorMessage }));
  }
}

function* updateBucketSaga({ payload }) {
  try {
    const updateBucket = yield call(contentBucketApi.updateBucket, payload);
    notification({ type: "success", msg:i18next.t(`${localizationPrefix}:content.buckets.bucketUpdateSuccessMsg`)});
    yield put(updateBucketSuccessAction(updateBucket));
  } catch (err) {
    const errorMessage = i18next.t(`${localizationPrefix}:content.buckets.bucketUpdateErrorMsg`);
    yield call(message.error, errorMessage);
    yield put(updateBucketErrorAction({ error: errorMessage }));
  }
}

function* createBucketSaga({ payload }) {
  try {
    const createBucket = yield call(contentBucketApi.createBucket, payload);
    notification({ type: "success", msg:i18next.t(`${localizationPrefix}:content.buckets.bucketCreateSuccessMsg`)});
    yield put(createBucketSuccessAction(createBucket));
  } catch (err) {
    const errorMessage = i18next.t(`${localizationPrefix}:content.buckets.bucketCreateErrorMsg`);
    yield call(message.error, errorMessage);
    yield put(createBucketErrorAction({ error: errorMessage }));
  }
}

function* saveItemsToBucketSaga({ payload }) {
  try {
    yield call(collectionsApi.saveItemsToBucket, payload);
    yield put(setAddCollectionModalVisibleAction(false));
    notification({ type: "success", msg:`Selected Items are added to ${payload.collectionName} - ${payload.name}`});
  } catch (e) {
    message.error(e?.message || "Failed to save item to bucket");
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_BUCKETS_REQUEST, receiveBucketsSaga)]);
  yield all([yield takeEvery(UPDATE_BUCKET_REQUEST, updateBucketSaga)]);
  yield all([yield takeEvery(CREATE_BUCKET_REQUEST, createBucketSaga)]);
  yield all([yield takeEvery(SAVE_ITEMS_TO_BUCKET, saveItemsToBucketSaga)]);
}

const stateSelector = state => state.bucketReducer;

export const getIsAddCollectionModalVisibleSelector = createSelector(
  stateSelector,
  state => state.isAddCollectionModalVisible
);
