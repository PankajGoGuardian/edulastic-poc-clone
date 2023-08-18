import React, { useMemo } from 'react'

import { Row, Col } from 'antd'
import { reportUtils } from '@edulastic/constants'
import { SignedStackedBarChart } from '../../../../../common/components/charts/signedStackedBarChart'

const { getChartData } = reportUtils.standardsProgress

const SignedStackedBarChartContainer = ({
  data: rawChartData = [],
  masteryScale = [],
  backendPagination,
  setBackendPagination,
}) => {
  const chartData = useMemo(() => getChartData(rawChartData, masteryScale), [
    rawChartData,
    masteryScale,
  ])

  const getChartSpecefics = () => {
    const barsData = []
    if (masteryScale.length) {
      const tempArr = masteryScale.sort((a, b) => a.score - b.score)
      for (let i = 0; i < tempArr.length; i++) {
        barsData.push({
          key: tempArr[i].masteryLabel,
          stackId: 'a',
          fill: tempArr[i].color,
          unit: '%',
          name: tempArr[i].masteryName,
        })
      }
    }
    return {
      barsData,
      yAxisLabel: 'Student %',
      xAxisDataKey: 'testName',
    }
  }

  const chartSpecifics = useMemo(() => getChartSpecefics(), [masteryScale])

  const getTooltipJSX = (payload, barIndex) => {
    if (payload && payload.length && barIndex !== null) {
      const { dataKey: masteryLabel, value: studentPercent } = payload[barIndex]
      const { testName, masteryLabelInfo, totalStudents } = payload[
        barIndex
      ].payload
      const masteryName = masteryLabelInfo[masteryLabel]

      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="tooltip-key">Test: </Col>
            <Col className="tooltip-value">{testName}</Col>
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

  const yTickFormatter = () => ''

  const barsLabelFormatter = (val) => {
    if (val !== 0) {
      return `${Math.abs(val)}%`
    }
    return ''
  }

  const _onBarClickCB = () => {}
  const _onBarResetClickCB = () => {}

  return (
    <SignedStackedBarChart
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey={chartSpecifics.xAxisDataKey}
      getTooltipJSX={getTooltipJSX}
      yAxisLabel={chartSpecifics.yAxisLabel}
      yTickFormatter={yTickFormatter}
      barsLabelFormatter={barsLabelFormatter}
      onBarClickCB={_onBarClickCB}
      onResetClickCB={_onBarResetClickCB}
      backendPagination={backendPagination}
      setBackendPagination={setBackendPagination}
      margin={{ top: 0, right: 60, left: 10, bottom: 0 }}
    />
  )
}

export default SignedStackedBarChartContainer
