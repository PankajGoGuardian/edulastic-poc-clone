import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { reportGroupType } from '@edulastic/constants/const/report'
import { head, isEmpty, mapValues } from 'lodash'
import qs from 'qs'
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
import { NoDataContainer } from '../../../common/styled'

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
  setAcademicSummaryFilters,

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

  const { academicSummaryFilters } = settings
  const performanceBandList = useMemo(
    () => masteryScales.map((p) => ({ key: p._id, title: p.name })),
    [masteryScales]
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
      academicSummaryFilters: {
        [academicSummaryFiltersTypes.PERFORMANCE_BAND]:
          performanceBandList.find(
            (p) =>
              p.key ===
              academicSummaryFilters[
                academicSummaryFiltersTypes.PERFORMANCE_BAND
              ]
          ) || performanceBandList[0],
        [academicSummaryFiltersTypes.TEST_TYPE]: availableTestTypes.includes(
          academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE]
        )
          ? academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE]
          : availableTestTypes[0],
      },
    })
    setShowApply(false)
  }

  useEffect(
    () => () => {
      console.log('Multiple Assessment Report Component Unmount')
      resetAllReports()
    },
    []
  )

  useTabNavigation(settings, reportId, history, loc, updateNavigation)

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
          showApply={showApply}
          setShowApply={setShowApply}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
        />
      </SubHeader>
      {isWithoutFilters ? (
        <NoDataContainer />
      ) : (
        <ReportView
          performanceBandList={performanceBandList}
          academicSummaryFilters={academicSummaryFilters}
          setAcademicSummaryFilters={setAcademicSummaryFilters}
          compareByOptions={compareByOptions}
          isCsvDownloading={isCsvDownloading}
          settings={settings}
          setSettings={setSettings}
        />
      )}
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
