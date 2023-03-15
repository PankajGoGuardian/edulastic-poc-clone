import React, { useEffect, useMemo } from 'react'
import qs from 'qs'
import { connect } from 'react-redux'
import { isEmpty, get, mapValues, head, includes, filter } from 'lodash'
import next from 'immer'
import { Spin } from 'antd'

import { SpinLoader } from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import { reportGroupType } from '@edulastic/constants/const/report'

import { SubHeader } from '../../../common/components/Header'
import { NoDataContainer, ReportContainer } from '../../../common/styled'
import ShareReportModal from '../../../common/components/Popups/ShareReportModal'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import MultipleAssessmentReportFilters from './components/Filters'
import Chart from './components/Chart'
import Table from './components/Table'
import TableFilters from './components/TableFilters'

import { resetAllReportsAction } from '../../../common/reportsRedux'
import {
  fetchUpdateTagsDataAction,
  getCsvDownloadingState,
  getSharingState,
  setSharingStateAction,
} from '../../../ducks'
import { getSharedReportList } from '../../../components/sharedReports/ducks'
import {
  getUserRole,
  getOrgDataSelector,
  getCurrentTerm,
} from '../../../../src/selectors/user'
import { actions, selectors } from './ducks'

import navigation from '../../../common/static/json/navigation.json'
import { getCompareByOptions, getChartData, getTableData } from './utils'

const { downloadCSV } = reportUtils.common

const onCsvConvert = (data) =>
  downloadCSV(`Data Warehouse - Multiple Assessment Report.csv`, data)

