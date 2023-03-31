import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getOrgDataSelector, getUserRole } from '../../../../src/selectors/user'
import { SubHeader } from '../../../common/components/Header'
import { getSharedReportList } from '../../../components/sharedReports/ducks'
import {
  getCsvDownloadingState,
  getSharingState,
  setSharingStateAction,
} from '../../../ducks'
import { compareByOptions as compareByOptionsRaw } from './utils/constants'
import useTabNavigation from '../common/hooks/useTabNavigation'
import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'
import { buildRequestFilters } from '../common/utils'
import { selectors, actions } from './ducks'
import Filters from './components/Filters'
import { resetAllReportsAction } from '../../../common/reportsRedux'
import Container from './Container'
import { getSelectedCompareBy } from '../../../common/util'

const AttendanceReport = (props) => {
  const {
    loc,
    breadcrumbData,
    isCliUser,
    userRole,
    onRefineResultsCB,
    showFilter,
    location,
    history,
    isPrinting,
    settings,
    setSettings,
    showApply,
    resetAllReports,
    updateNavigation,
  } = props

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

  const search = useUrlSearchParams(location)
  const reportId = search.reportId
  const selectedCompareBy = getSelectedCompareBy(
    search,
    settings,
    compareByOptions
  )

  const onApplyFilter = (_settings) => {
    const _requestFilters = buildRequestFilters(_settings)
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

  useEffect(
    () => () => {
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

  return (
    <>
      <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser}>
        <Filters
          reportId={reportId}
          isPrinting={isPrinting}
          onGoClick={onApplyFilter}
          history={history}
          location={location}
          search={search}
          showApply={showApply}
          setShowApply={setShowApply}
          showFilter={showFilter}
          toggleFilter={toggleFilter}
        />
      </SubHeader>
      <Container toggleFilter={toggleFilter} />
    </>
  )
}

const { setSettings } = actions
const { settings, firstLoad } = selectors
const enhance = connect(
  (state) => ({
    isBeingShared: getSharingState(state),
    sharedReportList: getSharedReportList(state),
    isCsvDownloading: getCsvDownloadingState(state),
    userRole: getUserRole(state),
    orgData: getOrgDataSelector(state),
    settings: settings(state),
    firstLoad: firstLoad(state),
  }),
  {
    resetAllReports: resetAllReportsAction,
    setIsBeingShared: setSharingStateAction,
    setSettings,
  }
)

export default enhance(AttendanceReport)
