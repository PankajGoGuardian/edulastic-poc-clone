import React, { useEffect, useMemo, useState } from 'react'
import qs from 'qs'
import { WidgetsContainer } from '../common/components/styledComponents'
import { EarlyWarningTable } from './components/Table'
import RiskSummary from '../common/components/RiskSummaryWidget'
import { RiskTimeline } from './components/widgets/RiskTimeline'
import { tableFilterTypes, timeframeFilterKeys } from './utils'
import useTableFilters from './hooks/useTableFilters'

const ReportView = ({
  loc,
  location,
  isPrinting,
  settings,
  selectedCompareBy,
  compareByOptions,
  history,
  search,
  feedTypes,
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
    const query = {
      ...requestFilters,
      ...riskTimelineFilters,
      selectedCompareBy: tableFilters[tableFilterTypes.COMPARE_BY].key,
    }
    const url = `${location.pathname}?${qs.stringify(query, {
      arrayFormat: 'comma',
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
          isPrinting={isPrinting}
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
        feedTypes={feedTypes}
      />
    </>
  )
}

export default ReportView