const MultipleAssessmentReport = ({
  // value props
  loc,
  location,
  history,
  sharingState,
  sharedReportList,
  isCsvDownloading,
  userRole: _userRole,
  orgData,
  defaultTermId,
  showApply,
  breadcrumbData,
  isCliUser,
  isPrinting,
  updateNavigation,
  // value props (from report selectors)
  firstLoad,
  showFilter,
  loadingFiltersData,
  prevFiltersData,
  filtersData,
  filtersTabKey,
  filters,
  filterTagsData,
  // selectedPerformanceBandProfileId,
  // selectedPerformanceBand,
  loadingReportChartData,
  loadingReportTableData,
  settings,
  reportChartData,
  reportTableData,
  error,
  // action props
  onRefineResultsCB,
  resetAllReports,
  setSharingState,
  // action props (from report actions)
  setDWMARFirstLoad,
  fetchDWMARFiltersDataRequest,
  setDWMARFiltersTabKey,
  setDWMARFilters,
  setDWMARFilterTagsData,
  setDWMARPrevFiltersData,
  resetDWMARFiltersData,
  setDWMARSettings,
  fetchDWMARChartDataRequest,
  fetchDWMARTableDataRequest,
  fetchUpdateTagsData,
  selectedTests,
  setSelectedTests,
}) => {
  const reportId = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }).reportId,
    []
  )
  const sharedReport = useMemo(
    () => sharedReportList.find((s) => s._id === reportId),
    [reportId, sharedReportList]
  )
  const [userRole, sharedReportFilters, isSharedReport] = useMemo(
    () => [
      sharedReport?.sharedBy?.role || _userRole,
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
      !!sharedReport?._id,
    ],
    [sharedReport]
  )
  const compareByOptions = useMemo(() => [...getCompareByOptions(userRole)], [
    userRole,
  ])

  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }
  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const onGoClick = (_settings) => {
    const _requestFilters = {}
    Object.keys(_settings.requestFilters).forEach((filterType) => {
      _requestFilters[filterType] =
        _settings.requestFilters[filterType] === 'All' ||
        _settings.requestFilters[filterType] === 'all'
          ? ''
          : _settings.requestFilters[filterType]
    })
    setDWMARSettings({
      ...settings,
      requestFilters: {
        ..._requestFilters,
        classIds: _requestFilters.classIds || '',
        groupIds: _requestFilters.groupIds || '',
        testIds: _requestFilters.testIds || '',
      },
      selectedFilterTagsData: _settings.selectedFilterTagsData,
      selectedCompareBy: settings.selectedCompareBy?.key
        ? settings.selectedCompareBy
        : head(compareByOptions),
    })
    setShowApply(false)
  }

  const updateFilterDropdownCB = (selected, keyName) => {
    if (keyName === 'compareBy') {
      setDWMARSettings({ ...settings, selectedCompareBy: selected })
    }
  }

  const computeChartNavigationLinks = () => {
    const { requestFilters } = settings
    if (navigation.locToData[loc]) {
      const arr = Object.keys(requestFilters)
      const obj = {}
      arr.forEach((item) => {
        const val = requestFilters[item] === '' ? 'All' : requestFilters[item]
        obj[item] = val
      })
      const _navigationItems = navigation.navigation[
        navigation.locToData[loc].group
      ].filter((item) => {
        // if data warehouse report is shared, only that report tab should be shown
        return !reportId || item.key === loc
      })
      return next(_navigationItems, (draft) => {
        const _currentItem = draft.find((t) => t.key === loc)
        _currentItem.location += `?${qs.stringify(obj)}`
      })
    }
    return []
  }

  useEffect(
    () => () => {
      console.log('Multiple Assessment Report Component Unmount')
      resetAllReports()
    },
    []
  )

  useEffect(() => {
    if (settings.requestFilters.termId) {
      const obj = {}
      const arr = Object.keys(settings.requestFilters)
      arr.forEach((item) => {
        const val =
          settings.requestFilters[item] === ''
            ? 'All'
            : settings.requestFilters[item]
        obj[item] = val
      })
      obj.reportId = reportId || ''
      const path = `?${qs.stringify(obj)}`
      history.push(path)
    }
    const navigationItems = computeChartNavigationLinks()
    updateNavigation(navigationItems)
  }, [settings])

  // get report data
  useEffect(() => {
    const q = { ...settings.requestFilters }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      fetchDWMARChartDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      compareBy: settings.selectedCompareBy.key,
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      fetchDWMARTableDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters, settings.selectedCompareBy.key])

  useEffect(() => {
    const { internalMetricsForTable = [], externalMetricsForTable = [] } = get(
      reportTableData,
      'data.result',
      {}
    )
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loadingReportTableData &&
      !isEmpty(reportTableData) &&
      !(internalMetricsForTable.length || externalMetricsForTable.length)
    ) {
      toggleFilter(null, true)
    }
  }, [reportTableData])

  const {
    incompleteTests,
    selectedPerformanceBand,
    chartData,
  } = useMemo(() => {
    // performance band for chart should update post chart data API response
    const { bandInfo = [] } = get(filtersData, 'data.result', {})
    const _selectedPerformanceBand = (
      bandInfo.find(
        (x) =>
          x._id === (sharedReportFilters || settings.requestFilters).profileId
      ) || bandInfo[0]
    )?.performanceBand
    // curate chart data from API response
    const {
      internalMetricsForChart = [],
      externalMetricsForChart = [],
      incompleteTests: _incompleteTests = [],
      externalBands = [],
    } = get(reportChartData, 'data.result', {})
    const _internalMetricsForChart = internalMetricsForChart.map((d) => ({
      ...d,
      isIncomplete: _incompleteTests.includes(d.testId),
    }))
    const _chartData = getChartData(
      _internalMetricsForChart,
      externalMetricsForChart,
      _selectedPerformanceBand,
      externalBands
    )
    return {
      incompleteTests: _incompleteTests,
      selectedPerformanceBand: _selectedPerformanceBand,
      chartData: _chartData,
    }
  }, [reportChartData])

  const tableData = useMemo(() => {
    const {
      internalMetricsForTable = [],
      externalMetricsForTable = [],
      metaInfo = [],
    } = get(reportTableData, 'data.result', {})
    const { externalBands = [] } = get(reportChartData, 'data.result', {})
    if (isEmpty(externalBands) && !isEmpty(externalMetricsForTable)) return []

    const _internalMetricsForTable = internalMetricsForTable.map((d) => ({
      ...d,
      isIncomplete: incompleteTests.includes(d.testId),
    }))
    return getTableData(
      _internalMetricsForTable,
      externalMetricsForTable,
      metaInfo,
      selectedPerformanceBand,
      externalBands,
      settings.selectedCompareBy.key
    )
  }, [
    reportChartData,
    reportTableData,
    incompleteTests,
    selectedPerformanceBand,
  ])

  const filteredOverallAssessmentsData = filter(chartData, (test) =>
    selectedTests.length ? includes(selectedTests, test.uniqId) : true
  )

  return (
    <>
      {sharingState && (
        <ShareReportModal
          reportType={loc}
          reportFilters={{
            ...settings.requestFilters,
          }}
          showModal={sharingState}
          setShowModal={setSharingState}
        />
      )}
      <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser}>
        <MultipleAssessmentReportFilters
          reportId={reportId}
          isPrinting={isPrinting}
          onGoClick={onGoClick}
          history={history}
          location={location}
          showApply={showApply}
          firstLoad={firstLoad}
          userRole={userRole}
          orgData={orgData}
          defaultTermId={defaultTermId}
          // value props (from report selectors)
          loadingFiltersData={loadingFiltersData}
          prevFiltersData={prevFiltersData}
          filtersData={filtersData}
          filtersTabKey={filtersTabKey}
          filters={filters}
          filterTagsData={filterTagsData}
          selectedFilterTagsData={settings.selectedFilterTagsData}
          // action props (others)
          setShowApply={setShowApply}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
          // action props (from report actions)
          setFirstLoad={setDWMARFirstLoad}
          fetchFiltersDataRequest={fetchDWMARFiltersDataRequest}
          setFiltersTabKey={setDWMARFiltersTabKey}
          setFilters={setDWMARFilters}
          setFilterTagsData={setDWMARFilterTagsData}
          setPrevFiltersData={setDWMARPrevFiltersData}
          resetFiltersData={resetDWMARFiltersData}
          fetchUpdateTagsData={fetchUpdateTagsData}
        />
      </SubHeader>
      <ReportContainer>
        {firstLoad && <Spin size="large" />}
        {loadingReportChartData || loadingReportTableData ? (
          <SpinLoader
            tip="Please wait while we gather the required information..."
            position="fixed"
          />
        ) : error && error.dataSizeExceeded ? (
          <DataSizeExceeded />
        ) : isEmpty(chartData) ? (
          <NoDataContainer>
            {settings.requestFilters?.termId
              ? 'No data available currently.'
              : ''}
          </NoDataContainer>
        ) : (
          <>
            <Chart
              chartData={chartData}
              selectedPerformanceBand={selectedPerformanceBand}
              selectedTests={selectedTests}
              setSelectedTests={setSelectedTests}
            />
            <TableFilters
              updateFilterDropdownCB={updateFilterDropdownCB}
              compareByOptions={compareByOptions}
              selectedCompareBy={
                settings.selectedCompareBy || head(compareByOptions)
              }
            />
            <Table
              tableData={tableData}
              overallAssessmentsData={filteredOverallAssessmentsData}
              showIncompleteTestsMessage={!!incompleteTests.length}
              settings={settings}
              isSharedReport={isSharedReport}
              onCsvConvert={onCsvConvert}
              isCsvDownloading={isCsvDownloading}
              isPrinting={isPrinting}
            />
          </>
        )}
      </ReportContainer>
    </>
  )
}

const enhance = connect(
  (state) => ({
    ...mapValues(selectors, (selector) => selector(state)),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
    isCsvDownloading: getCsvDownloadingState(state),
    userRole: getUserRole(state),
    orgData: getOrgDataSelector(state),
    defaultTermId: getCurrentTerm(state),
  }),
  {
    ...actions,
    resetAllReports: resetAllReportsAction,
    setSharingState: setSharingStateAction,
    fetchUpdateTagsData: (opts) =>
      fetchUpdateTagsDataAction({
        type: reportGroupType.MULTIPLE_ASSESSMENT_REPORT_DW,
        ...opts,
      }),
  }
)

export default enhance(MultipleAssessmentReport)
