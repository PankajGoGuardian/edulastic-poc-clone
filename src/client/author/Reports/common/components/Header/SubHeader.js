import React from 'react'
import styled from 'styled-components'

import Breadcrumb from '../../../../src/components/Breadcrumb'

import SingleAssessmentRowFilters from '../../../subPages/singleAssessmentReport/common/components/RowFilters'
import MultipleAssessmentRowFilters from '../../../subPages/multipleAssessmentReport/common/components/filters/RowFilters'
import StandardsMasteryRowFilters from '../../../subPages/standardsMasteryReport/common/components/RowFilters'
import StudentProfileRowFilters from '../../../subPages/studentProfileReport/common/components/filter/RowFilters'

const SubHeader = ({
  breadcrumbsData,
  onRefineResultsCB,
  title,
  showFilter,
  isSharedReport,
}) => {
  const isShowBreadcrumb = title !== 'Standard Reports'
  const isSingleAssessmentReport =
    title === 'Assessment Summary' ||
    title === 'Sub-group Performance' ||
    title === 'Question Analysis' ||
    title === 'Response Frequency' ||
    title === 'Performance by Standards' ||
    title === 'Performance by Students'
  const isMultipleAssessmentReport =
    title === 'Performance Over Time' ||
    title === 'Peer Progress Analysis' ||
    title === 'Student Progress'
  const isStandardMasteryReport =
    title === 'Standards Performance Summary' || title === 'Standards Gradebook'
  const isStudentProfileReport =
    title === 'Student Profile Summary' ||
    title === 'Student Mastery Profile' ||
    title === 'Student Assessment Profile'
  const performanceBandRequired =
    title === 'Assessment Summary' ||
    title === 'Sub-group Performance' ||
    title === 'Performance by Students' ||
    title === 'Performance Over Time' ||
    title === 'Student Progress' ||
    title === 'Student Profile Summary' ||
    title === 'Student Assessment Profile'
  const standardProficiencyRequired =
    title === 'Performance by Standards' ||
    title === 'Student Profile Summary' ||
    title === 'Student Mastery Profile'
  const demographicsRequired =
    title === 'Sub-group Performance' ||
    title === 'Performance By Standards' ||
    title === 'Performance By Students' ||
    title === 'Performance Over Time' ||
    title === 'Peer Progress Analysis' ||
    title === 'Student Progress' ||
    title === 'Standards Gradebook'

  const setShowFilter = (status) => {
    onRefineResultsCB(null, status)
  }
  const setShowApply = (status) => {
    onRefineResultsCB(null, status, 'applyButton')
  }

  return (
    <SecondaryHeader style={{ marginBottom: isShowBreadcrumb ? 20 : 0 }}>
      <HeaderTitle>
        {isShowBreadcrumb ? (
          <Breadcrumb data={breadcrumbsData} style={{ position: 'unset' }} />
        ) : null}
      </HeaderTitle>
      {!isSharedReport && onRefineResultsCB && isSingleAssessmentReport ? (
        <SingleAssessmentRowFilters
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          setShowApply={setShowApply}
          performanceBandRequired={performanceBandRequired}
          standardProficiencyRequired={standardProficiencyRequired}
          demographicsRequired={demographicsRequired}
        />
      ) : null}
      {!isSharedReport && onRefineResultsCB && isMultipleAssessmentReport ? (
        <MultipleAssessmentRowFilters
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          setShowApply={setShowApply}
          performanceBandRequired={performanceBandRequired}
          demographicsRequired={demographicsRequired}
        />
      ) : null}
      {!isSharedReport && onRefineResultsCB && isStandardMasteryReport ? (
        <StandardsMasteryRowFilters
          pageTitle={title}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          setShowApply={setShowApply}
          demographicsRequired={demographicsRequired}
        />
      ) : null}
      {!isSharedReport && onRefineResultsCB && isStudentProfileReport ? (
        <StudentProfileRowFilters
          performanceBandRequired={performanceBandRequired}
          standardProficiencyRequired={standardProficiencyRequired}
        />
      ) : null}
    </SecondaryHeader>
  )
}

export default SubHeader

const HeaderTitle = styled.div`
  min-width: 230px;
  max-width: 280px;
  h1 {
    font-size: 25px;
    font-weight: bold;
    color: white;
    margin: 0px;
    display: flex;
    align-items: center;
    svg {
      width: 30px;
      height: 30px;
      fill: white;
      margin-right: 10px;
    }
  }
`

const SecondaryHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  @media print {
    display: none;
  }
`
