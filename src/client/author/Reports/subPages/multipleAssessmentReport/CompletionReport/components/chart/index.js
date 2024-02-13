import React, { useEffect, useState } from 'react'
import { formatDate } from '@edulastic/constants/reportUtils/common'
import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { Empty } from 'antd'
import {
  TooltipRowTitle,
  TooltipRowValue,
  TooltipRow,
} from '../../../../../common/styled'
import { SignedStackedBarChart } from '../../../../../common/components/charts/customSignedStackedBarChart'

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
  const pageSize = 2
  const referenceLines = {
    0: 'black',
    25: 'grey',
    50: 'grey',
    75: 'grey',
    100: 'grey',
  }

  const dataForChart = chartData.map((item) => ({
    testName: item.testName,
    gradedPercentage: ((item.graded / item.assigned) * 100).toFixed(2),
    submittedPercentage: ((item.submitted / item.assigned) * 100).toFixed(2),
    inProgressPercentage: ((item.inProgress / item.assigned) * 100).toFixed(2),
    notStartedPercentage: ((item.notStarted / item.assigned) * 100).toFixed(2),
    absentPercentage: ((item.absent / item.assigned) * 100).toFixed(2),
    graded: item.graded,
    submitted: item.submitted,
    inProgress: item.inProgress,
    notStarted: item.notStarted,
    absent: item.absent,
    totalCount: item.assigned,
    testDate: formatDate(item.assessmentDate),
    testId: item.testId,
    testType: item.testType,
  }))

  const barData = [
    {
      key: 'absentPercentage',
      insideLabelKey: 'absent',
      name: 'Absent',
      fill: '#9e9e9e',
      position: 'insideTop',
      stackId: 'completionReport',
    },
    {
      key: 'notStartedPercentage',
      insideLabelKey: 'notStarted',
      position: 'insideTop',
      name: 'Not Started',
      stackId: 'completionReport',
      fill: '#f44336',
    },
    {
      key: 'inProgressPercentage',
      insideLabelKey: 'inProgress',
      position: 'insideTop',
      name: 'In Progress',
      stackId: 'completionReport',
      fill: '#ffc107',
    },
    {
      key: 'submittedPercentage',
      insideLabelKey: 'submitted',
      position: 'insideTop',
      name: 'Submitted',
      stackId: 'completionReport',
      fill: '#2196f3',
    },
    {
      key: 'gradedPercentage',
      insideLabelKey: 'graded',
      position: 'insideTop',
      name: 'Graded',
      stackId: 'completionReport',
      fill: '#4caf50',
    },
  ]

  useEffect(() => {
    if (dataForChart.length === pageSize) {
      setNavBtnVisible((prevState) => ({ ...prevState, rightNavVisible: true }))
    } else if (dataForChart.length < pageSize) {
      setNavBtnVisible((prevState) => ({
        ...prevState,
        rightNavVisible: false,
      }))
    }
    console.log({ chartData })
  }, [])

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
          {Object.keys(dataToDisplay).map((title) => {
            return (
              <TooltipRow>
                <TooltipRowTitle>{title}</TooltipRowTitle>
                <TooltipRowValue>{dataToDisplay[title]}</TooltipRowValue>
              </TooltipRow>
            )
          })}
        </div>
      )
    }
  }

  const preLabelContent = (
    <>
      <h1>Completion report by School</h1>
      <p>
        The report provide real-time insights into student progess, submission
        status and grading updates for informed decision-making.
      </p>
    </>
  )

  return (
    <>
      {!loading ? (
        <EduIf condition={dataForChart.length || pageNo > 1}>
          <EduThen>
            <SignedStackedBarChart
              pageSize={pageSize}
              barsData={barData}
              data={dataForChart}
              yDomain={[0, 100]}
              xAxisDataKey="testName"
              onBarClickCB={(bar) => console.log('bar is clicked', bar)}
              onResetClickCB={(bar) => console.log('Reset bar is clicked', bar)}
              onLegendMouseEnter={(payload) =>
                console.log('Cursor Over Legend', payload)
              }
              onLegendMouseLeave={(payload) =>
                console.log('Cursor away from Legend', payload)
              }
              yAxisLabel="DISTRIBUTION OF STUDENTS (%)"
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
              preLabelContent={preLabelContent}
              navButtonTopMargin="63%"
              legendProps={{ wrapperStyle: { top: -10 } }}
              margin={{ top: 20, right: 60, left: 60, bottom: 0 }}
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
