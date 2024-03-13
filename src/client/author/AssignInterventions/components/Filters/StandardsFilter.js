import React, { useMemo } from 'react'
import { SelectInputStyled } from '@edulastic/common'
import { Select } from 'antd'
import { keyBy, sortBy } from 'lodash'
import {
  FilterSubHeadingContainer,
  StandardNameContainer,
  StandardDescContainer,
  StandardStudentCountContainer,
} from './style'
import { CustomTableTooltip } from '../../../Reports/common/components/customTableTooltip'
import { TooltipContainer } from '../StudentList/style'

const StandardsFilter = ({
  options,
  selectedStandards,
  setSelectedStandards,
  studentStandardsData,
  masteryRange,
}) => {
  // Count the number of students which match the mastery range criteria for each standard.
  const StudentCountPerStandard = useMemo(
    () =>
      keyBy(
        options.map(({ _id }) => ({
          _id,
          studentCount: Object.values(studentStandardsData).reduce(
            (accumulator, studentData) => {
              if (
                _id in studentData &&
                studentData[_id] >= masteryRange[0] &&
                studentData[_id] <= masteryRange[1]
              )
                return accumulator + 1
              return accumulator
            },
            0
          ),
        })),
        '_id'
      ),
    [options, studentStandardsData, masteryRange]
  )

  const sortedOptions = useMemo(
    () =>
      sortBy(
        options,
        (option) => -StudentCountPerStandard[option._id].studentCount
      ),
    [options, StudentCountPerStandard]
  )

  return (
    <div>
      <FilterSubHeadingContainer>Focusing on</FilterSubHeadingContainer>
      <SelectInputStyled
        mode="multiple"
        onChange={(standards) => setSelectedStandards(standards)}
        value={selectedStandards}
        placeholder="All Test Standards"
        optionLabelProp="label"
      >
        {sortedOptions.map((option) => (
          <Select.Option
            key={option._id}
            value={option._id}
            title={option.name}
            label={option.name}
          >
            <StandardNameContainer>{option.name}</StandardNameContainer>
            <CustomTableTooltip
              title={<TooltipContainer isLight>{option.desc}</TooltipContainer>}
              getCellContents={() => (
                <StandardDescContainer>{option.desc}</StandardDescContainer>
              )}
            />
            <StandardStudentCountContainer>
              {StudentCountPerStandard[option._id].studentCount} STUDENTS
            </StandardStudentCountContainer>
          </Select.Option>
        ))}
      </SelectInputStyled>
    </div>
  )
}

export default StandardsFilter
