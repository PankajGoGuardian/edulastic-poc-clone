import React, { useEffect } from 'react'
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
  useEffect(() => {
    const q = { ...settings.requestFilters }
    if (q.termId || q.reportId) {
      getActivityByTeacherRequest(q)
    }
  }, [settings])

  const metricInfo = get(activityByTeacher, 'data.result.metricInfo', [])

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
          activityBy="teacher"
        />
      </StyledCard>
      <StyledCard>
        <ActivityTable
          activityBy="teacher"
          isCsvDownloading={isCsvDownloading}
          dataSource={metricInfo}
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
