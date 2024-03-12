import React from 'react'
import { Tooltip } from 'antd'
import { CheckboxLabel, EduIf } from '@edulastic/common'
import {
  RowContainer,
  StandardRemaining,
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
  STANDARDS_REMAINING_MARGIN,
} from './style'

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
  let remainingStandardsCount = 0 // Count of the overflowing standards
  let remainingStandardsText = '' // Tooltip text with info for each overflowing standard
  const {
    _id: studentId,
    standards,
    firstName,
    lastName,
    avgMastery,
  } = studentData
  const totalStandardsCount = standards.length
  const remainingStandardsWidth =
    2 * STANDARDS_FONT_WIDTH + 2 * STANDARDS_REMAINING_MARGIN // E.g. "+4" So there will be 2 characters

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
          {getInitials(firstName, lastName)}
        </StyledCircularDiv>
        <StudentFullName>{`${firstName || ''} 
		  ${lastName || ''}`}</StudentFullName>
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
                  <Tooltip
                    title={`${std.mastery}% - ${std.desc}`}
                  >{` ${std.identifier} `}</Tooltip>
                </StandardTag>
              )
            }
          }
          // If the standards start to overflow, just update the overflow count and tooltip text.
          remainingStandardsCount += 1
          remainingStandardsText += `${std.identifier} - ${std.mastery}%`
          if (standardIndex < totalStandardsCount - 1)
            remainingStandardsText += ' | '
          return null
        })}
        <EduIf condition={remainingStandardsCount}>
          <StandardRemaining>
            <Tooltip title={remainingStandardsText}>
              +{remainingStandardsCount}
            </Tooltip>
          </StandardRemaining>
        </EduIf>
      </TableStudentStandards>
    </RowContainer>
  )
}

export default StudentDetailRow
