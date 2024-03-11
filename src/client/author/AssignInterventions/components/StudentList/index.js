import React, { useMemo, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { CheckboxLabel, EduElse, EduIf, EduThen } from '@edulastic/common'
import { IconInfoCircle } from '@edulastic/icons'
import { Tooltip } from 'antd'
import { sortBy } from 'lodash'
import {
  RowContainer,
  StandardTag,
  StandardTotal,
  StudentFullName,
  StudentListContainer,
  StudentListHeading,
  StudentListSubHeading,
  StyledCircularDiv,
  StyledNoDataNotification,
  TABLE_HEADING_HEIGHT,
  TableHeaderContainer,
  TableHeaderMastery,
  TableHeaderName,
  TableHeaderStandards,
  TableStudentMastery,
  TableStudentName,
  TableStudentStandards,
} from './style'
import { FOOTER_HEIGHT } from '../Footer/style'
import {
  RIGHT_SECTION_GAP,
  RIGHT_SECTION_PADDING_TOP,
} from '../Container/style'
import SortingArrows from './SortingArrows'

const getInitials = (firstName, lastName) => {
  if (firstName && lastName)
    return `${firstName[0] + lastName[0]}`.toUpperCase()
  if (firstName) return `${firstName.substr(0, 2)}`.toUpperCase()
  if (lastName) return `${lastName.substr(0, 2)}`.toUpperCase()
}

const StudentList = ({
  studentListWithStandards,
  selectedStudents,
  setSelectedStudents,
  windowHeight,
}) => {
  // Possible sort directions:
  // 0: No sorting
  // 1: Ascending Order
  // -1: Descending Order
  const [masterySort, setMasterySort] = useState(0)
  const [standardSort, setStandardSort] = useState(0)

  // Average Mastery = Sum of mastery in standards/Total number of standards
  const sortedStudentList = useMemo(
    () =>
      masterySort || standardSort
        ? sortBy(studentListWithStandards, [
            (x) => masterySort * x.avgMastery,
            (x) => standardSort * x.standards.length,
          ])
        : studentListWithStandards,
    [masterySort, standardSort, studentListWithStandards]
  )

  const handleRowCheckboxChange = (event, studentId) => {
    if (event.target.checked) {
      // Add studentId to selected students array
      setSelectedStudents([...selectedStudents, studentId])
    } else {
      // Remove studentId from selected students array
      setSelectedStudents(selectedStudents.filter((elem) => elem !== studentId))
    }
  }

  const handleAllSelect = (event) => {
    if (event.target.checked) {
      setSelectedStudents(
        studentListWithStandards.map((student) => student._id)
      )
    } else {
      setSelectedStudents([])
    }
  }

  // This is the component which will be rendered for each list item in the virtual list.
  const Row = ({ index, style }) => (
    <RowContainer style={style} key={sortedStudentList[index]._id}>
      <TableStudentName>
        <CheckboxLabel
          checked={selectedStudents.includes(sortedStudentList[index]._id)}
          onChange={(event) => {
            handleRowCheckboxChange(event, sortedStudentList[index]._id)
          }}
          style={{ marginRight: '10px' }}
        />
        <StyledCircularDiv>
          {getInitials(
            sortedStudentList[index].firstName,
            sortedStudentList[index].lastName
          )}
        </StyledCircularDiv>
        <StudentFullName>{`${sortedStudentList[index].firstName || ''} 
            ${sortedStudentList[index].lastName || ''}`}</StudentFullName>
      </TableStudentName>
      <TableStudentMastery>
        {sortedStudentList[index].avgMastery} {'%'}
      </TableStudentMastery>
      <TableStudentStandards>
        <StandardTotal>
          {sortedStudentList[index].standards.length}
        </StandardTotal>
        {sortedStudentList[index].standards.map((std) => (
          <StandardTag>
            <Tooltip
              title={`${std.mastery}% - ${std.tloDesc}`}
            >{` ${std.identifier} `}</Tooltip>
          </StandardTag>
        ))}
      </TableStudentStandards>
    </RowContainer>
  )

  return (
    <StudentListContainer>
      <StudentListHeading>
        Step 2 : Select Students for Intervention
      </StudentListHeading>
      <StudentListSubHeading>
        {selectedStudents.length}/{sortedStudentList.length} students selected{' '}
        <Tooltip title="Student list below only includes those who have atleast one Standard to be improved as per left criteria">
          <IconInfoCircle width="16px" height="16px" />
        </Tooltip>
      </StudentListSubHeading>
      <TableHeaderContainer>
        <TableHeaderName>
          <CheckboxLabel
            checked={
              // When the student list is non empty and all students have been selected.
              sortedStudentList.length &&
              selectedStudents.length === sortedStudentList.length
            }
            onChange={handleAllSelect}
            style={{ marginRight: '10px' }}
          />
          STUDENT NAME
        </TableHeaderName>
        <TableHeaderMastery>
          AVG. MASTERY
          <Tooltip title="Average mastery is calculated based on selected standards to be improved">
            <IconInfoCircle width="16px" height="16px" />
          </Tooltip>
          <SortingArrows
            sortDirection={masterySort}
            changeSortDirection={setMasterySort}
          />
        </TableHeaderMastery>
        <TableHeaderStandards>
          STANDARDS TO BE IMPROVED
          <SortingArrows
            sortDirection={standardSort}
            changeSortDirection={setStandardSort}
          />
        </TableHeaderStandards>
      </TableHeaderContainer>

      <EduIf condition={!sortedStudentList.length}>
        <EduThen>
          <StyledNoDataNotification heading="No Student found matching the standards mastery criteria" />
        </EduThen>
        <EduElse>
          <FixedSizeList
            // This is the container of the virtualized list.
            // Height is a numerical input. Thus, calculate the height of
            // the table after deducting the height of the remaining elements
            // above and below the table.
            height={
              windowHeight -
              (FOOTER_HEIGHT +
                TABLE_HEADING_HEIGHT +
                RIGHT_SECTION_GAP * 2 +
                RIGHT_SECTION_PADDING_TOP)
            }
            // Height of each list item to be rendered.
            itemSize={60}
            itemCount={sortedStudentList.length}
          >
            {Row}
          </FixedSizeList>
        </EduElse>
      </EduIf>
    </StudentListContainer>
  )
}

export default StudentList
