import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, mapValues } from 'lodash'
import qs from 'qs'

import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { SubHeader } from '../../../common/components/Header'

import {
  getCurrentTerm,
  getOrgDataSelector,
  getUserRole,
} from '../../../../src/selectors/user'

import {
  compareByOptions as compareByOptionsRaw,
  academicSummaryFiltersTypes,
  buildAcademicSummaryFilters,
} from './utils'
import { buildRequestFilters } from '../common/utils'
import {
  getCsvDownloadingState,
  getSharingState,
  setSharingStateAction,
} from '../../../ducks'
import { getSharedReportList } from '../../../components/sharedReports/ducks'
import { resetAllReportsAction } from '../../../common/reportsRedux'
import Filters from './components/Filters/Filters'
import { actions, selectors } from './ducks'
import useTabNavigation from '../../../common/hooks/useTabNavigation'
import ReportView from './ReportView'
import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'
import { getSelectedCompareBy } from '../../../common/util'
import { StyledReportContainer } from '../../../common/styled'

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
  filtersData,
  settings,
  setSettings,
  setAcademicSummaryFilters,
  firstLoad,

  showApply,
  setShowApply,
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
}) => {
  const reportId = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }).reportId,
    []
  )

  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const compareByOptions = compareByOptionsRaw.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )

  const { academicSummaryFilters } = settings
  const { bandInfo = [] } = get(filtersData, 'data.result', {})
  const performanceBandList = useMemo(
    () => bandInfo.map((p) => ({ key: p._id, title: p.name })),
    [bandInfo]
  )

  const selectedPerformanceBand = (
    bandInfo.filter(
      (x) =>
        x._id ===
        academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]
          ?.key
    )[0] || bandInfo[0]
  )?.performanceBand

  const search = useUrlSearchParams(location)
  const selectedCompareBy = getSelectedCompareBy({
    search,
    settings,
    compareByOptions,
  })

  const onGoClick = (_settings) => {
    const _requestFilters = buildRequestFilters(_settings)
    const { performanceBand, testType } = buildAcademicSummaryFilters(
      search,
      academicSummaryFilters,
      performanceBandList
    )
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

  useTabNavigation({
    settings,
    reportId,
    history,
    loc,
    updateNavigation,
    extraFilters: {
      selectedCompareBy:
        search.selectedCompareBy || settings.selectedCompareBy.key,
      profileId:
        search.profileId ||
        settings.academicSummaryFilters[
          academicSummaryFiltersTypes.PERFORMANCE_BAND
        ]?.key,
    },
  })

  const isWithoutFilters = isEmpty(settings.requestFilters)

  return (
    <StyledReportContainer>
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
            selectedPerformanceBand={selectedPerformanceBand}
            performanceBandList={performanceBandList}
            setAcademicSummaryFilters={setAcademicSummaryFilters}
            compareByOptions={compareByOptions}
            isCsvDownloading={isCsvDownloading}
            settings={settings}
            setSettings={setSettings}
            fetchDashboardTableDataRequest={fetchDashboardTableDataRequest}
            loadingTableData={loadingTableData}
            tableDataRequestError={tableDataRequestError}
            tableData={tableData}
          />
        </EduElse>
      </EduIf>
    </StyledReportContainer>
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
  }
)(Dashboard)
