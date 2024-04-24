import React from 'react'
import { CheckboxLabel, EduIf } from '@edulastic/common'
import { Col, Row } from 'antd'
import {
  RowContainer,
  StandardTag,
  StandardTotal,
  StudentFullName,
  StyledCircularDiv,
  STANDARD_SPACING,
  TableStudentMastery,
  TableStudentName,
  TableStudentStandards,
  TOTAL_STANDARDS_MARGIN,
  STANDARDS_FONT_WIDTH,
  TOTAL_STANDARDS_FONT_WIDTH,
  TooltipContainer,
  TooltipStandardContainer,
  TooltipMultiColumnContainer,
  TooltipStandardColumn,
} from './style'
import { CustomTableTooltip } from '../../../Reports/common/components/customTableTooltip'

const getInitials = (firstName, lastName) => {
  if (firstName && lastName)
    return `${firstName[0] + lastName[0]}`.toUpperCase()
  if (firstName) return `${firstName.substr(0, 2)}`.toUpperCase()
  if (lastName) return `${lastName.substr(0, 2)}`.toUpperCase()
}

const StudentDetailRow = ({
  style,
  studentData,
  standardsColumnWidth,
  handleRowCheckboxChange,
  selectedStudentsById,
}) => {
  let remainingStandardsCount = 0

  const {
    _id: studentId,
    standards,
    firstName,
    lastName,
    avgMastery,
  } = studentData
  const totalStandardsCount = standards.length
  const remainingStandardsWidth = 2 * STANDARDS_FONT_WIDTH + STANDARD_SPACING // E.g. "+4" So there will be 2 characters

  // Total length used till now in pixels.
  // Initialised with the length to display the total standards.
  let totalStandardsLength =
    `${totalStandardsCount}`.length * TOTAL_STANDARDS_FONT_WIDTH +
    TOTAL_STANDARDS_MARGIN

  return (
    <RowContainer style={style} key={studentId}>
      <TableStudentName>
        <CheckboxLabel
          checked={selectedStudentsById[studentId]}
          onChange={(event) => handleRowCheckboxChange(event, studentId)}
          style={{ marginRight: '10px' }}
        />
        <StyledCircularDiv>
          {getInitials(lastName, firstName)}
        </StyledCircularDiv>
        <StudentFullName>{`${lastName || ''}${lastName ? ',' : ''} 
		  ${firstName || ''}`}</StudentFullName>
      </TableStudentName>
      <TableStudentMastery>
        {avgMastery} {'%'}
      </TableStudentMastery>
      <TableStudentStandards>
        <StandardTotal>{standards.length}</StandardTotal>
        {standards.map((std, standardIndex) => {
          if (remainingStandardsCount === 0) {
            // The required space must be to display the identifier of the current
            // standard and the remaining standards as overflow. In case of last element
            // there will be no standards left to overflow.
            const requiredLength =
              standardIndex == totalStandardsCount - 1
                ? std.identifier.length * STANDARDS_FONT_WIDTH +
                  STANDARD_SPACING
                : std.identifier.length * STANDARDS_FONT_WIDTH +
                  STANDARD_SPACING +
                  remainingStandardsWidth

            // If the projected length is within the column width, display the standard and update the
            // total length used till now.
            if (standardsColumnWidth > totalStandardsLength + requiredLength) {
              totalStandardsLength +=
                std.identifier.length * STANDARDS_FONT_WIDTH + STANDARD_SPACING
              return (
                <StandardTag>
                  <CustomTableTooltip
                    title={
                      <TooltipContainer>
                        <div style={{ marginBottom: '20px' }}>
                          Mastery: {std.mastery}%
                        </div>
                        <div>{std.desc}</div>
                      </TooltipContainer>
                    }
                    getCellContents={() => ` ${std.identifier} `}
                  />
                </StandardTag>
              )
            }
          } else {
            return null
          }
          // If the standards start to overflow, start pushing the mastery information
          // into the remaining standards array in sets of two.
          remainingStandardsCount = totalStandardsCount - standardIndex
          return null
        })}
        <EduIf condition={remainingStandardsCount}>
          <StandardTag>
            <CustomTableTooltip
              placement="left"
              title={
                <TooltipContainer>
                  {remainingStandardsCount > 1 ? (
                    <TooltipMultiColumnContainer>
                      <TooltipStandardColumn isLeft>
                        {standards
                          .slice(
                            standards.length - remainingStandardsCount,
                            Math.floor(
                              standards.length - remainingStandardsCount / 2
                            ) +
                              (remainingStandardsCount % 2)
                          )
                          .map((std) => {
                            return (
                              <TooltipStandardContainer>
                                {std.identifier} : {std.mastery}%
                              </TooltipStandardContainer>
                            )
                          })}
                      </TooltipStandardColumn>
                      <TooltipStandardColumn>
                        {standards
                          .slice(
                            Math.floor(
                              standards.length - remainingStandardsCount / 2
                            ) +
                              (remainingStandardsCount % 2)
                          )
                          .map((std) => {
                            return (
                              <TooltipStandardContainer>
                                {std.identifier} : {std.mastery}%
                              </TooltipStandardContainer>
                            )
                          })}
                      </TooltipStandardColumn>
                    </TooltipMultiColumnContainer>
                  ) : (
                    <Row>
                      <Col>
                        {standards[standards.length - 1].identifier} :{' '}
                        {standards[standards.length - 1].mastery}%
                      </Col>
                    </Row>
                  )}
                </TooltipContainer>
              }
              getCellContents={() => `+${remainingStandardsCount}`}
            />
          </StandardTag>
        </EduIf>
      </TableStudentStandards>
    </RowContainer>
  )
}

export default StudentDetailRow
