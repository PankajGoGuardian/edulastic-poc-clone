import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Row } from 'antd'
import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import AttendanceDistribution from './AttendanceDistribution'
import PerformanceTable from './Performance'
import AttendanceSummaryChart from './WeeklyAttendaceChart/AttendanceSummaryChart'
import Tardies from './Tardies'
import {
  useAttendanceDetailsFetch,
  useAttendanceDistributionFetch,
  useAttendanceSummaryFetch,
} from './hooks/useFetch'
import {
  groupByConstants,
  pageSize,
  compareByOptions as compareByOptionsRaw,
} from './utils/constants'

import { selectors } from './ducks'
import { NoDataContainer } from '../../../common/styled'
import { getSelectedCompareBy } from '../../../common/util'

const Container = ({ userRole, settings, toggleFilter }) => {
  const [groupBy, setGroupBy] = useState(groupByConstants.MONTH)
  const compareByOptions = compareByOptionsRaw.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )
  const defaultCompareBy = getSelectedCompareBy({
    compareByOptions,
  }).key
  const [compareBy, setCompareBy] = useState(defaultCompareBy)
  const [sortOrder, setSortOrder] = useState('')
  const [sortKey, setSortKey] = useState('')
  const [page, setPage] = useState(1)
  const [attendanceData, loading] = useAttendanceSummaryFetch({
    settings,
    groupBy,
    toggleFilter,
  })
  const [
    attDistributionData,
    attDistrDataLoading,
  ] = useAttendanceDistributionFetch(settings)
  const [
    atDetailsData,
    totalRows,
    atDetailsLoading,
  ] = useAttendanceDetailsFetch({
    settings,
    compareBy,
    sortOrder,
    sortKey,
    page,
    pageSize,
  })
  const onSetGroupBy = (checked) => {
    if (checked) {
      return setGroupBy(groupByConstants.MONTH)
    }
    return setGroupBy(groupByConstants.WEEK)
  }
  const showNoData = !loading && !attendanceData.length

  return (
    <EduIf condition={loading}>
      <EduThen>
        <SpinLoader
          tip="Please wait while we gather the required information..."
          position="fixed"
        />
      </EduThen>
      <EduElse>
        <EduIf condition={showNoData}>
          <EduThen>
            <NoDataContainer>No data available currently.</NoDataContainer>
          </EduThen>
          <EduElse>
            <AttendanceSummaryChart
              attendanceData={attendanceData}
              loading={loading}
              groupBy={groupBy}
              setGroupBy={onSetGroupBy}
            />
            <div>
              <Row gutter={[16, 16]}>
                <AttendanceDistribution
                  data={attDistributionData}
                  loading={attDistrDataLoading}
                />
                <Tardies
                  attendanceData={attendanceData}
                  loading={loading}
                  groupBy={groupBy}
                  setGroupBy={onSetGroupBy}
                />
              </Row>
              <PerformanceTable
                settings={settings}
                data={atDetailsData}
                totalRows={totalRows}
                loading={atDetailsLoading}
                sortOrder={sortOrder}
                sortKey={sortKey}
                page={page}
                compareBy={compareBy}
                setSortOrder={setSortOrder}
                setSortKey={setSortKey}
                setPage={setPage}
                setCompareBy={setCompareBy}
              />
            </div>
          </EduElse>
        </EduIf>
      </EduElse>
    </EduIf>
  )
}

const { settings } = selectors
const enhance = connect((state) => ({
  settings: settings(state),
}))

export default enhance(Container)
