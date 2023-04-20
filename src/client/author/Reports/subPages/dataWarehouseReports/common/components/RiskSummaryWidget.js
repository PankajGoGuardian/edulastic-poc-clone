import { dataWarehouseApi } from '@edulastic/api'
import { lightGrey8 } from '@edulastic/colors'
import {
  EduElse,
  EduIf,
  EduThen,
  FlexContainer,
  SpinLoader,
  useApiQuery,
} from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import { reportNavType } from '@edulastic/constants/const/report'
import { get, isEmpty } from 'lodash'
import React, { useMemo } from 'react'
import qs from 'qs'
import SimplePieChart from '../../../../common/components/charts/SimplePieChart'
import useErrorNotification from '../../../../common/hooks/useErrorNotification'
import { DashedLine } from '../../../../common/styled'
import Footer from './Footer'
import PieChartLabel from './PieChartLabel'
import {
  Widget,
  ContentWrapper,
  StyledEmptyContainer,
  StyledText,
} from './styledComponents'
import WidgetCell from './WidgetCell'
import WidgetHeader from './WidgetHeader'
import { getDateLabel, getTrendPeriodLabel } from '../utils'
import { transformRiskSummaryData } from '../../EarlyWarningReport/utils'
import { DW_EARLY_WARNING_REPORT_URL } from '../../../../common/constants/dataWarehouseReports'

const {
  RISK_BAND_COLOR_INFO,
  RISK_BAND_LEVELS,
  RISK_TYPE_OPTIONS,
  RISK_TYPE_KEYS,
} = reportUtils.common

const RiskSummary = ({ settings, loc = '' }) => {
  const query = useMemo(
    () => ({
      ...settings.requestFilters,
      riskType: settings.requestFilters.riskType || RISK_TYPE_KEYS.OVERALL,
    }),
    [settings.requestFilters]
  )
  const { data, loading, error } = useApiQuery(
    dataWarehouseApi.getEarlyWarningRiskSummary,
    [query],
    {
      enabled: !isEmpty(settings.requestFilters),
      deDuplicate: false,
    }
  )

  const { prePeriod = {}, postPeriod = {} } = get(data, 'data.result', {})
  const {
    postPeriodhighRisk,
    highRiskChange,
    postPeriodMediumRisk,
    mediumRiskChange,
    pieChartData,
  } = transformRiskSummaryData(prePeriod, postPeriod)

  const prePeriodDateLabel = getDateLabel(prePeriod)
  const periodLabel = getTrendPeriodLabel(
    settings.requestFilters.periodType,
    postPeriod
  )

  const title =
    RISK_TYPE_OPTIONS.find(
      (riskType) => riskType.key === settings.requestFilters.riskType
    )?.title || RISK_TYPE_OPTIONS[0].title

  const hasContent = !loading && !error && postPeriod?.distribution?.length
  const errorMsg = 'Error fetching Risk Summary data.'
  const emptyContainerDesc = error ? errorMsg : 'No Data Available'
  useErrorNotification(errorMsg, error)

  const widgetWidth =
    loc === reportNavType.DW_EARLY_WARNING_REPORT ? '40%' : '100%'
  const externalUrl = `${DW_EARLY_WARNING_REPORT_URL}?${qs.stringify(
    settings.requestFilters
  )}`

  return (
    <Widget width={widgetWidth}>
      <FlexContainer justifyContent="left" alignItems="center">
        <WidgetHeader
          title={title}
          date={periodLabel}
          loading={loading}
          url={externalUrl}
        >
          <StyledText>{periodLabel}</StyledText>
        </WidgetHeader>
      </FlexContainer>
      <EduIf condition={loading}>
        <EduThen>
          <SpinLoader
            tip="Loading Risk Summary Data"
            height="80%"
            position="relative"
          />
        </EduThen>
        <EduElse>
          <EduIf condition={hasContent}>
            <EduThen>
              <ContentWrapper>
                <div>
                  <WidgetCell
                    header="HIGH RISK"
                    value={postPeriodhighRisk}
                    color={RISK_BAND_COLOR_INFO[RISK_BAND_LEVELS.HIGH]}
                    footer={
                      <Footer
                        value={highRiskChange}
                        period={`vs ${prePeriodDateLabel}`}
                        showReverseTrend
                      />
                    }
                  />
                  <DashedLine
                    dashWidth="1px"
                    height="1px"
                    margin="40% 0"
                    dashColor={lightGrey8}
                  />
                  <WidgetCell
                    header="MEDIUM RISK"
                    value={postPeriodMediumRisk}
                    color={RISK_BAND_COLOR_INFO[RISK_BAND_LEVELS.MEDIUM]}
                    footer={
                      <Footer
                        value={mediumRiskChange}
                        period={`vs ${prePeriodDateLabel}`}
                        showReverseTrend
                      />
                    }
                  />
                </div>
                <DashedLine
                  dashWidth="1px"
                  height="295px"
                  maxWidth="1px"
                  dashColor={lightGrey8}
                  margin="0"
                />
                <SimplePieChart
                  data={pieChartData}
                  getChartLabelJSX={PieChartLabel}
                  innerRadius={42}
                  outerRadius={90}
                />
              </ContentWrapper>
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

export default RiskSummary
