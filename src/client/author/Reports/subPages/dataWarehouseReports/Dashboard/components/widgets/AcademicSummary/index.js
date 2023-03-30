import { dataWarehouseApi } from '@edulastic/api'
import { lightGreen13, lightGrey8 } from '@edulastic/colors'
import { EduElse, EduIf, EduThen, useApiQuery } from '@edulastic/common'
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
  getFilteredAcademicSummaryTestTypes,
  getDateLabel,
} from '../../../utils'
import {
  ContentWrapper,
  DataSizeExceededContainer,
  StyledEmptyContainer,
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
  const filteredAvailableTestTypes = useMemo(
    () =>
      getFilteredAcademicSummaryTestTypes(
        settings.requestFilters.assessmentTypes,
        availableTestTypes
      ),
    [settings.requestFilters.assessmentTypes, availableTestTypes]
  )

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

  const { data, loading, error } = useApiQuery(
    dataWarehouseApi.getDashboardAcademicSummary,
    [query],
    {
      enabled: !isEmpty(settings.requestFilters) && !isEmpty(widgetFilters),
    }
  )

  const PieChartData = useMemo(() => {
    const { result: { bandDistribution = [] } = {} } = data || {}
    return getAcademicSummaryPieChartData(
      bandDistribution,
      selectedPerformanceBand
    )
  }, [data, selectedPerformanceBand])

  const {
    avgScorePercentage,
    aboveStandardPercentage,
    scoreTrendPercentage,
  } = useMemo(() => getAcademicSummaryMetrics(data), [data])

  const avgScoreCellColor = useMemo(() => {
    const { result: { avgScore } = {} } = data || {}
    return getCellColor(avgScore, selectedPerformanceBand)
  }, [data, selectedPerformanceBand])

  const { result: { bandDistribution = [], prePeriod } = {} } = data || {}

  const _filters = {
    ...settings.requestFilters,
    profileId: widgetFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key,
    assessmentTypes: widgetFilters[academicSummaryFiltersTypes.TEST_TYPE]?.key,
  }

  const externalUrl = `${DW_MAR_REPORT_URL}?${qs.stringify(_filters)}`

  const prePeriodDateLabel = getDateLabel(prePeriod)

  return (
    <Widget>
      <WidgetHeader title={title} url={externalUrl} />
      <AcademicSummaryWidgetFilters
        filters={widgetFilters}
        setFilters={setWidgetFilters}
        performanceBandsList={performanceBandList}
        availableTestTypes={filteredAvailableTestTypes}
      />
      <Spin spinning={loading}>
        <EduIf condition={!loading}>
          <EduThen>
            <EduIf condition={!error && !isEmpty(bandDistribution)}>
              <EduThen>
                <ContentWrapper>
                  <div>
                    <WidgetCell
                      header="AVG. SCORE"
                      value={`${avgScorePercentage}%`}
                      footer={scoreTrendPercentage}
                      subFooter={`since ${prePeriodDateLabel}`}
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
              </EduThen>
              <EduElse>
                <EduIf condition={data?.dataSizeExceeded}>
                  <EduThen>
                    <DataSizeExceededContainer>
                      {data?.message}
                    </DataSizeExceededContainer>
                  </EduThen>
                  <EduElse>
                    <StyledEmptyContainer />
                  </EduElse>
                </EduIf>
              </EduElse>
            </EduIf>
          </EduThen>
          <EduElse>
            <StyledEmptyContainer />
          </EduElse>
        </EduIf>
      </Spin>
    </Widget>
  )
}

export default AcademicSummary
