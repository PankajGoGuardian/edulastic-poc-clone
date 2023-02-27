import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  getCurrentTerm,
  getOrgDataSelector,
  getUserRole,
} from '../../../../src/selectors/user'
import { SubHeader } from '../../../common/components/Header'
import ShareReportModal from '../../../common/components/Popups/ShareReportModal'
import { computeChartNavigationLinks } from '../../../common/util'
import { getSharedReportList } from '../../../components/sharedReports/ducks'
import {
  getCsvDownloadingState,
  getSharingState,
  setSharingStateAction,
} from '../../../ducks'
import AttendanceDistribution from './AttendanceDistribution'
import PerformanceTable, { compareByOptions } from './Performance'
import AttendanceSummaryChart from './AttendanceSummaryChart'

// TODO move this action to parent.
const useLegacyReportActions = (filters, props, reportId) => {
  useEffect(() => {
    const navigationItems = computeChartNavigationLinks(
      filters,
      props.loc,
      reportId
    )
    props.updateNavigation(navigationItems)
  }, [filters])
}

const AttendanceReport = (props) => {
  const {
    isBeingShared,
    setIsBeingShared,
    loc,
    breadcrumbData,
    isCliUser,
  } = props
  // eslint-disable-next-line no-unused-vars
  const [compareBy] = compareByOptions
  const [filters] = useState(null)
  const [tableFilters, setTableFilters] = useState({
    compareBy,
    preBandScore: '',
    postBandScore: '',
  })
  const isSharedReport = !!filters?.reportId
  const hideOtherTabs = isSharedReport
  useLegacyReportActions(filters, props, hideOtherTabs)
  return (
    <>
      <ShareReportModal
        reportType={loc}
        reportFilters={filters}
        showModal={isBeingShared}
        setShowModal={setIsBeingShared}
      />
      <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser}>
        {/* Add Filters */}
      </SubHeader>
      {/* Add Report stuff (sections) */}
      <div>
        <AttendanceSummaryChart />
      </div>
      <div>
        <AttendanceDistribution />
        <PerformanceTable
          setTableFilters={setTableFilters}
          selectedTableFilters={tableFilters}
        />
      </div>
    </>
  )
}

const enhance = connect(
  (state) => ({
    isBeingShared: getSharingState(state),
    sharedReportList: getSharedReportList(state),
    isCsvDownloading: getCsvDownloadingState(state),
    userRole: getUserRole(state),
    orgData: getOrgDataSelector(state),
    defaultTermId: getCurrentTerm(state),
  }),
  {
    setIsBeingShared: setSharingStateAction,
  }
)

export default enhance(AttendanceReport)
