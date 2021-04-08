import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'

import { SpinLoader } from '@edulastic/common'
import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import EngagementStats from './components/EngagementStats'
import SimpleAreaWithLineChartContainer from './components/SimpleAreaWithLineChartContainer'

import {
  getEngagementSummaryRequestAction,
  getReportsEngagementSummaryLoader,
  getReportsEngagementSummaryError,
  getReportsEngagementSummary,
  resetEngagementSummaryAction,
} from './ducks'

const Engagement = ({
  loading,
  error,
  getEngagementSummaryRequest,
  resetEngagementSummary,
  engagementSummary,
  settings,
}) => {
  useEffect(() => () => resetEngagementSummary(), [])

  useEffect(() => {
    const q = { ...settings.requestFilters }
    if (q.termId || q.reportId) {
      getEngagementSummaryRequest(q)
    }
  }, [settings])

  const [statsData, timelineData] = useMemo(
    () => [
      get(engagementSummary, 'data.result.summaryData', [])[0] || {},
      get(engagementSummary, 'data.result.metricInfo', []),
    ],
    [engagementSummary]
  )

  if (loading) {
    return <SpinLoader position="fixed" />
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (!timelineData.length) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  return (
    <>
      <StyledCard>
        <EngagementStats data={statsData} />
      </StyledCard>
      <StyledCard padding="20px 0 0 0">
        <StyledH3 fontSize="16px" margin="0 0 10px 10px">
          Activity Timeline
        </StyledH3>
        <SimpleAreaWithLineChartContainer data={timelineData} />
      </StyledCard>
    </>
  )
}

const enhance = connect(
  (state) => ({
    loading: getReportsEngagementSummaryLoader(state),
    error: getReportsEngagementSummaryError(state),
    engagementSummary: getReportsEngagementSummary(state),
  }),
  {
    getEngagementSummaryRequest: getEngagementSummaryRequestAction,
    resetEngagementSummary: resetEngagementSummaryAction,
  }
)

export default enhance(Engagement)
