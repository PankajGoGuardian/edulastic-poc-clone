import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { reportGroupType } from '@edulastic/constants/const/report'
import { head, mapValues, isEmpty } from 'lodash'
import qs from 'qs'
import { EduIf, SpinLoader } from '@edulastic/common'

import { SubHeader } from '../../../common/components/Header'
import SectionLabel from '../../../common/components/SectionLabel'

import {
  MasonGrid,
  DashboardReportContainer,
} from './components/common/styledComponents'
import DashboardTable from './components/Table'
import AcademicSummary from './components/widgets/AcademicSummary'
import AttendanceSummary from './components/widgets/AttendanceSummary'
import DashboardTableFilters from './components/TableFilters'

import {
  getCurrentTerm,
  getOrgDataSelector,
  getUserRole,
} from '../../../../src/selectors/user'

import {
  masteryScales,
  attendanceSummaryData,
  academicSummaryData,
  compareByOptions as compareByOptionsRaw,
  academicSummaryFiltersTypes,
  availableTestTypes,
  getTableApiQuery,
} from './utils'
import {
  fetchUpdateTagsDataAction,
  getCsvDownloadingState,
  getSharingState,
  setSharingStateAction,
} from '../../../ducks'
import { getSharedReportList } from '../../../components/sharedReports/ducks'
import { resetAllReportsAction } from '../../../common/reportsRedux'
import Filters from './components/Filters/Filters'
import { actions, selectors } from './ducks'
import useTabNavigation from './hooks/useTabNavigation'

import useTableFilters from './hooks/useTableFilters'

const Dashboard = ({
  loc,
  history,
  location,
  isPrinting,
  userRole,
  breadcrumbData,
  isCliUser,
  isCsvDownloading,
  settings,
  setSettings,

  showApply,
  onRefineResultsCB,
  showFilter,

  resetAllReports,

  updateNavigation,
  // report selectors
  loadingAcademicSummaryData,
  loadingAttendanceSummaryData,
  loadingTableData,
  // academicSummaryData,
  // attendanceSummaryData,
  tableData,
  // academicSummaryRequestError,
  // attendanceSummaryRequestError,
  tableDataRequestError,
  // report actions
  // fetchAcademicSummaryDataRequest,
  // fetchAttendanceSummaryDataRequest,
  fetchDashboardTableDataRequest,
  // resetDashboardReport,
}) => {
  const reportId = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }).reportId,
    []
  )
  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }
  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const compareByOptions = compareByOptionsRaw.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )
  const onGoClick = (_settings) => {
    const _requestFilters = {}
    Object.keys(_settings.requestFilters).forEach((filterType) => {
      _requestFilters[filterType] =
        _settings.requestFilters[filterType] === 'All' ||
        _settings.requestFilters[filterType] === 'all'
          ? ''
          : _settings.requestFilters[filterType]
    })
    setSettings({
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
      setSettings({ ...settings, selectedCompareBy: selected })
    }
  }

  useEffect(
    () => () => {
      console.log('Multiple Assessment Report Component Unmount')
      resetAllReports()
    },
    []
  )

  useTabNavigation(settings, reportId, history, loc, updateNavigation)

  const performanceBandList = useMemo(
    () => masteryScales.map((p) => ({ key: p._id, title: p.name })),
    [masteryScales]
  )

  const {
    tableFilters,
    setTableFilters,
    updateTableFiltersCB,
    // setTablePagination,
  } = useTableFilters(compareByOptions[0])

  const [academicSummaryFilters, setAcademicSummaryFilters] = useState({
    [academicSummaryFiltersTypes.PERFORMANCE_BAND]: performanceBandList[0],
    [academicSummaryFiltersTypes.TEST_TYPE]: availableTestTypes[0],
  })

  const selectedPerformanceBand = (
    masteryScales.filter(
      (x) =>
        x._id ===
        academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND].key
    )[0] || masteryScales[0]
  )?.performanceBand

  // get table data
  useEffect(() => {
    const q = getTableApiQuery(settings, tableFilters)
    if (q.termId || q.reportId) {
      fetchDashboardTableDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters, tableFilters])

  const showSpinLoader = [
    loadingAcademicSummaryData,
    loadingAttendanceSummaryData,
    loadingTableData,
  ].every((v) => v)

  return (
    <DashboardReportContainer>
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      >
        <Filters
          reportId={reportId}
          isPrinting={isPrinting}
          onGoClick={onGoClick}
          history={history}
          location={location}
          showApply={showApply}
          setShowApply={setShowApply}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
        />
      </SubHeader>
      <EduIf condition={showSpinLoader}>
        <SpinLoader
          tip="Please wait while we gather the required information..."
          position="fixed"
        />
      </EduIf>
      <EduIf condition={!showSpinLoader}>
        <SectionLabel>Overview</SectionLabel>
        <MasonGrid>
          <EduIf condition={!isEmpty(academicSummaryData)}>
            <AcademicSummary
              academicSummaryData={academicSummaryData}
              selectedPerformanceBand={selectedPerformanceBand}
              performanceBandList={performanceBandList}
              availableTestTypes={availableTestTypes}
              filters={academicSummaryFilters}
              setFilters={setAcademicSummaryFilters}
              loadingAcademicSummaryData={loadingAcademicSummaryData}
            />
          </EduIf>
          <EduIf condition={!isEmpty(attendanceSummaryData)}>
            <AttendanceSummary
              attendanceSummaryData={attendanceSummaryData}
              loadingAttendanceSummaryData={loadingAttendanceSummaryData}
            />
          </EduIf>
        </MasonGrid>
        <DashboardTableFilters
          tableFilters={tableFilters}
          updateTableFiltersCB={updateTableFiltersCB}
          compareByOptions={compareByOptions}
        />
        <DashboardTable
          tableFilters={tableFilters}
          setTableFilters={setTableFilters}
          updateTableFiltersCB={updateTableFiltersCB}
          tableData={tableData}
          selectedPerformanceBand={selectedPerformanceBand}
          loadingTableData={loadingTableData}
          tableDataRequestError={tableDataRequestError}
          isCsvDownloading={isCsvDownloading}
        />
      </EduIf>
    </DashboardReportContainer>
  )
}

export default connect(
  (state) => ({
    ...mapValues(selectors, (selector) => selector(state)),
    userRole: getUserRole(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
    isCsvDownloading: getCsvDownloadingState(state),
    orgData: getOrgDataSelector(state),
    defaultTermId: getCurrentTerm(state),
  }),
  {
    ...actions,
    resetAllReports: resetAllReportsAction,
    setSharingState: setSharingStateAction,
    fetchUpdateTagsData: (opts) =>
      fetchUpdateTagsDataAction({
        type: reportGroupType.DW_DASHBOARD_REPORT,
        ...opts,
      }),
  }
)(Dashboard)
