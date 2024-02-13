import React, { useEffect, useMemo, useState } from 'react'
import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { Empty } from 'antd'
import {
  referenceLinesForCompletionChart as referenceLines,
  barDataForCompletionChart as barLabelData,
  completionReportPageSize as pageSize,
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
import { chartDataFormatter } from './utils'
import Heading from '../../../../../common/components/Heading'

const { title, description } = preLabelHeading

const Chart = (props) => {
  const {
    chartData = [],
    navBtnVisible,
    setNavBtnVisible,
    loading,
    pageNo,
    setPageNo,
  } = props
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const dataForChart = useMemo(() => chartDataFormatter(chartData))

  useEffect(() => {
    if (dataForChart.length === pageSize) {
      setNavBtnVisible((prevState) => ({ ...prevState, rightNavVisible: true }))
    } else if (dataForChart.length < pageSize) {
      setNavBtnVisible((prevState) => ({
        ...prevState,
        rightNavVisible: false,
      }))
      if (dataForChart.length === 0 && pageNo > 1)
        setPageNo((prevState) => (prevState > 1 ? prevState - 1 : prevState))
    }
  }, [chartData])

  const handleMouseOver = (category) => {
    setHoveredCategory(category)
  }

  const getCategoryContent = (value, payload, height) => {
    if (height > 14) return value
    return ''
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
    <>
      {!loading ? (
        <EduIf condition={dataForChart.length || pageNo > 1}>
          <EduThen>
            <Heading title={title} description={description} />
            <SignedStackedBarChart
              pageSize={pageSize}
              barsData={barLabelData}
              data={dataForChart}
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
              barsLabelFormatter={getCategoryContent}
              labelListContent={getCategoryContent}
              ticks={false}
              tick={false}
              barSize={100}
              hasRoundedBars={false}
              referenceLines={referenceLines}
              tickMargin={10}
              legendProps={{ wrapperStyle: { top: -10 } }}
              tooltipType="left"
              customizedPagination
              setNavBtnVisible={setNavBtnVisible}
              navBtnVisible={navBtnVisible}
              currentPage={pageNo}
              setCurrentPage={setPageNo}
            />
          </EduThen>
          <EduElse>
            <Empty
              className="ant-empty-small"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ textAlign: 'center', margin: '10px 0' }}
              description="No matching results"
            />
          </EduElse>
        </EduIf>
      ) : (
        <SpinLoader />
      )}
    </>
  )
}

export default Chart
