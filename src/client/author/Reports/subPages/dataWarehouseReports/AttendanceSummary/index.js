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
import PerformanceTable, { compareByOptions } from './Performance'
import AttendanceSummaryChart from './WeeklyAttendaceChart/AttendanceSummaryChart'
import Tardies from './Tardies'

const tableData = [
  {
    dimension: {
      _id: '1',
      name: 'Class 1',
    },
    avgAttendance: 85,
    tardyEventCount: 2,
    attendanceDistribution: [
      {
        _id: 'p',
        name: 'Present',
        color: '#00ff00',
        value: 75,
      },
      {
        _id: 'a',
        name: 'Absent',
        color: '#ff0000',
        value: 10,
      },
      {
        _id: 'l',
        name: 'Late',
        color: '#ffff00',
        value: 10,
      },
      {
        _id: 'e',
        name: 'Excused',
        color: '#888888',
        value: 5,
      },
    ],
  },
  {
    dimension: {
      _id: '2',
      name: 'Class 2',
    },
    avgAttendance: 90,
    tardyEventCount: 1,
    attendanceDistribution: [
      {
        _id: 'p',
        name: 'Present',
        color: '#00ff00',
        value: 85,
      },
      {
        _id: 'a',
        name: 'Absent',
        color: '#ff0000',
        value: 5,
      },
      {
        _id: 'l',
        name: 'Late',
        color: '#ffff00',
        value: 5,
      },
      {
        _id: 'e',
        name: 'Excused',
        color: '#888888',
        value: 5,
      },
    ],
  },
  {
    dimension: {
      _id: '3',
      name: 'Class 3',
    },
    avgAttendance: 75,
    tardyEventCount: 3,
    attendanceDistribution: [
      {
        _id: 'p',
        name: 'Present',
        color: '#00ff00',
        value: 60,
      },
      {
        _id: 'a',
        name: 'Absent',
        color: '#ff0000',
        value: 10,
      },
      {
        _id: 'l',
        name: 'Late',
        color: '#ffff00',
        value: 5,
      },
      {
        _id: 'e',
        name: 'Excused',
        color: '#888888',
        value: 5,
      },
      {
        _id: 't',
        name: 'Tardy',
        color: '#ff8800',
        value: 20,
      },
    ],
  },
  {
    dimension: {
      _id: '4',
      name: 'Class 4',
    },
    avgAttendance: 95,
    tardyEventCount: 0,
    attendanceDistribution: [
      {
        _id: 'p',
        name: 'Present',
        color: '#00ff00',
        value: 95,
      },
      {
        _id: 'a',
        name: 'Absent',
        color: '#ff0000',
        value: 0,
      },
      {
        _id: 'e',
        name: 'Excused',
        color: '#888888',
        value: 5,
      },
    ],
  },
]

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
      <AttendanceSummaryChart />
      <div>
        <Row gutter={[4, 4]}>
          <AttendanceDistribution />
          <Tardies />
        </Row>
        <PerformanceTable
          setTableFilters={setTableFilters}
          selectedTableFilters={tableFilters}
          dataSource={tableData}
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
