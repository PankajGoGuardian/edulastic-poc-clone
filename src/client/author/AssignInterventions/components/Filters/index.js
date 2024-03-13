import React from 'react'
import { Divider } from 'antd'
import { TestTypeIcon } from '@edulastic/common'
import {
  ClassNameContainer,
  FiltersContainer,
  TestNameContainer,
  StudentInfoContainer,
  HeaderContainer,
  HeaderInformationContainer,
  StyledImage,
  FilterContentContainer,
  FilterHeadingContainer,
  EllipseSeparator,
  StudentInfoElement,
} from './style'
import MasteryRangeFilter from './MasteryRangeFilter'
import StandardsFilter from './StandardsFilter'

const Filters = ({
  additionalData,
  classResponse,
  reportStandards,
  masteryRange,
  setMasteryRange,
  selectedStandards,
  setSelectedStandards,
  studentStandardsData,
}) => {
  return (
    <FiltersContainer>
      <HeaderContainer>
        <StyledImage src={classResponse.thumbnail} width="140" height="80" />
        <HeaderInformationContainer>
          <ClassNameContainer>{additionalData.className}</ClassNameContainer>
          <TestNameContainer>
            {classResponse?.title}
            <TestTypeIcon testType={additionalData.testType} />
          </TestNameContainer>
          <StudentInfoContainer>
            <StudentInfoElement>
              Status : {additionalData.status.toLowerCase()}
            </StudentInfoElement>
            <EllipseSeparator />
            <StudentInfoElement>
              Total : {additionalData.totalCount} Students
            </StudentInfoElement>
          </StudentInfoContainer>
        </HeaderInformationContainer>
      </HeaderContainer>
      <Divider />
      <FilterContentContainer>
        <FilterHeadingContainer>
          Step1 : Select Standards to be Improved
        </FilterHeadingContainer>
        <MasteryRangeFilter
          masteryRange={masteryRange}
          setMasteryRange={setMasteryRange}
        />
        <StandardsFilter
          options={reportStandards}
          selectedStandards={selectedStandards}
          setSelectedStandards={setSelectedStandards}
          studentStandardsData={studentStandardsData}
          masteryRange={masteryRange}
        />
      </FilterContentContainer>
    </FiltersContainer>
  )
}

export default Filters
