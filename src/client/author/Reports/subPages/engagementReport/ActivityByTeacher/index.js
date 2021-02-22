import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'

import { SpinLoader } from '@edulastic/common'
import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import SimpleStackedBarWithLineChartContainer from '../common/components/SimpleStackedBarWithLineChartContainer'
import ActivityTable from '../common/components/ActivityTable'
import { getCsvDownloadingState } from '../../../ducks'
import {
  getActivityByTeacherRequestAction,
  getReportsActivityByTeacherLoader,
  getReportsActivityByTeacherError,
  getReportsActivityByTeacher,
} from './ducks'

import columns from './static/json/tableColumns.json'

const ActivityByTeacher = ({
  loading,
  error,
  getActivityByTeacherRequest,
  activityByTeacher,
  settings,
  isCsvDownloading,
}) => {
  const [metricFilter, setMetricFilter] = useState({})

  useEffect(() => {
    const q = { ...settings.requestFilters }
    if (q.termId || q.reportId) {
      getActivityByTeacherRequest(q)
    }
  }, [settings])

  const metricInfo = get(activityByTeacher, 'data.result.metricInfo', [])

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
          Activity by Teacher
        </StyledH3>
        <SimpleStackedBarWithLineChartContainer
          data={metricInfo}
          filter={metricFilter}
          onBarClickCB={onBarClickCB}
          onResetClickCB={onResetClickCB}
          activityBy="teacher"
        />
      </StyledCard>
      <StyledCard>
        <ActivityTable
          activityBy="teacher"
          isCsvDownloading={isCsvDownloading}
          data={metricInfo}
          filter={metricFilter}
          columns={columns.columns}
          filters={settings.requestFilters}
        />
      </StyledCard>
    </>
  )
}

const enhance = connect(
  (state) => ({
    loading: getReportsActivityByTeacherLoader(state),
    error: getReportsActivityByTeacherError(state),
    activityByTeacher: getReportsActivityByTeacher(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    getActivityByTeacherRequest: getActivityByTeacherRequestAction,
  }
)

export default enhance(ActivityByTeacher)
