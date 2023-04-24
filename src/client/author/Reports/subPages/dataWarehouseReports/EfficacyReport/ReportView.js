import { Row } from 'antd'
import React from 'react'
import { themeColor, fadedBlack } from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import { IconQuestionCircle } from '@edulastic/icons'
import {
  StyledCard,
  StyledH3,
  StyledReportContainer,
} from '../../../common/styled'
import {
  StyledIconAlert,
  StyledSpan,
} from '../../multipleAssessmentReport/PreVsPost/common/styledComponents'

import { SummaryContainer } from './components/Summary'
import { PerformanceMatrix } from './components/Matrix'
import EfficacyTable from './components/Table/Table'
import useSummaryMetrics from './hooks/useSummaryMetrics'

const ReportView = ({
  reportSummaryData,
  reportTableData,
  tableFilters,
  reportFilters,
  externalBands,
  selectedPrePerformanceBand,
  selectedPostPerformanceBand,
  compareByOptions,
  setTableFilters,
  isCsvDownloading,
  isSharedReport,
}) => {
  const {
    performanceMatrixColumnHeaders,
    performanceMatrixRowsData,
    totalStudentCount,
    summaryData,
    hasIncompleteTests,
    testInfo,
    prePerformanceBand,
    postPerformanceBand,
    isSamePerformanceBand,
  } = useSummaryMetrics({
    reportSummaryData,
    reportFilters,
    externalBands,
    selectedPrePerformanceBand,
    selectedPostPerformanceBand,
  })
  return (
    <StyledReportContainer>
      <StyledCard>
        <Row type="flex" justify="start">
          <StyledH3 fontSize="20px">Efficacy</StyledH3>
          <EduButton isGhost width="70px" height="30px" ml="20px">
            <IconQuestionCircle />
            Help
          </EduButton>
        </Row>
        <Row type="flex">
          <StyledIconAlert fill={themeColor} />
          <StyledSpan fontSize="13px" color={fadedBlack}>
            This report compares the student performance on the choosen two
            assessments.{' '}
            <StyledSpan font="bold" color={fadedBlack}>
              Only students that have results for both assessments are included.
            </StyledSpan>
          </StyledSpan>
        </Row>
      </StyledCard>
      <SummaryContainer
        summary={summaryData}
        testInfo={testInfo}
        totalStudentCount={totalStudentCount}
        prePerformanceBand={prePerformanceBand}
        postPerformanceBand={postPerformanceBand}
      />
      <PerformanceMatrix
        totalStudentCount={totalStudentCount}
        performanceMatrixColumnHeaders={performanceMatrixColumnHeaders}
        performanceMatrixRowsData={performanceMatrixRowsData}
        testInfo={testInfo}
        isSamePerformanceBand={isSamePerformanceBand}
        prePerformanceBand={prePerformanceBand}
        postPerformanceBand={postPerformanceBand}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
      />
      <EfficacyTable
        reportTableData={reportTableData}
        testInfo={testInfo}
        prePerformanceBand={prePerformanceBand}
        postPerformanceBand={postPerformanceBand}
        tableFilters={tableFilters}
        compareByOptions={compareByOptions}
        selectedTableFilters={tableFilters}
        setTableFilters={setTableFilters}
        isCsvDownloading={isCsvDownloading}
        isSharedReport={isSharedReport}
        hasIncompleteTests={hasIncompleteTests}
      />
    </StyledReportContainer>
  )
}

export default ReportView
