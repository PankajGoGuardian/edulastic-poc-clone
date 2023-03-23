import { dataWarehouseApi } from '@edulastic/api'
import { lightGreen13, lightGrey8 } from '@edulastic/colors'
import { EduIf, useApiQuery } from '@edulastic/common'
import { Spin } from 'antd'
import { isEmpty } from 'lodash'
import qs from 'qs'
import React, { useMemo } from 'react'
import SimplePieChart from '../../../../../../common/components/charts/SimplePieChart'
import { DW_MAR_REPORT_URL } from '../../../../../../common/constants/dataWarehouseReports'
import { DashedLine } from '../../../../../../common/styled'
import {
  getCellColor,
  getAcademicSummaryPieChartData,
  getAcademicSummaryChartLabelJSX,
  academicSummaryFiltersTypes,
  getAcademicSummaryMetrics,
  filterPopupFilterSelectedTestTypes,
} from '../../../utils'
import {
  ContentWrapper,
  NoDataContainer,
  Widget,
} from '../../common/styledComponents'
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

  const filteredAvailableTestTypes = useMemo(
    () =>
      filterPopupFilterSelectedTestTypes(
        settings.requestFilters.assessmentTypes,
        availableTestTypes
      ),
    [settings.requestFilters.assessmentTypes]
  )

  const {
    data,
    loading,
    error,
  } = useApiQuery(dataWarehouseApi.getDashboardAcademicSummary, [query])

  const { result: { avgScore, bandDistribution = [] } = {} } = data || {}
  const {
    avgScorePercentage,
    aboveStandardPercentage,
    scoreTrendPercentage,
  } = getAcademicSummaryMetrics(data)

  const avgScoreCellColor = data
    ? getCellColor(avgScore, selectedPerformanceBand)
    : null
  const PieChartData = getAcademicSummaryPieChartData(
    bandDistribution,
    selectedPerformanceBand
  )

  const _filters = { ...settings.requestFilters }
  _filters.profileId =
    widgetFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key

  const externalUrl = `${DW_MAR_REPORT_URL}?${qs.stringify(_filters)}`
  const showNoDataContainer = error || isEmpty(bandDistribution)
  const noDataContainerText = data?.dataSizeExceeded
    ? data?.message
    : 'No data available.'

  return (
    <Spin spinning={loading}>
      <Widget>
        <WidgetHeader title={title} url={externalUrl} />
        <AcademicSummaryWidgetFilters
          filters={widgetFilters}
          setFilters={setWidgetFilters}
          performanceBandsList={performanceBandList}
          availableTestTypes={filteredAvailableTestTypes}
        />
        <EduIf condition={!loading && !showNoDataContainer}>
          <ContentWrapper>
            <div>
              <WidgetCell
                header="AVG. SCORE"
                value={`${avgScorePercentage}%`}
                footer={scoreTrendPercentage}
                subFooter="vs Dec'22" // TODO use from API
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
                color={lightGreen13}
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
        </EduIf>
        <EduIf condition={!loading && showNoDataContainer}>
          <NoDataContainer>{noDataContainerText}</NoDataContainer>
        </EduIf>
      </Widget>
    </Spin>
  )
}

export default AcademicSummary
