import { dataWarehouseApi } from '@edulastic/api'
import { lightGrey8 } from '@edulastic/colors'
import {
  EduElse,
  EduIf,
  EduThen,
  SpinLoader,
  useApiQuery,
} from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import { get, isEmpty } from 'lodash'
import React, { useMemo } from 'react'
import SimplePieChart from '../../../../../common/components/charts/SimplePieChart'
import useErrorNotification from '../../../../../common/hooks/useErrorNotification'
import { DashedLine } from '../../../../../common/styled'
import Footer from '../../../common/components/Footer'
import PieChartLabel from '../../../common/components/PieChartLabel'
import {
  Widget,
  ContentWrapper,
  StyledEmptyContainer,
} from '../../../common/components/styledComponents'
import WidgetCell from '../../../common/components/WidgetCell'
import WidgetHeader from '../../../common/components/WidgetHeader'
import { getDateLabel, getTrendPeriodLabel } from '../../../common/utils'
import { getWidgetCellFooterInfo, transformRiskSummaryData } from '../../utils'

const {
  RISK_BAND_COLOR_INFO,
  RISK_BAND_LEVELS,
  RISK_TYPE_OPTIONS,
} = reportUtils.common

const RiskSummary = ({ settings }) => {
  const query = useMemo(
    () => ({
      ...settings.requestFilters,
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

  const title =
    RISK_TYPE_OPTIONS.find(
      (riskType) => riskType.key === settings.requestFilters.riskType
    )?.title || RISK_TYPE_OPTIONS[0].title

  const periodLabel = getTrendPeriodLabel(
    settings.requestFilters.periodType,
    postPeriod
  )

  const hasContent = !loading && !error && postPeriod?.distribution?.length
  const errorMsg = 'Error fetching Risk Summary data.'

  const emptyContainerDesc = error ? errorMsg : 'No Data Available'
  useErrorNotification(errorMsg, error)

  return (
    <Widget>
      <WidgetHeader title={title} date={periodLabel} loading={loading} />
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
                        getFooter={getWidgetCellFooterInfo}
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
                        getFooter={getWidgetCellFooterInfo}
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
