import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { FixedSizeList } from 'react-window'
import { CheckboxLabel, EduElse, EduIf, EduThen } from '@edulastic/common'
import { IconInfoCircle } from '@edulastic/icons'
import { grey } from '@edulastic/colors'
import { keyBy, sortBy } from 'lodash'
import {
  MasteryHeader,
  StudentListContainer,
  StudentListHeading,
  StudentListSubHeading,
  StyledNoDataNotification,
  TABLE_HEADING_HEIGHT,
  TableHeaderContainer,
  TableHeaderMastery,
  TableHeaderName,
  TableHeaderStandards,
  TooltipContainer,
} from './style'
import { FOOTER_HEIGHT } from '../Footer/style'
import {
  RIGHT_SECTION_GAP,
  RIGHT_SECTION_PADDING_TOP,
} from '../Container/style'
import SortingArrows from './SortingArrows'
import StudentDetailRow from './StudentDetailRow'
import { CustomTableTooltip } from '../../../Reports/common/components/customTableTooltip'

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
  const [standardsColumnWidth, setStandardsColumnWidth] = useState(0)
  const standardColumnRef = useRef(null)

  // This is the container of the virtualized list.
  // Height is a numerical input. Thus, calculate the height of
  // the table after deducting the height of the remaining elements
  // above and below the table.
  const tableheight =
    windowHeight -
    (FOOTER_HEIGHT +
      TABLE_HEADING_HEIGHT +
      RIGHT_SECTION_GAP * 2 +
      RIGHT_SECTION_PADDING_TOP)
  // Height of each list item to be rendered.
  const itemHeight = 60

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

  const selectedStudentsById = keyBy(selectedStudents)

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

  useEffect(() => {
    if (standardColumnRef?.current?.clientWidth)
      setStandardsColumnWidth(standardColumnRef?.current?.clientWidth)
  }, [standardColumnRef?.current?.clientWidth])

  // This is the component which will be rendered for each list item in the virtual list.
  const Row = useCallback(
    ({ index, style }) => (
      <StudentDetailRow
        studentData={sortedStudentList[index]}
        standardsColumnWidth={standardsColumnWidth}
        style={style}
        selectedStudentsById={selectedStudentsById}
        handleRowCheckboxChange={handleRowCheckboxChange}
      />
    ),
    [standardsColumnWidth, sortedStudentList, selectedStudents]
  )

  return (
    <StudentListContainer>
      <StudentListHeading>
        Step 2 : Select Students for Intervention
      </StudentListHeading>
      <StudentListSubHeading>
        {selectedStudents.length}/{sortedStudentList.length} students selected{' '}
        <CustomTableTooltip
          title={
            <TooltipContainer isLight>
              Student list below only includes those who have{' '}
              <span style={{ fontWeight: 600 }}>
                at least one Standard to be improved
              </span>{' '}
              as per left criteria
            </TooltipContainer>
          }
          getCellContents={() => <IconInfoCircle width="16px" height="16px" />}
        />
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
          <MasteryHeader>AVG. MASTERY</MasteryHeader>
          <CustomTableTooltip
            title={
              <TooltipContainer>
                Average mastery is calculated based on selected standards to be
                improved
              </TooltipContainer>
            }
            getCellContents={() => (
              <IconInfoCircle width="16px" height="16px" />
            )}
          />
          <SortingArrows
            sortDirection={masterySort}
            changeSortDirection={setMasterySort}
          />
        </TableHeaderMastery>
        <TableHeaderStandards ref={standardColumnRef}>
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
            height={tableheight}
            itemSize={itemHeight}
            itemCount={sortedStudentList.length}
            style={
              sortedStudentList.length * itemHeight > tableheight
                ? {
                    border: `1px solid ${grey}`,
                    borderWidth: '0 0 1px 0',
                    borderRadius: '0 0 5px 5px',
                  }
                : {}
            }
          >
            {Row}
          </FixedSizeList>
        </EduElse>
      </EduIf>
    </StudentListContainer>
  )
}

export default StudentList
