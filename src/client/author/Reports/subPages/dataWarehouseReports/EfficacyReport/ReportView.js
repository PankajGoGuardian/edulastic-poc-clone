import React from 'react'
import { fadedBlack } from '@edulastic/colors'
import { helpLinks, reportNavType } from '@edulastic/constants/const/report'
import { StyledCard, StyledReportContainer } from '../../../common/styled'
import { StyledSpan } from '../../multipleAssessmentReport/PreVsPost/common/styledComponents'

import { SummaryContainer } from './components/Summary'
import { PerformanceMatrix } from './components/Matrix'
import EfficacyTable from './components/Table/Table'
import useSummaryMetrics from './hooks/useSummaryMetrics'
import SectionLabel from '../../../common/components/SectionLabel'
import SectionDescription from '../../../common/components/SectionDescription'

const ReportView = ({
  reportSummaryData,
  reportTableData,
  tableFilters,
  pageFilters,
  reportFilters,
  externalBands,
  selectedPrePerformanceBand,
  selectedPostPerformanceBand,
  compareByOptions,
  setTableFilters,
  getTableDrillDownUrl,
  onMatrixCellClick,
  setPageFilters,
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
    preStudentCount,
    postStudentCount,
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
        <SectionLabel
          style={{ fontSize: '20px' }}
          $margin="30px 0px 10px 0px"
          showHelp
          url={helpLinks[reportNavType.DW_EFFICACY_REPORT]}
        >
          Efficacy
        </SectionLabel>
        <SectionDescription $margin="0px 0px 30px 0px">
          This report compares the student performance on the chosen two
          assessments.{' '}
          <StyledSpan font="bold" color={fadedBlack}>
            Only students who have been graded in both assessments are included.
          </StyledSpan>
        </SectionDescription>
      </StyledCard>
      <SummaryContainer
        summary={summaryData}
        testInfo={testInfo}
        totalStudentCount={totalStudentCount}
        prePerformanceBand={prePerformanceBand}
        postPerformanceBand={postPerformanceBand}
        preStudentCount={preStudentCount}
        postStudentCount={postStudentCount}
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
        onMatrixCellClick={onMatrixCellClick}
      />
      <EfficacyTable
        reportTableData={reportTableData}
        testInfo={testInfo}
        prePerformanceBand={prePerformanceBand}
        postPerformanceBand={postPerformanceBand}
        compareByOptions={compareByOptions}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        getTableDrillDownUrl={getTableDrillDownUrl}
        pageFilters={pageFilters}
        setPageFilters={setPageFilters}
        isCsvDownloading={isCsvDownloading}
        isSharedReport={isSharedReport}
        hasIncompleteTests={hasIncompleteTests}
      />
    </StyledReportContainer>
  )
}

export default ReportView
