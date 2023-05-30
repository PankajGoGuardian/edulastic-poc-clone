import React, { useEffect, useMemo, useState } from 'react'
import qs from 'qs'
import { WidgetsContainer } from '../common/components/styledComponents'
import { EarlyWarningTable } from './components/Table'
import RiskSummary from '../common/components/RiskSummaryWidget'
import { RiskTimeline } from './components/widgets/RiskTimeline'
import { tableFilterTypes, timeframeFilterKeys } from './utils'
import useTableFilters from './hooks.js/useTableFilters'

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

  const {
    tableFilters,
    setTableFilters,
    getTableDrillDownUrl,
    setTablePagination,
  } = useTableFilters({
    defaultCompareBy: selectedCompareBy,
    location,
    settings,
  })

  useEffect(() => {
    const url = `${location.pathname}?${qs.stringify({
      ...requestFilters,
      ...riskTimelineFilters,
      selectedCompareBy: tableFilters[tableFilterTypes.COMPARE_BY].key,
    })}`
    history.replace(url)
  }, [
    riskTimelineFilters,
    requestFilters,
    tableFilters[tableFilterTypes.COMPARE_BY],
  ])

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
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        getTableDrillDownUrl={getTableDrillDownUrl}
        setTablePagination={setTablePagination}
        selectedCompareBy={selectedCompareBy}
        compareByOptions={compareByOptions}
      />
    </>
  )
}

export default ReportView
