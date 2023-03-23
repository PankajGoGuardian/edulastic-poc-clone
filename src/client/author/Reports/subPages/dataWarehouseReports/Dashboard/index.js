import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { reportGroupType } from '@edulastic/constants/const/report'
import { head, isEmpty, mapValues } from 'lodash'
import qs from 'qs'

import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { SubHeader } from '../../../common/components/Header'

import { DashboardReportContainer } from './components/common/styledComponents'

import {
  getCurrentTerm,
  getOrgDataSelector,
  getUserRole,
} from '../../../../src/selectors/user'

import {
  masteryScales,
  compareByOptions as compareByOptionsRaw,
  academicSummaryFiltersTypes,
  availableTestTypes,
  buildRequestFilters,
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
import ReportView from './ReportView'
import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'

const { PERFORMANCE_BAND, TEST_TYPE } = academicSummaryFiltersTypes

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
  setAcademicSummaryFilters,

  showApply,
  onRefineResultsCB,
  showFilter,

  resetAllReports,

  updateNavigation,
  // report selectors
  loadingTableData,
  tableData,
  tableDataRequestError,
  // report actions
  fetchDashboardTableDataRequest,
  firstLoad,
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

  const { academicSummaryFilters } = settings
  const performanceBandList = useMemo(
    () => masteryScales.map((p) => ({ key: p._id, title: p.name })),
    [masteryScales]
  )

  const search = useUrlSearchParams(location)
  const selectedCompareBy = search.selectedCompareBy
    ? compareByOptions.find((o) => o.key === search.selectedCompareBy)
    : settings.selectedCompareBy?.key
    ? settings.selectedCompareBy
    : head(compareByOptions)

  const onGoClick = (_settings) => {
    const _requestFilters = buildRequestFilters(_settings)
    const performanceBand =
      performanceBandList.find(
        (p) => p.key === academicSummaryFilters[PERFORMANCE_BAND]
      ) || performanceBandList[0]
    const testType = availableTestTypes.includes(
      academicSummaryFilters[TEST_TYPE]
    )
      ? academicSummaryFilters[TEST_TYPE]
      : availableTestTypes[0]
    setSettings({
      ...settings,
      requestFilters: {
        ..._requestFilters,
        classIds: _requestFilters.classIds || '',
        groupIds: _requestFilters.groupIds || '',
        testIds: _requestFilters.testIds || '',
      },
      selectedFilterTagsData: _settings.selectedFilterTagsData,
      selectedCompareBy,
      academicSummaryFilters: {
        [PERFORMANCE_BAND]: performanceBand,
        [TEST_TYPE]: testType,
      },
    })
    setShowApply(false)
  }

  useEffect(
    () => () => {
      console.log('Dashboard Report Component Unmount')
      resetAllReports()
    },
    []
  )

  useTabNavigation(search, settings, reportId, history, loc, updateNavigation)

  const isWithoutFilters = isEmpty(settings.requestFilters)

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
          search={search}
          showApply={showApply}
          setShowApply={setShowApply}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
        />
      </SubHeader>
      <EduIf condition={firstLoad && isWithoutFilters}>
        <EduThen>
          <SpinLoader
            tip="Please wait while we gather the required information..."
            position="fixed"
          />
        </EduThen>
        <EduElse>
          <ReportView
            location={location}
            selectedCompareBy={selectedCompareBy}
            performanceBandList={performanceBandList}
            setAcademicSummaryFilters={setAcademicSummaryFilters}
            compareByOptions={compareByOptions}
            isCsvDownloading={isCsvDownloading}
            settings={settings}
            setSettings={setSettings}
            fetchDashboardTableDataRequest={fetchDashboardTableDataRequest}
            loadingTableData={loadingTableData}
            tableDataRequestError={tableDataRequestError}
            toggleFilter={toggleFilter}
            tableData={tableData}
          />
        </EduElse>
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
