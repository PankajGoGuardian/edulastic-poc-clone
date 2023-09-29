import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { takeEvery, put, all, call, takeLatest } from 'redux-saga/effects'
import { notification } from '@edulastic/common'
import { customReportQueryBuilderApi } from '@edulastic/api'
import { formatQueryData } from './util'

const GET_DASHBOARD_ITEMS = '[custom reports] get custom reports item'
const SET_DASHBOARD_ITEMS = '[custom reports] set custom reports item'
const GET_CHART_DATA = '[custom reports] get chart data'
const SET_CHART_DATA = '[custom reports] set chart data'
const ADD_DASHBOARD_ITEM = '[custom reports] add custom reports item'
const DELETE_DASHBOARD_ITEM = '[custom reports] delete custom reports item'
const UPDATE_DASHBOARD_ITEM = '[custom reports] update custom reports item'
const GET_META_DATA = '[custom reports] get meta data'
const SET_META_DATA = '[custom reports] set meta data'
const SET_ITEM_DATA = '[custom reports] set query data'
const GET_ITEM_DATA = '[custom reports] get item data'
const GET_DATA_SOURCE = '[custom reports] get data source'
const SET_DATA_SOURCE = '[custom reports] set data source'

export const getDashboardItemsAction = createAction(GET_DASHBOARD_ITEMS)
export const setDashboardItemAction = createAction(SET_DASHBOARD_ITEMS)
export const getChartDataAction = createAction(GET_CHART_DATA)
export const setChartDataAction = createAction(SET_CHART_DATA)
export const addDashboardItemAction = createAction(ADD_DASHBOARD_ITEM)
export const deleteDashboardItemAction = createAction(DELETE_DASHBOARD_ITEM)
export const updateDashboardItemAction = createAction(UPDATE_DASHBOARD_ITEM)
export const getMetaDataAction = createAction(GET_META_DATA)
export const setMetaDataAction = createAction(SET_META_DATA)
export const setItemDataAction = createAction(SET_ITEM_DATA)
export const getItemDataAction = createAction(GET_ITEM_DATA)
export const getDataSourceAction = createAction(GET_DATA_SOURCE)
export const setDataSourceAction = createAction(SET_DATA_SOURCE)

// selectors
const dashboardPageSelector = (state) => state.customReportsReducer
export const isLoadingSelector = createSelector(
  dashboardPageSelector,
  (state) => state.loading
)
export const getDashboardItemsSelector = createSelector(
  dashboardPageSelector,
  (state) => state.items
)
export const getDashboardItemSelector = createSelector(
  dashboardPageSelector,
  (state, props) => state.items[props.itemId]
)
export const getMetaDataSelector = createSelector(
  dashboardPageSelector,
  (state) => state.meta
)
export const getIsMetaDataLoadingSelector = createSelector(
  dashboardPageSelector,
  (state) => state.isMetaDataLoading
)
export const getChartDataSelector = (state, props = {}) => {
  const { itemId = 'draft' } = props
  const dashboardPage = dashboardPageSelector(state)
  return dashboardPage?.chartData?.[itemId]
}
export const getIsItemDataLoadingSelector = createSelector(
  dashboardPageSelector,
  (state) => state.isItemDataLoading
)
export const getItemDataSelector = createSelector(
  dashboardPageSelector,
  (state) => state.itemData
)
export const getDataSourceSelector = createSelector(
  dashboardPageSelector,
  (state) => state.dataSource
)
export const getIsChartDataLoadingSelector = createSelector(
  dashboardPageSelector,
  (state) => state.isChartDataLoading
)

// reducers
const initialState = {
  dataSource: [],
  items: [],
  loading: false,
  meta: {},
  isMetaDataLoading: false,
  chartData: {},
  isItemDataLoading: false,
  itemData: {},
  isChartDataLoading: false,
}

