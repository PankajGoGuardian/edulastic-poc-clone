import React, { useMemo } from 'react'
import { Row, Col } from 'antd'
import { isEmpty } from 'lodash'
import { SignedStackedBarChart } from '../../../../../common/components/charts/signedStackedBarChart'
import { getChartData } from '../../utils/transformers'

export const SignedStackBarChartContainer = ({
  data,
  chartFilter,
  masteryScale = [],
  onBarClickCB,
  onBarResetClickCB,
  backendPagination,
  setBackendPagination,
}) => {
  const chartData = useMemo(() => getChartData(data, masteryScale), [
    data,
    masteryScale,
  ])

  const getChartSpecifics = () => {
    if (!isEmpty(masteryScale)) {
      const tempArr = masteryScale.sort((a, b) => a.score - b.score)
      const barsData = []
      for (let i = 0; i < tempArr.length; i++) {
        barsData.push({
          key: tempArr[i].masteryLabel,
          stackId: 'a',
          fill: tempArr[i].color,
          unit: '%',
          name: tempArr[i].masteryName,
        })
      }
      return {
        barsData,
        yAxisLabel: 'Student %',
        xAxisDataKey: 'standard',
      }
    }
    return {
      barsData: [],
      yAxisLabel: 'Student %',
      xAxisDataKey: 'standard',
    }
  }

  const chartSpecifics = useMemo(() => getChartSpecifics(), [masteryScale])

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      const { dataKey: masteryLabel, value: studentPercent } = payload[barIndex]
      const {
        standard,
        standardName,
        masteryLabelInfo,
        totalStudents,
      } = payload[barIndex].payload
      const masteryName = masteryLabelInfo[masteryLabel]

      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Standard: </Col>
            <Col className="tooltip-value">{standard}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Description: </Col>
            <Col className="tooltip-value">{standardName}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Mastery Level: </Col>
            <Col className="tooltip-value">{masteryName}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Student %: </Col>
            <Col className="tooltip-value">{Math.abs(studentPercent)}%</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Student #: </Col>
            <Col className="tooltip-value">{totalStudents}</Col>
          </Row>
        </div>
      )
    }
    return false
  }

  const _onBarClickCB = (key) => {
    onBarClickCB(key)
  }

  const yTickFormatter = () => ''

  const barsLabelFormatter = (val) => {
    if (val !== 0) {
      return `${Math.abs(val)}%`
    }
    return ''
  }

  return (
    <SignedStackedBarChart
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey="standard"
      getTooltipJSX={getTooltipJSX}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={onBarResetClickCB}
      yAxisLabel={chartSpecifics.yAxisLabel}
      yTickFormatter={yTickFormatter}
      barsLabelFormatter={barsLabelFormatter}
      filter={chartFilter}
      backendPagination={backendPagination}
      setBackendPagination={setBackendPagination}
      margin={{ top: 0, right: 60, left: 10, bottom: 0 }}
    />
  )
}
