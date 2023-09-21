import React, { useMemo } from 'react'
import { dataWarehouseApi } from '@edulastic/api'
import { isEmpty } from 'lodash'
import {
  useApiQuery,
  EduIf,
  EduThen,
  EduElse,
  SpinLoader,
  FlexContainer,
} from '@edulastic/common'
import { stringifyArrayFilters } from '@edulastic/constants/reportUtils/common'
import {
  Widget,
  StyledEmptyContainer,
} from '../../../../common/components/styledComponents'
import WidgetHeader from '../../../../common/components/WidgetHeader'
import RiskTimelineFilters from './RiskTimelineFilters'
import SimpleLineChart from '../../../../../../common/components/charts/SimpleLineChart'
import {
  getTimelineChartData,
  CHART_LABEL_KEY,
  CHART_LINES,
} from '../../../utils'
import useErrorNotification from '../../../../../../common/hooks/useErrorNotification'
import { Spacer } from '../../../../../../../../common/styled'
import {
  ChartLegendItem,
  ChartLegendPill,
} from '../../../../../../common/components/charts/styled-components'

const title = 'Risk Over Time'

/**
 * function to render custom chart legend for AssessmentsChart
 * @param {Object} payload - legend payload for chart
 */
const renderLegend = ({ payload }) => (
  <FlexContainer justifyContent="flex-end">
    {payload
      .filter(({ inactive }) => !inactive)
      .map(({ value, color }, index) => {
        return (
          <ChartLegendItem key={`item-${index}`}>
            <ChartLegendPill color={color} />
            {`${value} RISK`.toUpperCase()}
          </ChartLegendItem>
        )
      })}
  </FlexContainer>
)

const RiskTimeline = ({ settings, widgetFilters, setWidgetFilters }) => {
  const query = useMemo(
    () =>
      stringifyArrayFilters({
        ...settings.requestFilters,
        ...widgetFilters,
      }),
    [settings.requestFilters, widgetFilters]
  )

  const { data, loading, error } = useApiQuery(
    dataWarehouseApi.getRiskTimeline,
    [query],
    {
      enabled: !isEmpty(settings.requestFilters) && !isEmpty(widgetFilters),
      deDuplicate: false,
    }
  )

  const chartData = useMemo(() => getTimelineChartData(data, widgetFilters), [
    data,
    widgetFilters,
  ])
  const xAxisInterval = useMemo(
    () => (chartData.length > 6 ? 1 : 'preserveStartEnd'),
    [chartData]
  )

  const hasContent = !loading && !error && !!chartData.length
  const errorMsg =
    error?.response?.status === 400
      ? error?.message
      : 'Sorry, you have hit an unexpected error.'
  const emptyContainerDesc = error ? errorMsg : 'No Data Available'
  useErrorNotification(errorMsg, error)

  return (
    <Widget>
      <FlexContainer justifyContent="space-between">
        <WidgetHeader title={title}>
          <Spacer />
          <RiskTimelineFilters
            filters={widgetFilters}
            setWidgetFilters={setWidgetFilters}
          />
        </WidgetHeader>
      </FlexContainer>

      <EduIf condition={loading}>
        <EduThen>
          <SpinLoader
            tip="Loading Risk Timeline"
            height="80%"
            position="relative"
          />
        </EduThen>
        <EduElse>
          <EduIf condition={hasContent}>
            <EduThen>
              <FlexContainer padding="20px 20px 50px 20px" height="100%">
                <SimpleLineChart
                  data={chartData}
                  xAxisLabelKey={CHART_LABEL_KEY}
                  lines={CHART_LINES}
                  xAxisTicks={[0, 20, 40, 60, 80, 100]}
                  xAxisInterval={xAxisInterval}
                  yAxisLabel="PERCENTAGE OF STUDENTS"
                  legendProps={{ content: renderLegend }}
                />
              </FlexContainer>
            </EduThen>
            <EduElse>
              <StyledEmptyContainer
                margin="12% 0"
                description={emptyContainerDesc}
              />
            </EduElse>
          </EduIf>
        </EduElse>
      </EduIf>
    </Widget>
  )
}

export default RiskTimeline
