import React, { useMemo } from 'react'
import { Row, Col } from 'antd'
import { isEmpty } from 'lodash'

import { reportUtils } from '@edulastic/constants'

import { SignedStackedBarChart } from '../../../../../common/components/charts/signedStackedBarChart'

const { CHART_X_AXIS_DATA_KEY, getChartData } = reportUtils.standardsGradebook

const getXTickText = ({ value }, records) =>
  records.find((t) => t[CHART_X_AXIS_DATA_KEY] === value).standard || '-'

const getChartSpecifics = (scaleInfo) => {
  if (!isEmpty(scaleInfo)) {
    const tempArr = scaleInfo.sort((a, b) => a.score - b.score)
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
      xAxisDataKey: CHART_X_AXIS_DATA_KEY,
    }
  }
  return {
    barsData: [],
    yAxisLabel: 'Student %',
    xAxisDataKey: CHART_X_AXIS_DATA_KEY,
  }
}

const getTooltipJSX = (payload, barIndex) => {
  if (payload && payload.length && barIndex !== null) {
    const { dataKey: masteryLabel, value: studentPercent } = payload[barIndex]
    const { standard, standardName, masteryLabelInfo, totalStudents } = payload[
      barIndex
    ].payload
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

const yTickFormatter = () => ''

const barsLabelFormatter = (val) => {
  if (val !== 0) {
    return `${Math.abs(val)}%`
  }
  return ''
}

export const SignedStackBarChartContainer = ({
  summaryMetricInfoWithSkillInfo,
  chartFilter,
  scaleInfo = [],
  onBarClickCB,
  onBarResetClickCB,
  backendPagination,
  setBackendPagination,
}) => {
  const chartData = useMemo(
    () => getChartData(summaryMetricInfoWithSkillInfo, scaleInfo),
    [summaryMetricInfoWithSkillInfo, scaleInfo]
  )

  const chartSpecifics = useMemo(() => getChartSpecifics(scaleInfo), [
    scaleInfo,
  ])

  const _onBarClickCB = (key) => {
    onBarClickCB(key)
  }

  return (
    <SignedStackedBarChart
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey={CHART_X_AXIS_DATA_KEY}
      getXTickText={getXTickText}
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
