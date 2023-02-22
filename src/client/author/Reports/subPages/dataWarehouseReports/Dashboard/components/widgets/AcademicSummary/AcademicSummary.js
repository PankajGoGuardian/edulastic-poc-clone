import { greyThemeDark7 } from '@edulastic/colors'
import React, { useState } from 'react'
import SimplePieChart from '../../../../../../common/components/charts/SimplePieChart'
import {
  availableTestTypes,
  getCellColor,
  PieChartData,
  selectedTestType,
} from '../../../utils'
import {
  ContentWrapper,
  StyledDashedHr,
  DashedVR,
  Widget,
} from '../../common/styledComponents'
import WidgetCell from '../../common/WidgetCell'
import WidgetHeader from '../../common/WidgetHeader'
import AcademicSummaryWidgetFilters from './Filters'

const title = 'ACADEMIC SUMMARY AND PERFORMANCE DISTRIBUTION'

const AcademicSummary = ({
  academicSummary,
  profileId,
  performanceBandList,
  bandInfo,
}) => {
  const [filters, setFilters] = useState({
    performanceBand:
      performanceBandList.find((p) => p.key === profileId) ||
      performanceBandList[0],
    testType: selectedTestType,
  })

  const selectedPerformanceBand = (
    bandInfo.filter((x) => x._id === filters.performanceBand.key)[0] ||
    bandInfo[0]
  )?.performanceBand

  const {
    avgScore,
    percentageIncrease,
    prevMonth,
    aboveStandard,
  } = academicSummary

  const avgScoreCellColor = getCellColor(avgScore, selectedPerformanceBand)

  const getChartLabelJSX = (props) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, outerRadius, name } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 4) * cos
    const sy = cy + (outerRadius + 4) * sin
    const circleX = cx + (outerRadius + 2) * cos
    const circleY = cy + (outerRadius + 2) * sin
    const mx = cx + (outerRadius + 20) * cos
    const my = cy + (outerRadius + 20) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 100
    const ey = my
    const textAnchor = cos >= 0 ? 'end' : 'start'
    const textX = ex - (cos >= 0 ? 1 : -1) * 10
    const textY = my - 5
    return (
      <g>
        <circle
          cx={circleX}
          cy={circleY}
          r={3}
          fill="none"
          stroke={greyThemeDark7}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={greyThemeDark7}
          fill="none"
          strokeWidth={1}
          textLength="100px"
        />
        <text
          className="label-text"
          x={textX}
          y={textY}
          textAnchor={textAnchor}
          fill={greyThemeDark7}
        >
          {name}
        </text>
      </g>
    )
  }
  return (
    <Widget>
      <WidgetHeader title={title} />
      <AcademicSummaryWidgetFilters
        filters={filters}
        setFilters={setFilters}
        performanceBandsList={performanceBandList}
        availableTestTypes={availableTestTypes}
      />
      <ContentWrapper>
        <div>
          <WidgetCell
            header="AVG. SCORE"
            value={`${avgScore}%`}
            footer={`${percentageIncrease}%`}
            subFooter={`since ${prevMonth}`}
            color={avgScoreCellColor}
          />
          <StyledDashedHr />
          <WidgetCell
            header="ABOVE STANDARD"
            value={`${aboveStandard}%`}
            color="#cef5d8"
          />
        </div>
        <DashedVR />
        <SimplePieChart
          data={PieChartData}
          getChartLabelJSX={getChartLabelJSX}
        />
      </ContentWrapper>
    </Widget>
  )
}

export default AcademicSummary
