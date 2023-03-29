import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row } from 'antd'
import { isEmpty } from 'lodash'
import {
  getCurrentTerm,
  getOrgDataSelector,
  getUserRole,
} from '../../../../src/selectors/user'
import { SubHeader } from '../../../common/components/Header'
import ShareReportModal from '../../../common/components/Popups/ShareReportModal'
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
import {
  groupByConstants,
  compareByOptions as compareByOptionsRaw,
} from './utils/constants'
import useTabNavigation from '../common/hooks/useTabNavigation'
import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'
import { buildRequestFilters } from '../common/utils'
import { selectors, actions } from './ducks'
import Filters from './components/Filters'
import { resetAllReportsAction } from '../../../common/reportsRedux'

const AttendanceReport = (props) => {
  const {
    isBeingShared,
    setIsBeingShared,
    loc,
    breadcrumbData,
    isCliUser,
    userRole,
    onRefineResultsCB,
    showFilter,
    location,

    history,
    isPrinting,
    isCsvDownloading,
    firstLoad,

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
  const selectedCompareBy = search.selectedCompareBy
    ? compareByOptions.find((o) => o.key === search.selectedCompareBy)
    : settings.selectedCompareBy?.key
    ? settings.selectedCompareBy
    : compareByOptions[0]

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

  useTabNavigation(search, settings, reportId, history, loc, updateNavigation)

  const isWithoutFilters = isEmpty(settings.requestFilters)

  const [groupBy, setGroupBy] = useState(groupByConstants.MONTH)
  const [filters] = useState({})
  const [attendanceData, loading] = useAttendanceSummaryFetch({
    filters,
    groupBy,
  })
  const _setGroupBy = (checked) => {
    if (checked) {
      return setGroupBy(groupByConstants.WEEK)
    }
    return setGroupBy(groupByConstants.MONTH)
  }
  return (
    <>
      <ShareReportModal
        reportType={loc}
        reportFilters={filters}
        showModal={isBeingShared}
        setShowModal={setIsBeingShared}
      />
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
      <AttendanceSummaryChart
        attendanceData={attendanceData}
        loading={loading}
        groupBy={groupBy}
        setGroupBy={_setGroupBy}
      />
      <div>
        <Row gutter={[4, 4]}>
          <AttendanceDistribution />
          <Tardies
            attendanceData={attendanceData}
            loading={loading}
            groupBy={groupBy}
            setGroupBy={_setGroupBy}
          />
        </Row>
        <PerformanceTable filters={filters} userRole={userRole} />
      </div>
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
    defaultTermId: getCurrentTerm(state),
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
