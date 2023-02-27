import { lightGrey8 } from '@edulastic/colors'
import { Spin } from 'antd'
import React, { useState } from 'react'
import ModernPieChart from '../../../../../../common/components/charts/ModernPieChart'
import { DashedLine } from '../../../../../../common/styled'
import {
  availableTestTypes,
  getCellColor,
  PieChartData,
  selectedTestType,
  getAcademicSummaryChartLabelJSX,
} from '../../../utils'
import { ContentWrapper, Widget } from '../../common/styledComponents'
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
    prevMonthAvgScore,
    prevMonth,
    aboveStandard,
  } = academicSummary

  const avgScoreCellColor = getCellColor(avgScore, selectedPerformanceBand)
  return (
    <Spin spinning={false}>
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
              footer={`${avgScore - prevMonthAvgScore}%`}
              subFooter={`since ${prevMonth}`}
              color={avgScoreCellColor}
            />
            <DashedLine
              dashWidth="1px"
              height="1px"
              margin="20px 5px"
              dashColor={lightGrey8}
            />
            <WidgetCell
              header="ABOVE STANDARD"
              value={`${aboveStandard}%`}
              color="#cef5d8"
            />
          </div>
          <DashedLine
            dashWidth="1px"
            height="250px"
            maxWidth="1px"
            dashColor={lightGrey8}
            margin="0 10px"
          />
          <ModernPieChart
            data={PieChartData}
            getChartLabelJSX={getAcademicSummaryChartLabelJSX}
          />
        </ContentWrapper>
      </Widget>
    </Spin>
  )
}

export default AcademicSummary
