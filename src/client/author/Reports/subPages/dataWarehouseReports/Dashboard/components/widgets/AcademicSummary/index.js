import { dataWarehouseApi } from '@edulastic/api'
import { lightGreen13, lightGrey8, themeColor } from '@edulastic/colors'
import {
  EduElse,
  EduIf,
  EduThen,
  FlexContainer,
  SpinLoader,
  useApiQuery,
} from '@edulastic/common'
import { EXTERNAL_TEST_KEY_SEPARATOR } from '@edulastic/constants/reportUtils/common'
import { isEmpty } from 'lodash'
import qs from 'qs'
import React, { useMemo } from 'react'
import { IconInfo } from '@edulastic/icons'
import { Tooltip } from 'antd'
import SimplePieChart from '../../../../../../common/components/charts/SimplePieChart'
import { DW_MAR_REPORT_URL } from '../../../../../../common/constants/dataWarehouseReports'
import { DashedLine } from '../../../../../../common/styled'
import PieChartLabel from '../../../../common/components/PieChartLabel'
import { PieChartTooltip } from '../../../../common/components/PieChartTooltip'
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

const title = 'Academic Summary and Performance Distribution'

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
    [widgetFilters]
  )

  const isExternalTestTypeSelected = useMemo(
    () =>
      widgetFilters[academicSummaryFiltersTypes.TEST_TYPE]?.key.includes(
        EXTERNAL_TEST_KEY_SEPARATOR
      ),
    [widgetFilters[academicSummaryFiltersTypes.TEST_TYPE]]
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
      selectedPerformanceBand,
      isExternalTestTypeSelected
    )
  }, [data, selectedPerformanceBand])

  const {
    avgScorePercentage,
    aboveStandardPercentage,
    scoreTrendPercentage,
    showFooter,
  } = useMemo(
    () => getAcademicSummaryMetrics(data, isExternalTestTypeSelected),
    [data]
  )
  const scorePrefix = !isExternalTestTypeSelected ? '%' : ''

  const avgScoreCellColor = useMemo(() => {
    const { result: { avgScore, achievementLevel } = {} } = data || {}
    return getCellColor(
      avgScore,
      achievementLevel,
      selectedPerformanceBand,
      isExternalTestTypeSelected
    )
  }, [data, selectedPerformanceBand, isExternalTestTypeSelected])

  const { result: { bandDistribution = [], prePeriod } = {} } = data || {}

  const assessmentTypesForExternalUrl = (
    widgetFilters[academicSummaryFiltersTypes.TEST_TYPE]?.key || ''
  ).split(EXTERNAL_TEST_KEY_SEPARATOR)[0]

  const filtersForExternalUrl = {
    ...settings.requestFilters,
    profileId: widgetFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key,
    assessmentTypes: assessmentTypesForExternalUrl,
  }

  const externalUrl = `${DW_MAR_REPORT_URL}?${qs.stringify(
    filtersForExternalUrl
  )}`

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
                <div className="left-content">
                  <WidgetCell
                    header="AVG. SCORE"
                    value={`${avgScorePercentage}${scorePrefix}`}
                    footer={
                      <Footer
                        isVisible={showFooter}
                        value={scoreTrendPercentage}
                        period={`${trendPeriodLabel}`}
                        showPercentage={!isExternalTestTypeSelected}
                      />
                    }
                    color={avgScoreCellColor}
                    cellType="large"
                    dataCy="avgScorePercentage"
                  />

                  <EduIf condition={!isExternalTestTypeSelected}>
                    <EduThen>
                      <DashedLine
                        dashWidth="1px"
                        height="1px"
                        margin="70px 15px"
                        dashColor={lightGrey8}
                      />
                      <WidgetCell
                        header={
                          <FlexContainer justifyContent="center">
                            STUDENTS IN BANDS &nbsp;&nbsp;
                            <Tooltip title="Total % of students who are in performance bands marked as above or at standard under manage settings.">
                              <IconInfo fill={themeColor} />
                            </Tooltip>
                          </FlexContainer>
                        }
                        subHeader="ABOVE OR AT STANDARD"
                        value={`${aboveStandardPercentage}${scorePrefix}`}
                        color={lightGreen13}
                        cellType="large"
                        dataCy="studentsInBandPercentage"
                      />
                    </EduThen>
                  </EduIf>
                </div>
                <DashedLine
                  dashWidth="1px"
                  height="400px"
                  maxWidth="1px"
                  dashColor={lightGrey8}
                  margin="0"
                />
                <div className="right-content" data-cy="academicPieChart">
                  <SimplePieChart
                    innerRadius={48}
                    outerRadius={100}
                    data={PieChartData}
                    label={<PieChartLabel />}
                    tooltip={<PieChartTooltip />}
                  />
                </div>
              </ContentWrapper>
            </EduThen>
            <EduElse>
              <StyledEmptyContainer
                margin="120px 0"
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
