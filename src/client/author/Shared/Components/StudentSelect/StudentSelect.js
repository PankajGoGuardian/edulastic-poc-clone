import { LegendContainer, Legends } from '@edulastic/common'
import { Select } from 'antd'
import { find } from 'lodash'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { testActivityStatus } from '@edulastic/constants'
import { Container, StyledSelect } from './styled'

const SortBar = ({
  handleChange,
  students,
  selectedStudent,
  isPresentationMode,
  hasOnlySelectList,
  selectStyle,
}) => {
  const onSortChange = (testActivityId) => {
    if (testActivityId !== undefined) {
      if (handleChange) {
        const selected = find(
          students,
          (student) => student.testActivityId === testActivityId
        )
        handleChange(selected.studentId, testActivityId)
      }
    }
  }

  const studentIcon = (student) => (
    <span>
      <i className={`fa fa-${student.icon}`} style={{ color: student.color }} />{' '}
      {student.fakeName}{' '}
    </span>
  )

  const valid = (x) => !!x.testActivityId

  const selected =
    find(
      students,
      (student) => student.studentId === selectedStudent && valid(student)
    ) || students.filter(valid)[0]
  const user = isPresentationMode
    ? studentIcon(selected)
    : selected && selected.testActivityId

  const studentSelectList = (
    <StyledSelect
      value={user}
      onChange={onSortChange}
      style={{ ...selectStyle }}
    >
      {students.map((student, index) => (
        <Select.Option
          key={index}
          value={student.testActivityId || null}
          disabled={
            !valid(student) ||
            student.UTASTATUS === testActivityStatus.NOT_STARTED
          }
        >
          {isPresentationMode ? studentIcon(student) : student.studentName}
        </Select.Option>
      ))}
    </StyledSelect>
  )

  if (hasOnlySelectList) {
    return <Container>{studentSelectList}</Container>
  }

  return (
    <>
      {students && students.filter(valid).length !== 0 && (
        <LegendContainer>
          <Legends />
          <Container>{studentSelectList}</Container>
        </LegendContainer>
      )}
    </>
  )
}

SortBar.propTypes = {
  handleChange: PropTypes.func,
  students: PropTypes.array.isRequired,
  selectedStudent: PropTypes.string,
  isPresentationMode: PropTypes.bool,
}

SortBar.defaultProps = {
  selectedStudent: '',
  handleChange: () => {},
  isPresentationMode: false,
}

export default SortBar
