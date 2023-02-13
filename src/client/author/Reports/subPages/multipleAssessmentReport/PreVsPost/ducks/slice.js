import { createSlice } from 'redux-starter-kit'
import { RESET_ALL_REPORTS } from '../../../../common/reportsRedux'

const initialState = {
  loadingReportSummaryData: false,
  loadingReportTableData: false,
  reportSummaryData: {},
  reportTableData: {},
  error: '',
}

const slice = createSlice({
  name: 'preVsPostReport',
  initialState: { ...initialState },
  reducers: {
    fetchReportSummaryDataRequest: (state) => {
      state.loadingReportSummaryData = true
    },
    fetchReporSummaryDataRequestSuccess: (state, { payload }) => {
      state.loadingReportSummaryData = false
      state.reportSummaryData = payload.reportSummaryData
      state.error = ''
    },
    fetchReportSummaryDataRequestError: (state, { payload }) => {
      state.loadingReportSummaryData = false
      state.error = payload.error
      state.reportSummaryData = {}
    },
    fetchPreVsPostReportTableDataRequest: (state) => {
      state.loadingReportTableData = true
    },
    fetchPreVsPostReportTableDataRequestSuccess: (state, { payload }) => {
      state.loadingReportTableData = false
      state.reportTableData = payload.reportTableData
      state.error = ''
    },
    fetchPreVsPostReportTableDataRequestError: (state, { payload }) => {
      state.loadingReportTableData = false
      state.error = payload.error
      state.reportTableData = {}
    },
    resetPreVsPostReport: () => ({ ...initialState }),
  },
  extraReducers: {
    [RESET_ALL_REPORTS]: () => ({ ...initialState }),
  },
})

export const { actions, reducer } = slice