export const reducer = createReducer(initialState, {
  [GET_DASHBOARD_ITEMS]: (state) => {
    state.loading = true
    return state
  },
  [SET_DASHBOARD_ITEMS]: (state, { payload }) => {
    state.items = payload
    state.loading = false
    return state
  },
  [GET_CHART_DATA]: (state) => {
    state.isChartDataLoading = true
    return state
  },
  [SET_CHART_DATA]: (state, { payload }) => {
    state.isChartDataLoading = false
    state.chartData = { ...state.chartData, ...payload }
    return state
  },
  [GET_META_DATA]: (state) => {
    state.isMetaDataLoading = true
    return state
  },
  [SET_META_DATA]: (state, { payload }) => {
    state.isMetaDataLoading = false
    state.meta = payload
    return state
  },
  [SET_ITEM_DATA]: (state, { payload }) => {
    state.itemDataLoading = false
    state.itemData = payload
    return state
  },
  [GET_ITEM_DATA]: (state) => {
    state.isItemDataLoading = true
    return state
  },
  [SET_DATA_SOURCE]: (state, { payload }) => {
    state.dataSource = payload
    return state
  },
})

// sagas
function* getDashboardItemSaga() {
  try {
    const result = yield call(customReportQueryBuilderApi.getAllItems)
    yield put(setDashboardItemAction(result))
  } catch (err) {
    const errorMessage = 'Unable to retrieve Dashboard Item info.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* getChartDataSaga({ payload }) {
  try {
    const { itemId = 'draft', query: _query } = payload
    const query = itemId === 'draft' ? formatQueryData(_query) : _query
    const chartData = yield call(customReportQueryBuilderApi.loadChartData, {
      query,
    })
    yield put(setChartDataAction({ [itemId]: chartData }))
  } catch (err) {
    const errorMessage = 'Unable to retrieve Chart Data info.'
    // notification({ type: 'error', msg: errorMessage })
  }
}

function* updateDashboardItemSaga({ payload }) {
  try {
    yield call(customReportQueryBuilderApi.updateItem, payload)
    yield put(getDashboardItemsAction())
  } catch (err) {
    const errorMessage = 'Unable to Update Dashboard Item.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* addDashboardItemSaga({ payload }) {
  try {
    yield call(customReportQueryBuilderApi.addItem, payload)
  } catch (err) {
    const errorMessage = 'Unable to Add Dashboard Item.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* deleteDashboardItemSaga({ payload }) {
  try {
    yield call(customReportQueryBuilderApi.deleteItemById, payload)
    yield put(getDashboardItemsAction())
  } catch (err) {
    const errorMessage = 'Unable to Delete Dashboard Item.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* getMetaDataSaga() {
  try {
    const result = yield call(customReportQueryBuilderApi.getMetaData)
    yield put(setMetaDataAction(result?.schemas || []))
  } catch (err) {
    const errorMessage = 'Unable to retrive Meta data.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* getItemDataSaga({ payload = {} }) {
  try {
    const { itemId } = payload
    const itemData = yield call(customReportQueryBuilderApi.getItemById, {
      itemId,
    })
    yield put(setItemDataAction(itemData))
  } catch (err) {
    const errorMessage = 'Unable to retrive Item data.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* getDataSourceSaga() {
  try {
    const dataSource = yield call(customReportQueryBuilderApi.getDataSource)
    yield put(setDataSourceAction(dataSource))
  } catch (err) {
    const errorMessage = 'Unable to retrive list of data sources.'
    notification({ type: 'error', msg: errorMessage })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(GET_DASHBOARD_ITEMS, getDashboardItemSaga),
    yield takeLatest(GET_CHART_DATA, getChartDataSaga),
    yield takeLatest(ADD_DASHBOARD_ITEM, addDashboardItemSaga),
    yield takeLatest(DELETE_DASHBOARD_ITEM, deleteDashboardItemSaga),
    yield takeLatest(UPDATE_DASHBOARD_ITEM, updateDashboardItemSaga),
    yield takeLatest(GET_META_DATA, getMetaDataSaga),
    yield takeLatest(GET_DATA_SOURCE, getDataSourceSaga),
    yield takeLatest(GET_ITEM_DATA, getItemDataSaga),
  ])
}
