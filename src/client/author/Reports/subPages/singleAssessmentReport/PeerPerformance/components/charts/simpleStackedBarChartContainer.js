import React, { useMemo } from 'react'
import { Row, Col, Tooltip } from 'antd'
import { ticks } from 'd3-array'
import { isEmpty, isNil, maxBy, round } from 'lodash'
import { reportUtils } from '@edulastic/constants'
import { themeColor } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import { SimpleStackedBarChart } from '../../../../../common/components/charts/simpleStackedBarChart'
import { getHSLFromRange1 } from '../../../../../common/util'
import { idToName } from '../../util/transformers'
import { StyledInfoIcon, StyledIcon } from '../styled'

const { analyseByOptions, getOverallAvg } = reportUtils.peerPerformance

const customLegendContent = () => {
  return (
    <FlexContainer justifyContent="end">
      <Tooltip title="District-wide average Score calculated excluding All Filters, except 'Test Type'">
        <FlexContainer alignItems="center">
          <StyledIcon type="line" $fontSize="20px" $marginRight="5px" />
          <span>District Avg</span>
          <StyledInfoIcon fill={themeColor} $marginLeft="5px" />
        </FlexContainer>
      </Tooltip>
    </FlexContainer>
  )
}

export const SimpleStackedBarChartContainer = ({
  data,
  analyseBy,
  compareBy,
  filter,
  onBarClickCB,
  onResetClickCB,
  assessmentName,
  role,
  chartProps,
}) => {
  const dataParser = () => {
    return data.map((item) => {
      let fill = '#cccccc'
      if (filter[item?.dimension?._id] || Object.keys(filter).length === 0) {
        if (analyseBy === analyseByOptions.scorePerc) {
          fill = getHSLFromRange1(item.dimensionAvg || 0)
        } else if (analyseBy === analyseByOptions.rawScore) {
          const dimensionRange = (100 * item.dimensionAvg) / item.maxScore || 0
          fill = getHSLFromRange1(dimensionRange)
        }
      }
      return {
        ...item,
        fill,
      }
    })
  }

  const getTooltipJSX = (payload) => {
    if (!isEmpty(payload)) {
      const { districtAvg, dimension } = payload[0].payload
      const districtValue =
        analyseBy === analyseByOptions.scorePerc
          ? `${round(districtAvg)}%`
          : round(districtAvg, 2)

      return (
        <div>
          <Row className="tooltip-row" type="flex" justify="start">
            <Col className="tooltip-key">{'Assessment Name: '}</Col>
            <Col className="tooltip-value">{assessmentName}</Col>
          </Row>
          <Row className="tooltip-row" type="flex" justify="start">
            <Col className="tooltip-key">{`${idToName(compareBy)}: `}</Col>
            <Col className="tooltip-value">{dimension.name}</Col>
          </Row>
          <Row className="tooltip-row" type="flex" justify="start">
            <Col className="tooltip-key">{'District Average: '}</Col>
            <Col className="tooltip-value">{districtValue}</Col>
          </Row>
        </div>
      )
    }
    return false
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
    let referenceLineY = 0
    if (chartData.length) {
      referenceLineY = getOverallAvg(chartData, analyseBy)
    }
    if (analyseBy === analyseByOptions.scorePerc) {
      let yAxisLabel = 'Avg. Score %'
      if (role === 'teacher') {
        yAxisLabel = 'Avg. Class Performance %'
      }
      return {
        yDomain: [0, 110],
        ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        formatter: (val) => (!isNil(val) ? `${val}%` : val),
        yAxisLabel,
        referenceLineY,
      }
    }
    if (analyseBy === analyseByOptions.rawScore) {
      const maxScore = chartData.length
        ? maxBy(chartData, 'maxScore').maxScore
        : 50
      const arr = ticks(0, maxScore, 10)
      const max = arr[arr.length - 1]
      return {
        yDomain: [0, max + (arr[1] - arr[0])],
        ticks: arr,
        formatter: (val) => val,
        yAxisLabel: 'Avg. Score',
        referenceLineY,
      }
    }
    return {}
  }

  const chartSpecifics = getChartSpecifics()

  return (
    <SimpleStackedBarChart
      data={chartData}
      yDomain={chartSpecifics.yDomain}
      ticks={chartSpecifics.ticks}
      yTickFormatter={chartSpecifics.formatter}
      barsLabelFormatter={chartSpecifics.formatter}
      xAxisDataKey="dimensionId"
      bottomStackDataKey="correct"
      topStackDataKey="incorrect"
      getTooltipJSX={getTooltipJSX}
      dataParser={dataParser}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={_onResetClickCB}
      getXTickText={getXTickText}
      yAxisLabel={chartSpecifics.yAxisLabel}
      filter={filter}
      referenceLineY={chartSpecifics.referenceLineY}
      pageSize={10}
      customLegendContent={customLegendContent}
      {...chartProps}
    />
  )
}
