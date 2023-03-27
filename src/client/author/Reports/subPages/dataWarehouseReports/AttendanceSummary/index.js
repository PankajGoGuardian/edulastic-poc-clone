import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row } from 'antd'
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
import PerformanceTable from './Performance'
import AttendanceSummaryChart from './WeeklyAttendaceChart/AttendanceSummaryChart'
import Tardies from './Tardies'
import { useAttendanceSummaryFetch } from './hooks/useFetch'

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
  const [filters] = useState({})
  const [data, loading] = useAttendanceSummaryFetch({
    filters,
  })
  const attendanceData = data
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
      <AttendanceSummaryChart
        attendanceData={attendanceData}
        loading={loading}
      />
      <div>
        <Row gutter={[4, 4]}>
          <AttendanceDistribution />
          <Tardies attendanceData={attendanceData} loading={loading} />
        </Row>
        <PerformanceTable filters={filters} />
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
