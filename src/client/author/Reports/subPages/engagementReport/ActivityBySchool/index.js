import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'

import { SpinLoader } from '@edulastic/common'
import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import SimpleStackedBarWithLineChartContainer from '../common/components/SimpleStackedBarWithLineChartContainer'
import ActivityTable from '../common/components/ActivityTable'
import { getCsvDownloadingState } from '../../../ducks'

import {
  getActivityBySchoolRequestAction,
  getReportsActivityBySchoolLoader,
  getReportsActivityBySchoolError,
  getReportsActivityBySchool,
} from './ducks'

import columns from './static/json/tableColumns.json'

const ActivityBySchool = ({
  loading,
  error,
  getActivityBySchoolRequest,
  activityBySchool,
  settings,
  isCsvDownloading,
}) => {
  const [metricFilter, setMetricFilter] = useState({})

  useEffect(() => {
    const q = { ...settings.requestFilters }
    if (q.termId || q.reportId) {
      getActivityBySchoolRequest(q)
    }
  }, [settings])

  const metricInfo = useMemo(
    () => get(activityBySchool, 'data.result.metricInfo', []),
    [activityBySchool]
  )

  const onBarClickCB = (key) => {
    const _metricFilter = { ...metricFilter }
    if (_metricFilter[key]) {
      delete _metricFilter[key]
    } else {
      _metricFilter[key] = true
    }
    setMetricFilter(_metricFilter)
  }

  const onResetClickCB = () => {
    setMetricFilter({})
  }

  if (loading) {
    return <SpinLoader position="fixed" />
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (!metricInfo.length) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
  }

  return (
    <>
      <StyledCard>
        <StyledH3 fontSize="16px" marginLeft="10px">
          Activity by School
        </StyledH3>
        <SimpleStackedBarWithLineChartContainer
          data={metricInfo}
          filter={metricFilter}
          onBarClickCB={onBarClickCB}
          onResetClickCB={onResetClickCB}
          activityBy="school"
        />
      </StyledCard>
      <StyledCard>
        <ActivityTable
          isCsvDownloading={isCsvDownloading}
          data={metricInfo}
          filter={metricFilter}
          columns={columns.columns}
          filters={settings.requestFilters}
          activityBy="school"
        />
      </StyledCard>
    </>
  )
}

const enhance = connect(
  (state) => ({
    loading: getReportsActivityBySchoolLoader(state),
    error: getReportsActivityBySchoolError(state),
    activityBySchool: getReportsActivityBySchool(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    getActivityBySchoolRequest: getActivityBySchoolRequestAction,
  }
)

export default enhance(ActivityBySchool)
