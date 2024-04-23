import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Spin } from 'antd'
import { omit } from 'lodash'
import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import qs from 'qs'
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
import { getSelectedCompareBy, getSelectedGroupBy } from '../../../common/util'
import { getUserRole } from '../../../../src/selectors/user'
import SummaryTitle from './SummaryTitle'

const Container = ({
  userRole,
  settings,
  toggleFilter,
  profileId,
  sharedReport,
  firstLoad,
  filters,
  history,
  location,
  showAbsents,
}) => {
  const search = qs.parse(location.search)
  const defaultGroupBy = getSelectedGroupBy(search)
  const [groupBy, setGroupBy] = useState(defaultGroupBy)
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
  ] = useAttendanceDistributionFetch(settings, profileId)
  const [
    atDetailsData,
    totalRows,
    atDetailsLoading,
  ] = useAttendanceDetailsFetch({
    settings,
    compareBy,
    sortOrder,
    sortKey,
    showAbsents,
    page,
    pageSize,
    profileId,
  })

  const setQueryParams = (value) => {
    let searchString = `${qs.stringify(
      omit(filters, ['profileId', 'groupBy'])
    )}&groupBy=${value}`
    const _search = qs.parse(location.search)
    if (_search.profileId) {
      searchString = `${searchString}&profileId=${_search.profileId}`
    }
    history.push(`${location.pathname}?${searchString}`)
  }

  const onSetGroupBy = (checked) => {
    if (checked) {
      setQueryParams(groupByConstants.MONTH)
      return setGroupBy(groupByConstants.MONTH)
    }
    setQueryParams(groupByConstants.WEEK)
    return setGroupBy(groupByConstants.WEEK)
  }
  const showNoData = !loading && !attendanceData.length
  const isSharedReport = !!sharedReport?._id
  const hasTermId = useMemo(() => {
    return settings.requestFilters?.termId
  }, [loading])

  return (
    <EduIf condition={firstLoad}>
      <EduThen>
        <Spin size="large" />
      </EduThen>
      <EduElse>
        <EduIf condition={loading && attDistrDataLoading && atDetailsLoading}>
          <EduThen>
            <SpinLoader
              tip="Please wait while we gather the required information..."
              position="fixed"
            />
          </EduThen>
          <EduElse>
            <EduIf condition={showNoData}>
              <EduThen>
                <NoDataContainer>
                  {hasTermId ? 'No data available currently.' : ''}
                </NoDataContainer>
              </EduThen>
              <EduElse>
                <SummaryTitle />
                <div className="attendance-summary">
                  <AttendanceSummaryChart
                    attendanceData={attendanceData}
                    loading={loading}
                    groupBy={groupBy}
                    setGroupBy={onSetGroupBy}
                    showAbsents={showAbsents}
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
                      showAbsents={showAbsents}
                      setSortOrder={setSortOrder}
                      setSortKey={setSortKey}
                      setPage={setPage}
                      setCompareBy={setCompareBy}
                      isSharedReport={isSharedReport}
                      compareByOptions={compareByOptions}
                    />
                  </div>
                </div>
              </EduElse>
            </EduIf>
          </EduElse>
        </EduIf>
      </EduElse>
    </EduIf>
  )
}

const { settings, firstLoad } = selectors
const enhance = connect((state) => ({
  settings: settings(state),
  firstLoad: firstLoad(state),
  userRole: getUserRole(state),
}))

export default enhance(Container)
