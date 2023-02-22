import React, { useState } from 'react'
import ModernPieChart from '../../../../../../common/components/charts/ModernPieChart'
import {
  availableTestTypes,
  getCellColor,
  PieChartData,
  selectedTestType,
  getAcademicSummaryChartLabelJSX,
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
        <ModernPieChart
          data={PieChartData}
          getChartLabelJSX={getAcademicSummaryChartLabelJSX}
        />
      </ContentWrapper>
    </Widget>
  )
}

export default AcademicSummary
