import React from 'react'
import { MasonGrid } from '../common/components/styledComponents'
import { EarlyWarningTable } from './components/Table'
import RiskSummary from './components/widgets/RiskSummary'
import { RiskTimeline } from './components/widgets/RiskTimeline'

const ReportView = ({
  location,
  settings,
  selectedCompareBy,
  compareByOptions,
  setRiskTimelineFilters,
}) => {
  const { riskTimelineFilters } = settings
  return (
    <>
      <MasonGrid>
        <RiskSummary settings={settings} />
        <RiskTimeline
          settings={settings}
          setWidgetFilters={setRiskTimelineFilters}
          widgetFilters={riskTimelineFilters}
        />
      </MasonGrid>
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
