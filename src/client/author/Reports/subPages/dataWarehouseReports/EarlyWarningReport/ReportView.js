import React from 'react'
import { WidgetsContainer } from '../common/components/styledComponents'
import { EarlyWarningTable } from './components/Table'
import RiskSummary from '../common/components/RiskSummaryWidget'
import { RiskTimeline } from './components/widgets/RiskTimeline'

const ReportView = ({
  loc,
  location,
  settings,
  selectedCompareBy,
  compareByOptions,
  setRiskTimelineFilters,
}) => {
  const { riskTimelineFilters } = settings
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
        settings={settings}
        selectedCompareBy={selectedCompareBy}
        compareByOptions={compareByOptions}
      />
    </>
  )
}

export default ReportView
