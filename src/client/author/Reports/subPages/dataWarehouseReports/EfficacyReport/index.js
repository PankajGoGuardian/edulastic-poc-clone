import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { get, isEmpty, mapValues } from 'lodash'
import { connect } from 'react-redux'
import { Spin } from 'antd'

import { SpinLoader, EduIf, EduThen, EduElse } from '@edulastic/common'

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
} from '../../../ducks'
import { getSharedReportList } from '../../../components/sharedReports/ducks'
import { getUserRole } from '../../../../src/selectors/user'
import { actions, selectors } from './ducks'

import {
  compareByOptions as compareByOptionsRaw,
  analyseByOptions,
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
  updateNavigation,
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
  // action props
  onRefineResultsCB,
  resetAllReports,
  setSharingState,
  // action props (from report actions)
  setSettings,
  fetchReportSummaryDataRequest,
  fetchReportTableDataRequest,
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

  const compareByOptions = compareByOptionsRaw.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )

  const [defaultCompareBy] = compareByOptions
  const [defaultAnalyseBy] = analyseByOptions

  const toggleFilter = (e, status) => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, status === false ? status : status || !showFilter)
    }
  }

  const search = useUrlSearchParams(location)
  const selectedCompareBy = getSelectedCompareBy({
    search,
    settings,
    compareByOptions,
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
    setShowApply(false)
  }

  const [tableFilters, setTableFilters] = useState({
    compareBy: defaultCompareBy,
    analyseBy: defaultAnalyseBy,
    preBandScore: '',
    postBandScore: '',
  })

  useEffect(
    () => () => {
      console.log('Efficacy Report Component Unmount')
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
    extraFilters: { selectedCompareBy: selectedCompareBy.key },
  })

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
    }
    if (!isInvalidSharedFilters) {
      setTableFilters({ ...tableFilters, preBandScore: '', postBandScore: '' })
      fetchReportSummaryDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      compareBy: tableFilters.compareBy.key,
    }
    if (!isInvalidSharedFilters) {
      fetchReportTableDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters, tableFilters.compareBy.key])

  const { bandInfo = [], externalBands = [] } = useMemo(
    () => get(filtersData, 'data.result', []),
    [filtersData]
  )

  const selectedPrePerformanceBand =
    bandInfo.find((x) => x._id === reportFilters.preProfileId) || bandInfo[0]
  const selectedPostPerformanceBand =
    bandInfo.find((x) => x._id === reportFilters.postProfileId) || bandInfo[0]

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
            externalBandsRequired: true,
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
                        reportFilters={reportFilters}
                        externalBands={externalBands}
                        selectedPrePerformanceBand={selectedPrePerformanceBand}
                        selectedPostPerformanceBand={
                          selectedPostPerformanceBand
                        }
                        compareByOptions={compareByOptions}
                        setTableFilters={setTableFilters}
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
  }
)

export default enhance(EfficacyReport)
