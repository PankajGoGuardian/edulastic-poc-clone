import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { get, isEmpty, mapValues } from 'lodash'
import { connect } from 'react-redux'
import { Spin } from 'antd'

import { SpinLoader, EduIf, EduThen, EduElse } from '@edulastic/common'

import { reportUtils } from '@edulastic/constants'
import { SubHeader } from '../../../common/components/Header'
import { NoDataContainer, ReportContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import ShareReportModal from '../../../common/components/Popups/ShareReportModal'
import Filters from './components/filters/Filters'

import { resetAllReportsAction } from '../../../common/reportsRedux'
import {
  getCsvDownloadingState,
  getSharingState,
  setSharingStateAction,
  setEnableReportSharingAction,
} from '../../../ducks'
import { getSharedReportList } from '../../../components/sharedReports/ducks'
import { getUserRole } from '../../../../src/selectors/user'
import { actions, selectors } from './ducks'

import {
  compareByOptions as compareByOptionsRaw,
  analyseByOptions,
  TABLE_PAGE_SIZE,
  sortOrdersMap,
} from './utils'

import {
  checkIsInvalidSharedFilters,
  getNoDataContainerText,
  getReportFilters,
} from '../../multipleAssessmentReport/PreVsPost/utils'

import useTabNavigation from '../../../common/hooks/useTabNavigation'
import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'
import { getSelectedCompareBy } from '../../../common/util'
import ReportView from './ReportView'
import useTableFilters from './hooks/useTableFilters'

const { EMPTY_ARRAY } = reportUtils.common

const EfficacyReport = ({
  // value props
  loc,
  location,
  history,
  sharingState,
  sharedReportList,
  isCsvDownloading,
  userRole: _userRole,
  showApply,
  setShowApply,
  breadcrumbData,
  isCliUser,
  isPrinting,
  // value props (from report selectors)
  firstLoad,
  showFilter,
  filtersData,
  settings,
  loadingReportSummaryData,
  loadingReportTableData,
  reportSummaryData,
  reportTableData,
  error,
  updateNavigation,
  // action props
  onRefineResultsCB,
  resetAllReports,
  setSharingState,
  // action props (from report actions)
  setSettings,
  fetchReportSummaryDataRequest,
  fetchReportTableDataRequest,
  setEnableReportSharing,
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
      sharedReport?.sharedBy.role || _userRole,
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport._id }
        : null,
      !!sharedReport?._id,
    ],
    [sharedReport]
  )

  const isInvalidSharedFilters = checkIsInvalidSharedFilters(
    sharedReportFilters,
    isSharedReport
  )

  const reportFilters = getReportFilters(
    isSharedReport,
    sharedReportFilters,
    settings.requestFilters
  )

  const search = useUrlSearchParams(location)
  const compareByOptions = compareByOptionsRaw.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )
  const selectedCompareBy = getSelectedCompareBy({
    search,
    settings,
    compareByOptions,
  })
  const [defaultAnalyseBy] = analyseByOptions

  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const {
    tableFilters,
    setTableFilters,
    getTableDrillDownUrl,
  } = useTableFilters({
    location,
    search,
    settings,
    selectedCompareBy,
    defaultAnalyseBy,
  })

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
      selectedCompareBy,
    })
    setTableFilters({ ...tableFilters, compareBy: selectedCompareBy })
    setShowApply(false)
  }

  const [pageFilters, setPageFilters] = useState({
    page: 0, // set to 0 initially to prevent multiple api request on state update
    pageSize: TABLE_PAGE_SIZE,
  })

  useEffect(() => {
    setEnableReportSharing(false)
    return () => {
      console.log('Efficacy Report Component Unmount')
      resetAllReports()
    }
  }, [])

  const extraNavFilters = useMemo(
    () => ({
      selectedCompareBy: tableFilters.compareBy.key,
      preBandScore: tableFilters.preBandScore,
      postBandScore: tableFilters.postBandScore,
    }),
    [tableFilters.compareBy.key]
  )

  useTabNavigation({
    settings,
    reportId,
    history,
    loc,
    updateNavigation,
    extraFilters: extraNavFilters,
  })

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
    }
    if (settings.requestFilters.termId) {
      setEnableReportSharing(true)
    }
    if (!isInvalidSharedFilters) {
      setPageFilters({ ...pageFilters, page: 1 })
      setTableFilters({
        ...tableFilters,
        requireTotalCount: true,
        preBandScore: search.preBandScore || '',
        postBandScore: search.postBandScore || '',
      })
      fetchReportSummaryDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
  }, [tableFilters.compareBy.key, tableFilters.sortKey, tableFilters.sortOrder])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      compareBy: tableFilters.compareBy.key,
      sortKey: tableFilters.sortKey,
      sortOrder: sortOrdersMap[tableFilters.sortOrder],
      requireTotalCount: tableFilters.requireTotalCount,
      ...pageFilters,
    }
    if (!isInvalidSharedFilters && pageFilters.page) {
      setTableFilters({ ...tableFilters, requireTotalCount: false })
      fetchReportTableDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [pageFilters])

  const {
    bandInfo = EMPTY_ARRAY,
    externalBands = EMPTY_ARRAY,
    externalTests = EMPTY_ARRAY,
  } = useMemo(() => get(filtersData, 'data.result', {}), [filtersData])

  const selectedPrePerformanceBand =
    bandInfo.find((x) => x._id === reportFilters.preProfileId) || bandInfo[0]
  const selectedPostPerformanceBand =
    bandInfo.find((x) => x._id === reportFilters.postProfileId) || bandInfo[0]

  const onMatrixCellClick = (preBandScore = '', postBandScore = '') => () => {
    if (search.preBandScore || search.postBandScore) {
      const _filters = {
        ...settings.requestFilters,
        selectedCompareBy: selectedCompareBy.key,
      }
      history.replace(`${location.pathname}?${qs.stringify(_filters)}`)
    }
    const _tableFilters = {
      ...tableFilters,
      preBandScore: `${preBandScore}`,
      postBandScore: `${postBandScore}`,
    }
    if (
      tableFilters.preBandScore === _tableFilters.preBandScore &&
      tableFilters.postBandScore === _tableFilters.postBandScore
    ) {
      _tableFilters.preBandScore = ''
      _tableFilters.postBandScore = ''
    }
    setTableFilters(_tableFilters)
  }

  const noDataContainerText = getNoDataContainerText(
    settings,
    error,
    isInvalidSharedFilters,
    loc
  )

  return (
    <>
      <EduIf condition={sharingState}>
        <ShareReportModal
          reportType={loc}
          reportFilters={{
            ...settings.requestFilters,
            compareBy: tableFilters.compareBy.key,
          }}
          showModal={sharingState}
          setShowModal={setSharingState}
        />
      </EduIf>
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
          tableFilters={tableFilters}
        />
      </SubHeader>
      <ReportContainer>
        <EduIf condition={firstLoad}>
          <Spin size="large" />
        </EduIf>
        <EduIf condition={loadingReportSummaryData || loadingReportTableData}>
          <EduThen>
            <SpinLoader
              tip="Please wait while we gather the required information..."
              position="fixed"
            />
          </EduThen>
          <EduElse>
            <EduIf condition={isEmpty(reportSummaryData?.metricInfo)}>
              <EduThen>
                <NoDataContainer>{noDataContainerText}</NoDataContainer>
              </EduThen>
              <EduElse>
                <EduIf condition={error && error.dataSizeExceeded}>
                  <EduThen>
                    <DataSizeExceeded />
                  </EduThen>
                  <EduElse>
                    <EduIf condition={!error}>
                      <ReportView
                        reportSummaryData={reportSummaryData}
                        reportTableData={reportTableData}
                        tableFilters={tableFilters}
                        pageFilters={pageFilters}
                        reportFilters={reportFilters}
                        externalBands={externalBands}
                        externalTests={externalTests}
                        selectedPrePerformanceBand={selectedPrePerformanceBand}
                        selectedPostPerformanceBand={
                          selectedPostPerformanceBand
                        }
                        compareByOptions={compareByOptions}
                        setTableFilters={setTableFilters}
                        getTableDrillDownUrl={getTableDrillDownUrl}
                        onMatrixCellClick={onMatrixCellClick}
                        setPageFilters={setPageFilters}
                        isCsvDownloading={isCsvDownloading}
                        isSharedReport={isSharedReport}
                      />
                    </EduIf>
                  </EduElse>
                </EduIf>
              </EduElse>
            </EduIf>
          </EduElse>
        </EduIf>
      </ReportContainer>
    </>
  )
}

const enhance = connect(
  (state) => ({
    ...mapValues(selectors, (selector) => selector(state)),
    userRole: getUserRole(state),
    isCsvDownloading: getCsvDownloadingState(state),
    sharingState: getSharingState(state),
    sharedReportList: getSharedReportList(state),
  }),
  {
    ...actions,
    resetAllReports: resetAllReportsAction,
    setSharingState: setSharingStateAction,
    setEnableReportSharing: setEnableReportSharingAction,
  }
)

export default enhance(EfficacyReport)
