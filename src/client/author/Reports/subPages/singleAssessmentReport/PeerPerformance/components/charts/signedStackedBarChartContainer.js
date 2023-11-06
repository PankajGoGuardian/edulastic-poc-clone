import React, { useMemo } from 'react'
import { Row, Col } from 'antd'
import { isEmpty, isNaN } from 'lodash'
import { reportUtils } from '@edulastic/constants'
import { FlexContainer } from '@edulastic/common'
import { IconInfo } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { SignedStackedBarChart } from '../../../../../common/components/charts/signedStackedBarChart'
import { getHSLFromRange1 } from '../../../../../common/util'
import { idToName } from '../../util/transformers'

const { analyseByOptions } = reportUtils.peerPerformance

export const SignedStackedBarChartContainer = ({
  data,
  analyseBy,
  compareBy,
  filter,
  onBarClickCB,
  onResetClickCB,
  bandInfo = [],
  chartProps,
}) => {
  const sortBandInfo = (sortForLegend) =>
    [...bandInfo].sort((a, b) =>
      !a.aboveStandard && !b.aboveStandard && !sortForLegend
        ? b.threshold - a.threshold
        : a.threshold - b.threshold
    )

  const dataParser = () => {
    const _bandInfo = sortBandInfo()
    const arr = data.map((item) => {
      if (filter[item?.dimension?._id] || Object.keys(filter).length === 0) {
        if (analyseBy === analyseByOptions.aboveBelowStandard) {
          item.fill_0 = getHSLFromRange1(100)
          item.fill_1 = getHSLFromRange1(0)
        } else if (analyseBy === analyseByOptions.proficiencyBand) {
          for (let i = 0; i < _bandInfo.length; i++) {
            item[`fill_${i}`] = _bandInfo[i].color
          }
        }
      } else if (analyseBy === analyseByOptions.aboveBelowStandard) {
        item.fill_0 = '#cccccc'
        item.fill_1 = '#cccccc'
      } else if (analyseBy === analyseByOptions.proficiencyBand) {
        for (let i = 0; i < _bandInfo.length; i++) {
          item[`fill_${i}`] = '#cccccc'
        }
      }
      return { ...item }
    })
    return arr
  }

  const getTooltipJSX = (payload, barIndex) => {
    if (!isEmpty(payload) && barIndex !== null && barIndex < payload.length) {
      const { dimension } = payload[0].payload
      return (
        <div>
          <Row className="tooltip-row" type="flex" justify="start">
            <Col className="tooltip-key">{`${idToName(compareBy)}: `}</Col>
            <Col className="tooltip-value">{dimension.name}</Col>
          </Row>
          <Row className="tooltip-row" type="flex" justify="start">
            <Col className="tooltip-key">Band: </Col>
            <Col className="tooltip-value">{payload[barIndex].name}</Col>
          </Row>
          <Row className="tooltip-row" type="flex" justify="start">
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
          <Row className="tooltip-row" type="flex" justify="start">
            <Col className="tooltip-key">Absent: </Col>
            <Col className="tooltip-value">
              {`${payload[0].payload.absentStudents} (count)`}
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
      return !isNaN(val) ? `${Math.abs(val)}%` : null
    }
    return ''
  }

  const getXTickText = (payload, items) => {
    for (const item of items) {
      if (item.dimension._id === payload.value) {
        return item.dimension.name
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
    if (analyseBy === analyseByOptions.aboveBelowStandard) {
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
    if (analyseBy === analyseByOptions.proficiencyBand) {
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
    if (analyseBy === analyseByOptions.proficiencyBand) {
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
    <>
      <FlexContainer
        justifyContent="left"
        alignItems="center"
        style={{ gap: '5px' }}
      >
        <IconInfo fill={themeColor} />
        Excludes absent students
      </FlexContainer>
      <SignedStackedBarChart
        margin={{ top: 0, right: 20, left: 20, bottom: 36 }}
        data={chartData}
        barsData={chartSpecifics.barsData}
        xAxisDataKey="dimensionId"
        getTooltipJSX={getTooltipJSX}
        onBarClickCB={_onBarClickCB}
        onResetClickCB={_onResetClickCB}
        getXTickText={getXTickText}
        yAxisLabel={chartSpecifics.yAxisLabel}
        yTickFormatter={yTickFormatter}
        barsLabelFormatter={barsLabelFormatter}
        filter={filter}
        legendPayload={legendPayload}
        pageSize={10}
        {...chartProps}
      />
    </>
  )
}
