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
  getPerformanceBandList,
  getAvailableAcademicTestTypesWithBands,
  getFilteredAcademicSummaryTestTypes,
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
  loadingTableDataWithFilters,
  districtAveragesData,
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
  const { bandInfo = [], externalBands = [] } = get(
    filtersData,
    'data.result',
    {}
  )
  const attendanceBandInfo = useMemo(
    () =>
      (filtersData?.data?.result.attendanceBandInfo || []).map((it) => ({
        key: it._id,
        title: it.name,
        analyzeBy: it.analyze_by,
      })),
    [filtersData]
  )
  const availableAcademicTestTypes = useMemo(
    () => getAvailableAcademicTestTypesWithBands(bandInfo, externalBands),
    [bandInfo, externalBands]
  )

  const filteredAvailableTestTypes = useMemo(
    () =>
      getFilteredAcademicSummaryTestTypes(
        settings.requestFilters.assessmentTypes,
        availableAcademicTestTypes
      ),
    [settings.requestFilters.assessmentTypes, availableAcademicTestTypes]
  )

  const performanceBandList = useMemo(
    () =>
      getPerformanceBandList(
        bandInfo,
        externalBands,
        academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE]?.key,
        filteredAvailableTestTypes
      ),
    [
      bandInfo,
      externalBands,
      academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE],
      filteredAvailableTestTypes,
    ]
  )

  const search = useUrlSearchParams(location)
  const selectedCompareBy = getSelectedCompareBy({
    search,
    settings,
    compareByOptions,
  })
  const { key: attendanceProfileId, analyzeBy: showAbsents } = useMemo(
    () =>
      attendanceBandInfo.find((it) => it.key === search.attendanceProfileId) ||
      attendanceBandInfo[0] ||
      {},
    [attendanceBandInfo, search.attendanceProfileId]
  )

  const onGoClick = (_settings) => {
    const _requestFilters = buildRequestFilters(_settings)
    const { performanceBand, testType } = buildAcademicSummaryFilters(
      { ...search, ..._requestFilters },
      academicSummaryFilters,
      availableAcademicTestTypes,
      bandInfo,
      externalBands
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
      attendanceProfileId,
    })
    setShowApply(false)
    history.push(
      `${location.pathname}?${qs.stringify({
        ...settings.requestFilters,
        attendanceProfileId,
      })}`
    )
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
      attendanceProfileId,
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
            history={history}
            location={location}
            search={search}
            selectedCompareBy={selectedCompareBy}
            performanceBandList={performanceBandList}
            bandInfo={bandInfo}
            setAcademicSummaryFilters={setAcademicSummaryFilters}
            compareByOptions={compareByOptions}
            isCsvDownloading={isCsvDownloading}
            settings={settings}
            setSettings={setSettings}
            fetchDashboardTableDataRequest={fetchDashboardTableDataRequest}
            loadingTableData={loadingTableData}
            loadingTableDataWithFilters={loadingTableDataWithFilters}
            tableDataRequestError={tableDataRequestError}
            districtAveragesData={districtAveragesData}
            tableData={tableData}
            loc={loc}
            availableTestTypes={filteredAvailableTestTypes}
            attendanceBandInfo={attendanceBandInfo}
            showAbsents={showAbsents}
            filtersData={filtersData}
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
