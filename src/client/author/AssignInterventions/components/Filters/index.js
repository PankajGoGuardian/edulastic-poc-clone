import React from 'react'
import { Divider } from 'antd'
import {
  ClassNameContainer,
  FiltersContainer,
  TestNameContainer,
  StudentCountContainer,
  HeaderContainer,
  HeaderInformationContainer,
  StyledImage,
  FilterContentContainer,
  FilterHeadingContainer,
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
          <TestNameContainer>{classResponse?.title}</TestNameContainer>
          <StudentCountContainer>
            Total : {additionalData.totalCount} Students
          </StudentCountContainer>
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
