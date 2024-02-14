import React, { useEffect, useMemo, useState } from 'react'
import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { Empty } from 'antd'
import {
  referenceLinesForCompletionChart as referenceLines,
  barDataForCompletionChart as barLabelData,
  xAxisDataKey,
  yDomain,
  yAxisLabel,
  preLabelHeading,
} from '../../../common/utils/constants'
import {
  TooltipRowTitle,
  TooltipRowValue,
  TooltipRow,
} from '../../../../../common/styled'
import { SignedStackedBarChart } from '../../../../../common/components/charts/customSignedStackedBarChart'
import {
  barsLabelFormatter,
  chartDataFormatter,
  customTick,
  yLabelFormatter,
  yTicks,
} from './utils'
import Heading from '../../../../../common/components/Heading'
import { ChartContainer } from './styled'

const {
  title,
  description,
  titleFontSize,
  descriptionFontSize,
  pageSize,
} = preLabelHeading

const Chart = ({ chartData = [], loading, pagination, setPagination }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const formattedChartData = useMemo(() => chartDataFormatter(chartData))

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
  }, [chartData])

  const handleMouseOver = (category) => {
    setHoveredCategory(category)
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
            return (
              <TooltipRow>
                <TooltipRowTitle>{key}</TooltipRowTitle>
                <TooltipRowValue>{dataToDisplay[key]}</TooltipRowValue>
              </TooltipRow>
            )
          })}
        </div>
      )
    }
  }

  return (
    <ChartContainer>
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
            xAxisDataKey={xAxisDataKey}
            onBarClickCB={(bar) => console.log('bar is clicked', bar)}
            onResetClickCB={(bar) => console.log('Reset bar is clicked', bar)}
            onLegendMouseEnter={(payload) =>
              console.log('Cursor Over Legend', payload)
            }
            onLegendMouseLeave={(payload) =>
              console.log('Cursor away from Legend', payload)
            }
            yAxisLabel={yAxisLabel}
            hideOnlyYAxis
            onMouseBarOver={handleMouseOver}
            onMouseBarLeave={() => setHoveredCategory(null)}
            getTooltipJSX={getTooltipJSX}
            getXAxisTickSyle={{ fontWeight: 'bold' }}
            hideCartesianGrid
            hasBarInsideLabels
            barsLabelFormatter={barsLabelFormatter}
            ticks={false}
            tick={false}
            barSize={100}
            hasRoundedBars={false}
            referenceLines={referenceLines}
            tickMargin={10}
            legendProps={{ wrapperStyle: { top: -10 } }}
            tooltipType="left"
            responsiveContainerHeight={278}
            // yTicks={yTicks}
            // yTickCount={20}
            // yTick={customTick}
            // yTickLine={{ stroke: '#D8D8D8' }}
            // yTickFormatter={yLabelFormatter}
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
    </ChartContainer>
  )
}

export default Chart
