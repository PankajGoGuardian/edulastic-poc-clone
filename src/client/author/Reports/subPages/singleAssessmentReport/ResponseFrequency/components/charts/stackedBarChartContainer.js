import React, { useMemo } from 'react'
import { groupBy } from 'lodash'
import { SimpleStackedBarChart } from '../../../../../common/components/charts/simpleStackedBarChart'
import { getHSLFromRange1 } from '../../../../../common/util'
import BarTooltipRow from '../../../../../common/components/tooltip/BarTooltipRow'

export const StackedBarChartContainer = ({
  data: propsData,
  filter: propsFilter,
  assessment: propsAssessment,
  onBarClickCB,
  onResetClickCB,
}) => {
  const dataParser = () => {
    const hmap = groupBy(propsData, 'qType')
    const arr = Object.keys(hmap).map((data) => {
      const qCount = hmap[data].length
      const tmp = hmap[data].reduce(
        (res, ele) => {
          const { total_score = 0, total_max_score = 0 } = ele
          return {
            total_score: res.total_score + total_score,
            total_max_score: res.total_max_score + total_max_score,
          }
        },
        {
          total_score: 0,
          total_max_score: 0,
        }
      )
      tmp.name = data
      tmp.qCount = qCount
      tmp.correct = tmp.total_max_score
        ? Math.round((tmp.total_score / tmp.total_max_score) * 100)
        : 0
      tmp.incorrect = 100 - tmp.correct
      if (propsFilter[tmp.name] || Object.keys(propsFilter).length === 0) {
        tmp.fill = getHSLFromRange1(tmp.correct)
      } else {
        tmp.fill = '#cccccc'
      }
      tmp.assessment = propsAssessment.testName
      return tmp
    })
    return arr
  }

  const getTooltipJSX = (payload) => {
    if (payload && payload.length) {
      let qCount
      if (payload.length === 2) {
        qCount = payload[0].payload.qCount
      }
      return (
        <div>
          <BarTooltipRow
            title="Avg Performance: "
            value={`${payload[0].value}%`}
          />
          <BarTooltipRow
            title="Assessment: "
            value={payload[0].payload.assessment}
          />
          <BarTooltipRow title="Total Questions: " value={qCount} />
          <BarTooltipRow
            title="Question Type: "
            value={payload[0].payload.name}
          />
        </div>
      )
    }
    return false
  }

  const getXTickText = (payload, data) => {
    const getDataByName = (name) => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === name) {
            return data[i].qCount
          }
        }
      }
      return ''
    }
    return `${payload.value} (${getDataByName(payload.value)})`
  }

  const getChartSpecifics = () => {
    return {
      barsData: [
        {
          key: 'correct',
          stackId: 'a',
          fill: getHSLFromRange1(100),
          unit: '%',
        },
        {
          key: 'incorrect',
          stackId: 'a',
          fill: getHSLFromRange1(0),
          unit: '%',
        },
      ],
      yAxisLabel: 'Above/Below Standard',
    }
  }

  const chartData = useMemo(dataParser, [propsData, propsFilter])
  const chartSpecifics = getChartSpecifics()

  return (
    <SimpleStackedBarChart
      data={chartData}
      barsData={chartSpecifics.barsData}
      xAxisDataKey="name"
      bottomStackDataKey="correct"
      topStackDataKey="incorrect"
      getTooltipJSX={getTooltipJSX}
      onBarClickCB={onBarClickCB}
      onResetClickCB={onResetClickCB}
      getXTickText={getXTickText}
      yAxisLabel="Performance"
      filter={propsFilter}
    />
  )
}
