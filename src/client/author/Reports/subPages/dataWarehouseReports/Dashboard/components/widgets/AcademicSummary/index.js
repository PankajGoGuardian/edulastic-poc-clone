import { lightGrey8 } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import { Spin } from 'antd'
import React from 'react'
import SimplePieChart from '../../../../../../common/components/charts/SimplePieChart'
import { DashedLine } from '../../../../../../common/styled'
import {
  getCellColor,
  getAcademicSummaryPieChartData,
  getAcademicSummaryChartLabelJSX,
} from '../../../utils'
import { ContentWrapper, Widget } from '../../common/styledComponents'
import WidgetCell from '../common/WidgetCell'
import WidgetHeader from '../common/WidgetHeader'
import AcademicSummaryWidgetFilters from './Filters'

const title = 'ACADEMIC SUMMARY AND PERFORMANCE DISTRIBUTION'

const AcademicSummary = ({
  academicSummaryData,
  selectedPerformanceBand,
  performanceBandList,
  availableTestTypes,
  filters,
  setFilters,
  loadingAcademicSummaryData,
}) => {
  const {
    avgScore,
    periodAvgScore,
    aboveStandardsStudents,
    bandDistribution,
  } = academicSummaryData

  const avgScoreCellColor = getCellColor(avgScore, selectedPerformanceBand)
  const PieChartData = getAcademicSummaryPieChartData(
    bandDistribution,
    selectedPerformanceBand
  )
  return (
    <Widget>
      <Spin spinning={loadingAcademicSummaryData}>
        <WidgetHeader title={title} />
        <AcademicSummaryWidgetFilters
          filters={filters}
          setFilters={setFilters}
          performanceBandsList={performanceBandList}
          availableTestTypes={availableTestTypes}
        />
        <EduIf condition={!loadingAcademicSummaryData}>
          <ContentWrapper>
            <div>
              <WidgetCell
                header="AVG. SCORE"
                value={`${avgScore}%`}
                footer={periodAvgScore - avgScore}
                subFooter="vs Dec'22"
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
                value={`${aboveStandardsStudents}%`}
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
            <SimplePieChart
              data={PieChartData}
              getChartLabelJSX={getAcademicSummaryChartLabelJSX}
            />
          </ContentWrapper>
        </EduIf>
      </Spin>
    </Widget>
  )
}

export default AcademicSummary
