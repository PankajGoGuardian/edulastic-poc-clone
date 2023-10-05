import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { put, all, call, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { notification } from '@edulastic/common'
import { reportBuilderApi } from '@edulastic/api'
import { formatQueryData } from './util'

const GET_REPORT_DEFINITIONS = '[report builder] get report definitions'
const DELETE_REPORT_DEFINITION = '[report builder] delete report definition'
const GET_REPORT_DEFINITIONS_SUCCESS =
  '[report builder] get report definitions success'
const GET_REPORT_DEFINITIONS_FAILED =
  '[report builder] get report definitions failed'
const GET_REPORT_DATA = '[report builder] get report data'
const SET_REPORT_DATA = '[report builder] set report data'
const GET_CHART_DATA = '[report builder] get chart data'
const SET_CHART_DATA = '[report builder] set chart data'
const ADD_REPORT_DEFINITION = '[report builder] add report definition'
const UPDATE_REPORT_DEFINITION = '[report builder] update report definition'
const GET_META_DATA = '[report builder] get meta data'
const SET_META_DATA = '[report builder] set meta data'
const GET_DATA_SOURCE = '[report builder] get data source'
const SET_DATA_SOURCE = '[report builder] set data source'

export const getReportDefinitionsAction = createAction(GET_REPORT_DEFINITIONS)
export const deleteReportDefinitionAction = createAction(
  DELETE_REPORT_DEFINITION
)
export const getReportDefinitionsSuccessAction = createAction(
  GET_REPORT_DEFINITIONS_SUCCESS
)
export const getReportDefinitionsFailedAction = createAction(
  GET_REPORT_DEFINITIONS_FAILED
)
export const getReportDataAction = createAction(GET_REPORT_DATA)
export const setReportDataAction = createAction(SET_REPORT_DATA)
export const getChartDataAction = createAction(GET_CHART_DATA)
export const setChartDataAction = createAction(SET_CHART_DATA)
export const addReportDefinitionAction = createAction(ADD_REPORT_DEFINITION)
export const updateReportDefinitionAction = createAction(
  UPDATE_REPORT_DEFINITION
)
export const getMetaDataAction = createAction(GET_META_DATA)
export const setMetaDataAction = createAction(SET_META_DATA)
export const getDataSourceAction = createAction(GET_DATA_SOURCE)
export const setDataSourceAction = createAction(SET_DATA_SOURCE)

// selectors
const reportBuiderSelector = (state) => state.reportBuilderReducer
export const isReportsLoadingSelector = createSelector(
  reportBuiderSelector,
  (state) => state.isReportsLoading
)
export const getReportsSelector = createSelector(
  reportBuiderSelector,
  (state) => state.reports
)
export const isReportDefinitionLoadingSelector = createSelector(
  reportBuiderSelector,
  (state) => state.isReportDefinitionLoading
)
export const getActiveReportSelector = createSelector(
  reportBuiderSelector,
  (state) => state.report
)
export const getMetaDataSelector = createSelector(
  reportBuiderSelector,
  (state) => state.meta
)
export const getIsMetaDataLoadingSelector = createSelector(
  reportBuiderSelector,
  (state) => state.isMetaDataLoading
)
export const getChartDataSelector = (state, props = {}) => {
  const { widgetId = 'draft' } = props
  const reportBuider = reportBuiderSelector(state)
  return reportBuider?.chartData?.[widgetId]
}
export const getIsWidgetDataLoadingSelector = createSelector(
  reportBuiderSelector,
  (state) => state.isWidgetDataLoading
)
export const getWidgetDataSelector = createSelector(
  reportBuiderSelector,
  (state) => state.widgetData
)
export const getDataSourceSelector = createSelector(
  reportBuiderSelector,
  (state) => state.dataSource
)
export const getIsChartDataLoadingSelector = createSelector(
  reportBuiderSelector,
  (state) => state.isChartDataLoading
)

// reducers
const initialState = {
  isReportsLoading: false,
  reports: [],
  dataSource: [],
  report: {},
  isReportDefinitionLoading: false,
  meta: {},
  isMetaDataLoading: false,
  chartData: {},
  isWidgetDataLoading: false,
  widgetData: {},
  isChartDataLoading: false,
}

export const reducer = createReducer(initialState, {
  [GET_REPORT_DEFINITIONS]: (state) => {
    state.isReportsLoading = true
    return state
  },
  [GET_REPORT_DEFINITIONS_SUCCESS]: (state, { payload }) => {
    state.reports = payload
    state.isReportsLoading = false
    return state
  },
  [GET_REPORT_DEFINITIONS_FAILED]: (state) => {
    state.isReportsLoading = false
    // set error message here
    return state
  },
  [GET_REPORT_DATA]: (state) => {
    state.isReportDefinitionLoading = true
    return state
  },
  [SET_REPORT_DATA]: (state, { payload }) => {
    state.report = payload
    state.isReportDefinitionLoading = false
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
  [SET_DATA_SOURCE]: (state, { payload }) => {
    state.dataSource = payload
    return state
  },
})

// sagas
function* getReportDefinitionsSaga() {
  try {
    const reportDefinitions = yield call(reportBuilderApi.getReportDefinitions)
    yield put(getReportDefinitionsSuccessAction(reportDefinitions))
  } catch (err) {
    yield put(getReportDefinitionsFailedAction(err))
    const errorMessage = 'Unable to retrieve report definitions info.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* deleteReportDefinitionSaga({ payload }) {
  try {
    const reportDefinitions = yield call(reportBuilderApi.deleteReport, payload)
    yield put(getReportDefinitionsSuccessAction(reportDefinitions))
  } catch (err) {
    yield put(getReportDefinitionsFailedAction(err))
    const errorMessage = 'Unable to retrieve report definitions info.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* getReportDataSaga({ payload }) {
  try {
    const result = yield call(reportBuilderApi.getReportDefinitionById, payload)
    yield put(setReportDataAction(result))
  } catch (err) {
    const errorMessage = 'Unable to retrieve Report Data.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* getChartDataSaga({ payload }) {
  try {
    const { widgetId = 'draft', query: _query } = payload
    const query = widgetId === 'draft' ? formatQueryData(_query) : _query
    const chartData = yield call(reportBuilderApi.loadChartData, {
      query,
    })
    yield put(setChartDataAction({ [widgetId]: chartData }))
  } catch (err) {
    const errorMessage = 'Unable to retrieve Chart Data info.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* updateReportSaga({ payload }) {
  try {
    const { isReportDefinitionPage = false, updateDoc, definitionId } = payload
    const updatedReport = yield call(reportBuilderApi.updateReport, {
      updateDoc,
      definitionId,
    })
    if (isReportDefinitionPage) {
      yield put(setReportDataAction(updatedReport))
    } else {
      notification({ msg: 'Successfully updated the Widget' })
      return yield put(
        push(`/author/reportBuilder?reportDefinitionId=${updatedReport._id}`)
      )
    }
  } catch (err) {
    const errorMessage = 'Unable to Update Widget.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* addReportDefinitionSaga({ payload }) {
  try {
    const addedReport = yield call(
      reportBuilderApi.addReportDefinition,
      payload
    )
    notification({ msg: 'Successfully created report with widgets' })
    return yield put(
      push(`/author/reportBuilder/definition/${addedReport._id}`)
    )
  } catch (err) {
    const errorMessage = 'Unable to create report with following widget.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* getMetaDataSaga() {
  try {
    const result = yield call(reportBuilderApi.getMetaData)
    yield put(setMetaDataAction(result?.sources || []))
  } catch (err) {
    const errorMessage = 'Unable to retrive Meta data.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* getDataSourceSaga() {
  try {
    const dataSource = yield call(reportBuilderApi.getDataSource)
    yield put(setDataSourceAction(dataSource))
  } catch (err) {
    const errorMessage = 'Unable to retrive data sources.'
    notification({ type: 'error', msg: errorMessage })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(GET_REPORT_DEFINITIONS, getReportDefinitionsSaga),
    yield takeLatest(DELETE_REPORT_DEFINITION, deleteReportDefinitionSaga),
    yield takeLatest(GET_REPORT_DATA, getReportDataSaga),
    yield takeLatest(GET_CHART_DATA, getChartDataSaga),
    yield takeLatest(ADD_REPORT_DEFINITION, addReportDefinitionSaga),
    yield takeLatest(UPDATE_REPORT_DEFINITION, updateReportSaga),
    yield takeLatest(GET_META_DATA, getMetaDataSaga),
    yield takeLatest(GET_DATA_SOURCE, getDataSourceSaga),
  ])
}
