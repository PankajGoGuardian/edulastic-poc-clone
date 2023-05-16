import React, { useEffect, useMemo, useState } from 'react'
import qs from 'qs'
import { WidgetsContainer } from '../common/components/styledComponents'
import { EarlyWarningTable } from './components/Table'
import RiskSummary from '../common/components/RiskSummaryWidget'
import { RiskTimeline } from './components/widgets/RiskTimeline'
import { timeframeFilterKeys } from './utils'

const ReportView = ({
  loc,
  location,
  settings,
  selectedCompareBy,
  compareByOptions,
  history,
  search,
}) => {
  const { requestFilters } = settings
  const [riskTimelineFilters, setRiskTimelineFilters] = useState({
    showCumulativeData: search.showCumulativeData
      ? search.showCumulativeData === String(true)
      : false,
    timeframe: search.timeframe ?? timeframeFilterKeys.MONTHLY,
  })

  useEffect(() => {
    const url = `${location.pathname}?${qs.stringify({
      ...requestFilters,
      ...riskTimelineFilters,
    })}`
    history.replace(url)
  }, [riskTimelineFilters, requestFilters])

  const tableSettings = useMemo(
    () => ({
      ...settings,
      riskTimelineFilters,
    }),
    [settings, riskTimelineFilters]
  )

  return (
    <>
      <WidgetsContainer>
        <RiskSummary loc={loc} settings={settings} />
        <RiskTimeline
          settings={settings}
          setWidgetFilters={setRiskTimelineFilters}
          widgetFilters={riskTimelineFilters}
        />
      </WidgetsContainer>
      <EarlyWarningTable
        location={location}
        settings={tableSettings}
        selectedCompareBy={selectedCompareBy}
        compareByOptions={compareByOptions}
      />
    </>
  )
}

export default ReportView
