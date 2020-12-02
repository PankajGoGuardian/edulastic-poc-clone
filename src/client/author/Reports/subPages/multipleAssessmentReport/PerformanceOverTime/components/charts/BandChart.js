import React from 'react'
import PropTypes from 'prop-types'
import { find, forEach, round } from 'lodash'
import { SignedStackedBarChart } from '../../../../../common/components/charts/signedStackedBarChart'
import BarTooltipRow from '../../../../../common/components/tooltip/BarTooltipRow'
import { convertToBandData } from '../../utils/transformers'
import { getHSLFromRange1 } from '../../../../../common/util'
import { StyledSignedBarContainer } from '../../../../../common/styled'

const standardInfo = [
  {
    name: 'Below Standard',
    key: 'belowStandard',
    color: getHSLFromRange1(0),
  },
  {
    name: 'Above Standard',
    key: 'aboveStandard',
    color: getHSLFromRange1(100),
  },
]

const getSelectedItems = (items) => {
  const selectedItems = {}

  forEach(items, (item) => {
    selectedItems[item] = true
  })

  return selectedItems
}

const dataParser = (data, bandInfo) => {
  return data.map((item) => {
    for (let i = 0; i < bandInfo.length; i++) {
      item[`fill_${i}`] = getHSLFromRange1(
        round((100 / (bandInfo.length - 1)) * i)
      )
    }
    return { ...item }
  })
}

const yTickFormatter = () => {
  return ''
}

const barsLabelFormatter = (val) => {
  if (val >= 12 || val <= -12) {
    return `${Math.abs(val)}%`
  }
  return ''
}

const getChartSpecifics = (analyseBy, bandInfo) => {
  bandInfo.sort((a, b) => {
    return a.threshold - b.threshold
  })

  const barsData = []

  if (analyseBy === 'standard') {
    forEach(standardInfo, (value) => {
      barsData.push({
        key: `${value.key} Percentage`,
        stackId: 'a',
        fill: value.color,
        unit: '%',
        name: value.name,
      })
    })
  } else {
    forEach(bandInfo, (value) => {
      barsData.push({
        key: `${value.name} Percentage`,
        stackId: 'a',
        fill: value.color,
        unit: '%',
        name: value.name,
      })
    })
  }

  return {
    barsData,
    yAxisLabel: 'Below Standard                Above Standard',
  }
}

const BandChart = ({
  data,
  bandInfo,
  selectedTests,
  analyseBy,
  onBarClickCB,
  onResetClickCB,
  backendPagination,
  setBackendPagination,
}) => {
  const xAxisDataKey = 'uniqId'

  const orderedBandInfo = bandInfo.sort((a, b) => {
    return a.threshold - b.threshold
  })

  const dataWithBandInfo = convertToBandData(data, orderedBandInfo)
  const dataWithBandColors = dataParser(dataWithBandInfo, orderedBandInfo)

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      const { testName = '' } = payload[0].payload
      const currentPayload = payload[barIndex] || {}
      return (
        <div>
          <BarTooltipRow title="Assessment : " value={testName || 'N/A'} />
          <BarTooltipRow title="Band : " value={currentPayload.name || 'N/A'} />
          <BarTooltipRow
            title="Student (%): "
            value={`${Math.abs(currentPayload.value)} %`}
          />
        </div>
      )
    }
    return false
  }

  const _onBarClickCB = (key) => {
    const clickedBarData =
      find(dataWithBandColors, (item) => item[xAxisDataKey] === key) || {}
    onBarClickCB(clickedBarData)
  }

  const getXTickText = (payload, _data) => {
    const currentBarData =
      find(_data, (item) => item[xAxisDataKey] === payload.value) || {}
    return currentBarData.testName || ''
  }

  const chartSpecifics = getChartSpecifics(analyseBy, orderedBandInfo)

  return (
    <StyledSignedBarContainer>
      <SignedStackedBarChart
        data={dataWithBandColors}
        barsData={chartSpecifics.barsData}
        xAxisDataKey={xAxisDataKey}
        getTooltipJSX={getTooltipJSX}
        barsLabelFormatter={barsLabelFormatter}
        yTickFormatter={yTickFormatter}
        yAxisLabel={chartSpecifics.yAxisLabel}
        getXTickText={getXTickText}
        filter={getSelectedItems(selectedTests)}
        onBarClickCB={_onBarClickCB}
        onResetClickCB={onResetClickCB}
        margin={{ top: 0, right: 20, left: 20, bottom: 40 }}
        backendPagination={backendPagination}
        setBackendPagination={setBackendPagination}
      />
    </StyledSignedBarContainer>
  )
}

BandChart.propTypes = {
  data: PropTypes.array.isRequired,
  bandInfo: PropTypes.array.isRequired,
  selectedTests: PropTypes.array,
  onBarClickCB: PropTypes.func,
  onResetClickCB: PropTypes.func,
  analyseBy: PropTypes.string,
}

BandChart.defaultProps = {
  selectedTests: [],
  onBarClickCB: () => {},
  onResetClickCB: () => {},
  analyseBy: 'standard',
}

export default BandChart
