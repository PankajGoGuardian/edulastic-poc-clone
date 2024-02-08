import { FlexContainer, SelectInputStyled } from '@edulastic/common'
import { Select } from 'antd'
import React from 'react'
import selectsData from '../../../TestPage/components/common/selectsData'

const { allGrades, allSubjects, allStatus } = selectsData

const Filters = ({
  setFilterGrades,
  setFilterSubjects,
  filterGrades,
  filterSubjects,
  filterStatus,
  setFilterStatus,
  isTestLibraryLoading,
}) => {
  return (
    <FlexContainer
      justifyContent="flex-start"
      mr="16px"
      marginBottom="16px"
      mt="16px"
    >
      <FlexContainer mr="16px" width="250px">
        <SelectInputStyled
          mode="multiple"
          showSearch
          value={filterGrades}
          onChange={setFilterGrades}
          disabled={isTestLibraryLoading}
          placeholder="Grades"
        >
          {allGrades.map(({ text, value }) => (
            <Select.Option key={text} value={value}>
              {text}
            </Select.Option>
          ))}
        </SelectInputStyled>
      </FlexContainer>
      <FlexContainer mr="16px" width="250px">
        <SelectInputStyled
          mode="multiple"
          showSearch
          value={filterSubjects}
          onChange={setFilterSubjects}
          disabled={isTestLibraryLoading}
          placeholder="Subjects"
        >
          {allSubjects.map(({ text, value }) => (
            <Select.Option key={text} value={value}>
              {text}
            </Select.Option>
          ))}
        </SelectInputStyled>
      </FlexContainer>
      <FlexContainer mr="16px" width="250px">
        <SelectInputStyled
          showSearch
          value={filterStatus}
          onChange={setFilterStatus}
          disabled={isTestLibraryLoading}
          placeholder="Status"
        >
          {allStatus.map(({ text, value }) => (
            <Select.Option key={text} value={value}>
              {text}
            </Select.Option>
          ))}
        </SelectInputStyled>
      </FlexContainer>
    </FlexContainer>
  )
}

export default Filters
