import React from 'react'
import next from 'immer'
import { find, sumBy, indexOf } from 'lodash'
import { getTicks, getMasteryLevel } from '../../utils/transformers'
import BarTooltipRow from '../../../../../common/components/tooltip/BarTooltipRow'
import { SimpleStackedBarChart } from '../../../../../common/components/charts/simpleStackedBarChart'
import { StyledChartContainer } from '../styled'
import { StyledH3 } from '../../../../../common/styled'

const _yTickFormatter = (text) => text

const StandardsPerformanceChart = ({
  data,
  selectedDomains,
  setSelectedDomains,
  filterValues,
  filterOptions,
  onFilterChange,
  maxMasteryScore,
  rawDomainData,
  scaleInfo,
  ...chartProps
}) => {
  const ticks = getTicks(maxMasteryScore)

  const getTooltipJSX = (_data) => {
    const [domain = {}] = _data
    const { payload = {} } = domain
    const domainInfo =
      find(rawDomainData, (d) => `${d.tloId}` === `${payload.domainId}`) || {}
    const studentCount = sumBy(payload.records, (record) =>
      parseInt(record.totalStudents, 10)
    )

    return (
      <div>
        <BarTooltipRow title="Domain: " value={payload.domainName} />
        <BarTooltipRow title="Description: " value={domainInfo.description} />
        <BarTooltipRow
          title="Avg Mastery Score: "
          value={payload.masteryScore}
        />
        <BarTooltipRow
          title="Mastery Level: "
          value={getMasteryLevel(payload.masteryScore, scaleInfo).masteryName}
        />
        <BarTooltipRow title="Student #: " value={studentCount} />
      </div>
    )
  }

  const onClickBarData = (selectedLabel) => {
    const selectedDomain = find(
      data,
      (domain) => domain.domainName === selectedLabel
    )

    if (!selectedDomain) {
      return
    }

    const modifiedState = next(selectedDomains, (draft) => {
      const index = indexOf(draft, selectedDomain.domainId)
      if (index > -1) {
        draft.splice(index, 1)
      } else {
        draft.push(selectedDomain.domainId)
      }
    })

    setSelectedDomains(modifiedState)
  }

  return (
    <>
      <StyledH3>Mastery Level Distribution by Domain</StyledH3>
      <StyledChartContainer>
        <SimpleStackedBarChart
          margin={{ top: 10, right: 60, left: 60, bottom: 0 }}
          xAxisDataKey="domainName"
          bottomStackDataKey="masteryScore"
          topStackDataKey="diffMasteryScore"
          yAxisLabel="Avg. Mastery Score"
          yTickFormatter={_yTickFormatter}
          barsLabelFormatter={_yTickFormatter}
          onBarClickCB={onClickBarData}
          onResetClickCB={() => setSelectedDomains([])}
          getTooltipJSX={getTooltipJSX}
          yDomain={[0, +maxMasteryScore + 0.1]}
          data={data}
          ticks={ticks}
          filter={selectedDomains}
          {...chartProps}
        />
      </StyledChartContainer>
    </>
  )
}

export default StandardsPerformanceChart
