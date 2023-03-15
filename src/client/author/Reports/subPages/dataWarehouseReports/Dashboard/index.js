import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { reportGroupType } from '@edulastic/constants/const/report'
import { head, mapValues } from 'lodash'
import qs from 'qs'
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
  tableData,
  compareByOptions as compareByOptionsRaw,
  tableFilterTypes,
  academicSummaryFiltersTypes,
  availableTestTypes,
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

const Dashboard = ({
  loc,
  history,
  location,
  isPrinting,
  userRole,
  filters = {},
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

  const requestFilters = { profileId: '6322e2b799978a000a298469' }
  const [defaultCompareBy] = compareByOptions

  const performanceBandList = useMemo(
    () => masteryScales.map((p) => ({ key: p._id, title: p.name })),
    [masteryScales]
  )

  const [tableFilters, setTableFilters] = useState({
    [tableFilterTypes.COMPARE_BY]:
      // compareByOptions.find((c) => c.key === location?.search?.compareBy) ||
      defaultCompareBy,
    [tableFilterTypes.ABOVE_EQUAL_TO_AVG]: true,
    [tableFilterTypes.BELOW_AVG]: true,
  })

  const [academicSummaryFilters, setAcademicSummaryFilters] = useState({
    [academicSummaryFiltersTypes.PERFORMANCE_BAND]:
      performanceBandList.find((p) => p.key === filters.profileId) ||
      performanceBandList[0],
    [academicSummaryFiltersTypes.TEST_TYPE]: availableTestTypes[0],
  })

  const selectedPerformanceBand = (
    masteryScales.filter(
      (x) =>
        x._id ===
        academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND].key
    )[0] || masteryScales[0]
  )?.performanceBand

  const updateTableFiltersCB = (selected, tableFilterType) => {
    setTableFilters((prevState) => {
      const nextState = { ...prevState, [tableFilterType]: selected }
      if (
        !nextState[tableFilterTypes.ABOVE_EQUAL_TO_AVG] &&
        !nextState[tableFilterTypes.BELOW_AVG]
      ) {
        // if both are false, set true to both
        nextState[tableFilterTypes.ABOVE_EQUAL_TO_AVG] = true
        nextState[tableFilterTypes.BELOW_AVG] = true
      }
      return nextState
    })
  }

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
      <SectionLabel>Overview</SectionLabel>
      <MasonGrid>
        <AcademicSummary
          academicSummaryData={academicSummaryData}
          selectedPerformanceBand={selectedPerformanceBand}
          performanceBandList={performanceBandList}
          availableTestTypes={availableTestTypes}
          filters={academicSummaryFilters}
          setFilters={setAcademicSummaryFilters}
        />
        <AttendanceSummary attendanceSummaryData={attendanceSummaryData} />
      </MasonGrid>
      <DashboardTableFilters
        tableFilters={tableFilters}
        updateTableFiltersCB={updateTableFiltersCB}
        compareByOptions={compareByOptions}
      />
      <DashboardTable
        tableFilters={tableFilters}
        updateTableFiltersCB={updateTableFiltersCB}
        tableData={tableData}
        selectedPerformanceBand={selectedPerformanceBand}
        isCsvDownloading={isCsvDownloading}
      />
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
