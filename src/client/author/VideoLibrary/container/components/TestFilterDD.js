import { secondaryTextColor } from '@edulastic/colors'
import { FlexContainer, SelectInputStyled } from '@edulastic/common'
import { Select } from 'antd'
import React from 'react'
import styled from 'styled-components'

const TestFiltersDD = ({
  options = [],
  filterValue,
  handleFilterChanges,
  isLoading,
  placeholder,
  filterKey,
  filterHeader,
  mode,
}) => {
  return (
    <FlexContainer mr="16px" width="250px" flexDirection="column">
      <FilterHeader>{filterHeader}</FilterHeader>
      <SelectInputStyled
        data-cy={`${filterKey}DropDown`}
        mode={mode}
        showSearch
        value={filterValue}
        onChange={(value) => handleFilterChanges({ key: filterKey, value })}
        disabled={isLoading}
        placeholder={placeholder}
      >
        {options.map(({ text, value }) => (
          <Select.Option key={text} value={value}>
            {text}
          </Select.Option>
        ))}
      </SelectInputStyled>
    </FlexContainer>
  )
}

export default TestFiltersDD

const FilterHeader = styled.div`
  color: ${secondaryTextColor};
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
  margin: 0px 0px 7px;
`
