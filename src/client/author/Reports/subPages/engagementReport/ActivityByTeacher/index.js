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
  getActivityByTeacherRequestAction,
  getReportsActivityByTeacherLoader,
  getReportsActivityByTeacherError,
  getReportsActivityByTeacher,
  resetActivityByTeacherAction,
} from './ducks'

import columns from './static/json/tableColumns.json'

const ActivityByTeacher = ({
  loading,
  error,
  getActivityByTeacherRequest,
  resetActivityByTeacher,
  activityByTeacher,
  settings,
  toggleFilter,
  isCsvDownloading,
}) => {
  const [metricFilter, setMetricFilter] = useState({})

  useEffect(() => () => resetActivityByTeacher(), [])

  useEffect(() => {
    const q = { ...settings.requestFilters }
    if (q.termId || q.reportId) {
      getActivityByTeacherRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings])

  const normalizedMetricInfo = useMemo(
    () =>
      get(activityByTeacher, 'data.result.metricInfo', []).map((item) => {
        const schoolNamesArr = (item.schoolNames || '')
          .split(',')
          .map((o) => o.trim())
        const schoolNames = schoolNamesArr
          .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
          .join(', ')
        return { ...item, schoolNames }
      }),
    [activityByTeacher]
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
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (!normalizedMetricInfo.length) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  return (
    <>
      <StyledCard>
        <StyledH3 fontSize="16px" margin="0 0 10px 10px">
          Activity by Teacher
        </StyledH3>
        <SimpleStackedBarWithLineChartContainer
          data={normalizedMetricInfo}
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
          data={normalizedMetricInfo}
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
    resetActivityByTeacher: resetActivityByTeacherAction,
  }
)

export default enhance(ActivityByTeacher)
