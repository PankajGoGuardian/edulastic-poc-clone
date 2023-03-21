import { dataWarehouseApi } from '@edulastic/api'
import { lightGrey8 } from '@edulastic/colors'
import { useApiQuery } from '@edulastic/common'
import { Spin } from 'antd'
import React, { useMemo } from 'react'
import SimplePieChart from '../../../../../../common/components/charts/SimplePieChart'
import { DashedLine, NoDataContainer } from '../../../../../../common/styled'
import {
  getCellColor,
  getAcademicSummaryPieChartData,
  getAcademicSummaryChartLabelJSX,
  academicSummaryFiltersTypes,
  getAcademicSummaryMetrics,
} from '../../../utils'
import { ContentWrapper, Widget } from '../../common/styledComponents'
import WidgetCell from '../common/WidgetCell'
import WidgetHeader from '../common/WidgetHeader'
import AcademicSummaryWidgetFilters from './Filters'

const title = 'ACADEMIC SUMMARY AND PERFORMANCE DISTRIBUTION'

const AcademicSummary = ({
  selectedPerformanceBand,
  performanceBandList,
  availableTestTypes,
  widgetFilters,
  setWidgetFilters,
  settings,
}) => {
  const query = useMemo(
    () => ({
      ...settings.requestFilters,
      [academicSummaryFiltersTypes.PERFORMANCE_BAND]:
        widgetFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key,
      [academicSummaryFiltersTypes.TEST_TYPE]:
        widgetFilters[academicSummaryFiltersTypes.TEST_TYPE]?.key,
    }),
    [widgetFilters, settings.requestFilters]
  )
  const {
    data,
    loading,
    error,
  } = useApiQuery(dataWarehouseApi.getDashboardAcademicSummary, [query])
  if (!data) {
    return <NoDataContainer />
  }
  // @Todo handle data transformation properly
  const { result: { avgScore, bandDistribution } = {} } = data.data || {}
  const {
    avgScorePercentage,
    aboveStandardPercentage,
    scoreTrendPercentage,
  } = getAcademicSummaryMetrics(data.data)

  const avgScoreCellColor = data
    ? getCellColor(avgScore, selectedPerformanceBand)
    : null
  const PieChartData = getAcademicSummaryPieChartData(
    bandDistribution,
    selectedPerformanceBand
  )

  return (
    <Spin spinning={loading}>
      {!data ? (
        <NoDataContainer />
      ) : error ? (
        <NoDataContainer />
      ) : (
        <Widget>
          <WidgetHeader title={title} />
          <AcademicSummaryWidgetFilters
            filters={widgetFilters}
            setFilters={setWidgetFilters}
            performanceBandsList={performanceBandList}
            availableTestTypes={availableTestTypes}
          />
          <ContentWrapper>
            <div>
              <WidgetCell
                header="AVG. SCORE"
                value={`${avgScorePercentage}%`}
                footer={scoreTrendPercentage}
                subFooter="vs Dec'22"
                color={avgScoreCellColor}
              />
              <DashedLine
                dashWidth="1px"
                height="1px"
                margin="20px 5px"
                dashColor={lightGrey8}
              />
              <WidgetCell
                header="ABOVE STANDARD"
                value={`${aboveStandardPercentage}%`}
                color="#cef5d8"
              />
            </div>
            <DashedLine
              dashWidth="1px"
              height="250px"
              maxWidth="1px"
              dashColor={lightGrey8}
              margin="0 10px"
            />
            <SimplePieChart
              data={PieChartData}
              getChartLabelJSX={getAcademicSummaryChartLabelJSX}
            />
          </ContentWrapper>
        </Widget>
      )}
    </Spin>
  )
}

export default AcademicSummary
