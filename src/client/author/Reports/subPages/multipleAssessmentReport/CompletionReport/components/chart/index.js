import React, { useEffect, useMemo, useState } from 'react'
import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import {
  referenceLinesForCompletionChart as referenceLines,
  barDataForCompletionChart as barLabelData,
  yDomain,
  yAxisLabel,
  preLabelHeading,
} from '../../../common/utils/constants'
import { SignedStackedBarChart } from '../../../../../common/components/charts/customSignedStackedBarChart'
import { barsLabelFormatter, chartDataFormatter } from './utils'
import Heading from '../../../../../common/components/Heading'
import { ChartContainer } from './styled'
import BarTooltipRow from '../../../../../common/components/tooltip/BarTooltipRow'
import { toggleItem } from '../../../../../common/util'

const {
  title,
  description,
  titleFontSize,
  descriptionFontSize,
} = preLabelHeading

const Chart = ({
  chartData = [],
  loading,
  pagination,
  setPagination,
  pageSize,
  selectedTests,
  setSelectedTests,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const formattedChartData = useMemo(() => chartDataFormatter(chartData), [
    chartData,
  ])

  useEffect(() => {
    if (pagination.page === 1) {
      const totalTests = formattedChartData.length
        ? formattedChartData[0].totalTests
        : 0
      const totalPages = Math.ceil(totalTests / pageSize)
      setPagination((prevState) => ({
        ...prevState,
        pageCount: totalPages,
      }))
    }
  }, [formattedChartData])

  const handleMouseOver = (category) => {
    setHoveredCategory(category)
  }

  const yTickFormatter = (value) => {
    return `${value}%`
  }

  const selectedTestsFilter = selectedTests.reduce(
    (res, ele) => ({
      ...res,
      [ele]: true,
    }),
    {}
  )

  const handleToggleSelectedBars = (item) => {
    const _selectedTests = toggleItem(selectedTests, item)
    setSelectedTests(_selectedTests)
  }

  const _onResetClickCB = () => {
    setSelectedTests([])
  }

  const getTooltipJSX = (payload) => {
    if (payload.length && payload[0].payload && hoveredCategory) {
      const result = payload[0].payload
      const progressStatus = `${hoveredCategory.name}: `
      const dataToDisplay = {
        'Test Name: ': result.testName,
        'Test Date: ': result.testDate,
        'Students Assigned: ': result.totalCount,
      }
      dataToDisplay[progressStatus] = `${
        result[hoveredCategory.insideLabelKey]
      } (${result[hoveredCategory.key]}%)`
      return (
        <div>
          {Object.keys(dataToDisplay).map((key) => {
            return <BarTooltipRow title={key} value={dataToDisplay[key]} />
          })}
        </div>
      )
    }
  }

  const getXTickText = (payload, _data) => {
    return _data[payload.index]?.testName || '-'
  }

  return (
    <ChartContainer>
      <EduIf condition={formattedChartData.length}>
        <Heading
          title={title}
          description={description}
          titleFontSize={titleFontSize}
          descriptionFontSize={descriptionFontSize}
        />
        <EduIf condition={!loading}>
          <EduThen>
            <SignedStackedBarChart
              backendPagination={pagination}
              setBackendPagination={setPagination}
              barsData={barLabelData}
              data={formattedChartData}
              yDomain={yDomain}
              xAxisDataKey="testId"
              onBarClickCB={handleToggleSelectedBars}
              onResetClickCB={_onResetClickCB}
              filter={selectedTestsFilter}
              getXTickText={getXTickText}
              onLegendMouseEnter={(payload) =>
                console.log('Cursor Over Legend', payload)
              }
              onLegendMouseLeave={(payload) =>
                console.log('Cursor away from Legend', payload)
              }
              yAxisLabel={yAxisLabel}
              hideOnlyYAxis
              handleMouseOver={handleMouseOver}
              onMouseBarLeave={() => setHoveredCategory(null)}
              getTooltipJSX={getTooltipJSX}
              getXAxisTickSyle={{ fontWeight: 'bold' }}
              hideCartesianGrid
              hasBarInsideLabels
              barsLabelFormatter={barsLabelFormatter}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              tick
              yTickLine={{ stroke: 'black' }}
              margin={{ top: 0, right: 60, left: 60, bottom: 50 }}
              hasRoundedBars={false}
              referenceLines={referenceLines}
              tickMargin={2}
              legendProps={{ wrapperStyle: { top: -10 } }}
              tooltipType="left"
              needWhiteBackgroundToolTip
              xTickTooltipPosition={380}
              yTickFormatter={yTickFormatter}
              xAxisFontWeight={400}
              startFromLast
              yAxisStyle={{ transform: 'translate(-15px)', fill: 'black' }}
            />
          </EduThen>
          <EduElse>
            <SpinLoader
              tip="Loading completion chart data..."
              position="relative"
              height="70%"
            />
          </EduElse>
        </EduIf>
      </EduIf>
    </ChartContainer>
  )
}

export default Chart
