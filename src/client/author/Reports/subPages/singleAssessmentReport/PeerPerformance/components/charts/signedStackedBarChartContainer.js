import React, { useMemo } from 'react'
import Row from "antd/es/Row";
import Col from "antd/es/Col";
import { SignedStackedBarChart } from '../../../../../common/components/charts/signedStackedBarChart'
import { getHSLFromRange1 } from '../../../../../common/util'
import { idToName } from '../../util/transformers'

export const SignedStackedBarChartContainer = ({
  data,
  analyseBy,
  compareBy,
  filter,
  onBarClickCB,
  onResetClickCB,
  bandInfo,
}) => {
  const aboveBelowStandard = 'aboveBelowStandard'
  const proficiencyBand = 'proficiencyBand'

  const sortBandInfo = (sortForLegend) =>
    [...bandInfo].sort((a, b) =>
      !a.aboveStandard && !b.aboveStandard && !sortForLegend
        ? b.threshold - a.threshold
        : a.threshold - b.threshold
    )

  const dataParser = () => {
    const _bandInfo = sortBandInfo()
    const arr = data.map((item) => {
      if (
        filter[item[compareBy === 'group' ? 'groupId' : compareBy]] ||
        Object.keys(filter).length === 0
      ) {
        if (analyseBy === aboveBelowStandard) {
          item.fill_0 = getHSLFromRange1(100)
          item.fill_1 = getHSLFromRange1(0)
        } else if (analyseBy === proficiencyBand) {
          for (let i = 0; i < _bandInfo.length; i++) {
            item[`fill_${i}`] = _bandInfo[i].color
          }
        }
      } else if (analyseBy === aboveBelowStandard) {
        item.fill_0 = '#cccccc'
        item.fill_1 = '#cccccc'
      } else if (analyseBy === proficiencyBand) {
        for (let i = 0; i < _bandInfo.length; i++) {
          item[`fill_${i}`] = '#cccccc'
        }
      }
      return { ...item }
    })
    return arr
  }

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      const { compareBy: _compareBy, compareBylabel } = payload[0].payload
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{`${idToName[_compareBy]}: `}</Col>
            <Col className="tooltip-value">{compareBylabel}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Band: </Col>
            <Col className="tooltip-value">{payload[barIndex].name}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">{'Student (%): '}</Col>
            <Col className="tooltip-value">
              {`${Math.abs(payload[barIndex].value)}% (${
                payload[barIndex].payload[
                  payload[barIndex].dataKey.substring(
                    0,
                    payload[barIndex].dataKey.length - 10
                  )
                ]
              })`}
            </Col>
          </Row>
        </div>
      )
    }
    return false
  }

  const yTickFormatter = () => ''

  const barsLabelFormatter = (val) => {
    if (val !== 0) {
      return `${Math.abs(val)}%`
    }
    return ''
  }

  const getXTickText = (payload, items) => {
    for (const item of items) {
      if (
        item[compareBy === 'group' ? 'groupId' : compareBy] === payload.value
      ) {
        return item.compareBylabel
      }
    }
    return ''
  }

  const chartData = useMemo(() => dataParser(), [data, filter])

  const _onBarClickCB = (key) => {
    onBarClickCB(key)
  }

  const _onResetClickCB = () => {
    onResetClickCB()
  }

  const getChartSpecifics = () => {
    if (analyseBy === aboveBelowStandard) {
      return {
        barsData: [
          {
            key: 'aboveStandardPercentage',
            stackId: 'a',
            fill: getHSLFromRange1(100),
            unit: '%',
            name: 'Above Standard',
          },
          {
            key: 'belowStandardPercentage',
            stackId: 'a',
            fill: getHSLFromRange1(0),
            unit: '%',
            name: 'Below Standard',
          },
        ],
        yAxisLabel: 'Below Standard                Above Standard',
      }
    }
    if (analyseBy === proficiencyBand) {
      const _bandInfo = sortBandInfo()
      const barsData = _bandInfo.map((o) => ({
        key: `${o.name}Percentage`,
        stackId: 'a',
        fill: o.color,
        unit: '%',
        name: o.name,
      }))
      return {
        barsData,
        yAxisLabel: 'Below Standard                Above Standard',
      }
    }
    return {}
  }

  const getLegendPayload = () => {
    if (analyseBy === proficiencyBand) {
      const _bandInfo = sortBandInfo(true)
      return _bandInfo.map((o) => ({
        dataKey: `${o.name}Percentage`,
        id: `${o.name}Percentage`,
        value: o.name,
        type: 'rect',
        color: o.color,
        inactive: false,
      }))
    }
    // NOTE: undefined returned by default
    // for payload to be generated automatically
  }

  const chartSpecifics = getChartSpecifics()
  const legendPayload = getLegendPayload()

  return (
    <SignedStackedBarChart
      margin={{ top: 0, right: 20, left: 20, bottom: 36 }}
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey={compareBy === 'group' ? 'groupId' : compareBy}
      getTooltipJSX={getTooltipJSX}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={_onResetClickCB}
      getXTickText={getXTickText}
      yAxisLabel={chartSpecifics.yAxisLabel}
      yTickFormatter={yTickFormatter}
      barsLabelFormatter={barsLabelFormatter}
      filter={filter}
      legendPayload={legendPayload}
    />
  )
}
