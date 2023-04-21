import { dataWarehouseApi } from '@edulastic/api'
import { lightGreen13, lightGrey8 } from '@edulastic/colors'
import {
  EduElse,
  EduIf,
  EduThen,
  SpinLoader,
  useApiQuery,
} from '@edulastic/common'
import { isEmpty } from 'lodash'
import qs from 'qs'
import React, { useMemo } from 'react'
import SimplePieChart from '../../../../../../common/components/charts/SimplePieChart'
import { DW_MAR_REPORT_URL } from '../../../../../../common/constants/dataWarehouseReports'
import { DashedLine } from '../../../../../../common/styled'
import PieChartLabel from '../../../../common/components/PieChartLabel'
import { getTrendPeriodLabel } from '../../../../common/utils'
import {
  getCellColor,
  getAcademicSummaryPieChartData,
  academicSummaryFiltersTypes,
  getAcademicSummaryMetrics,
  getFilteredAcademicSummaryTestTypes,
  trendPeriodDateFormat,
  trendPeriodPrefix,
} from '../../../utils'
import {
  Widget,
  ContentWrapper,
  StyledEmptyContainer,
} from '../../../../common/components/styledComponents'
import WidgetCell from '../../../../common/components/WidgetCell'
import WidgetHeader from '../../../../common/components/WidgetHeader'
import AcademicSummaryWidgetFilters from './Filters'
import Footer from '../../../../common/components/Footer'
import useErrorNotification from '../../../../../../common/hooks/useErrorNotification'

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
      deDuplicate: false,
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
    showFooter,
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

  const trendPeriodLabel = showFooter
    ? getTrendPeriodLabel(
        settings.requestFilters.periodType,
        prePeriod,
        trendPeriodPrefix,
        trendPeriodDateFormat
      )
    : ''

  const hasContent = !isEmpty(bandDistribution)
  const errorMsg = 'Error fetching Academic Summary data.'

  const emptyContainerDesc = error ? errorMsg : 'No Data Available'
  useErrorNotification(errorMsg, error)

  return (
    <Widget aspectRatio="16 / 13" minWidth="680px">
      <WidgetHeader title={title} url={externalUrl} />
      <AcademicSummaryWidgetFilters
        filters={widgetFilters}
        setFilters={setWidgetFilters}
        performanceBandsList={performanceBandList}
        availableTestTypes={filteredAvailableTestTypes}
      />
      <EduIf condition={loading}>
        <EduThen>
          <SpinLoader
            tip="Loading Academic Summary Data"
            height="60%"
            position="relative"
          />
        </EduThen>
        <EduElse>
          <EduIf condition={hasContent}>
            <EduThen>
              <ContentWrapper>
                <div>
                  <WidgetCell
                    header="AVG. SCORE"
                    value={`${avgScorePercentage}%`}
                    footer={
                      <Footer
                        isVisible={showFooter}
                        value={scoreTrendPercentage}
                        period={`${trendPeriodLabel}`}
                        showPercentage
                      />
                    }
                    color={avgScoreCellColor}
                    cellType="large"
                  />
                  <DashedLine
                    dashWidth="1px"
                    height="1px"
                    margin="70px 5px"
                    dashColor={lightGrey8}
                  />
                  <WidgetCell
                    header="ABOVE STANDARD"
                    value={`${aboveStandardPercentage}%`}
                    color={lightGreen13}
                    cellType="large"
                  />
                </div>
                <DashedLine
                  dashWidth="1px"
                  height="400px"
                  maxWidth="1px"
                  dashColor={lightGrey8}
                  margin="0"
                />
                <SimplePieChart
                  innerRadius={40}
                  outerRadius={85}
                  data={PieChartData}
                  getChartLabelJSX={PieChartLabel}
                />
              </ContentWrapper>
            </EduThen>
            <EduElse>
              <StyledEmptyContainer
                margin="25% 0"
                description={emptyContainerDesc}
              />
            </EduElse>
          </EduIf>
        </EduElse>
      </EduIf>
    </Widget>
  )
}

export default AcademicSummary
