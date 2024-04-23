import React, { useRef } from 'react'
import styled from 'styled-components'

// components
import { Row, Col, Select } from 'antd'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'

// constants
import { themeColor, titleColor } from '@edulastic/colors'
import GroupsFilter from './GroupsFilter'

const FilterDropdown = ({
  label,
  allOptionText,
  mode,
  onChange,
  value,
  options,
  dataCy,
  el,
  isRequired,
}) => (
  <Col span={24}>
    <FieldLabel isRequired={isRequired}>{label}</FieldLabel>
    <SelectInputStyled
      data-cy={dataCy}
      placeholder={allOptionText}
      mode={mode}
      ref={el}
      onChange={onChange}
      onSelect={() => el && el?.current?.blur()}
      onDeselect={() => el && el?.current?.blur()}
      value={value}
      maxTagCount={4}
      maxTagTextLength={10}
      optionFilterProp="children"
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
    >
      {options &&
        options.map((data) => (
          <Select.Option key={data.id} value={data.id}>
            {data.name === 'All' ? allOptionText : data.name}
          </Select.Option>
        ))}
    </SelectInputStyled>
  </Col>
)

const GradebookFilters = ({
  data,
  filters,
  updateFilters,
  clearFilters,
  onNewGroupClick,
}) => {
  const assignmentRef = useRef()
  const classRef = useRef()
  const gradeRef = useRef()
  const subjectRef = useRef()

  return (
    <div style={{ minWidth: '220px', maxWidth: '220px' }}>
      <StyledRow type="flex">
        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <StyledSpan> FILTERS </StyledSpan>
          <StyledSpan onClick={clearFilters} data-cy="clearFilters">
            {' '}
            CLEAR ALL{' '}
          </StyledSpan>
        </Col>
        <FilterDropdown
          label="Class"
          allOptionText="Select Classes"
          mode="multiple"
          el={classRef}
          onChange={(selected) =>
            updateFilters({ ...filters, classIds: selected })
          }
          value={filters.classIds}
          options={data.classes}
          dataCy="filter-class"
          isRequired
        />
        <FilterDropdown
          label="Assessment"
          allOptionText="All Assessments"
          mode="multiple"
          el={assignmentRef}
          onChange={(selected) =>
            updateFilters({ ...filters, assessmentIds: selected })
          }
          value={filters.assessmentIds}
          options={data.assessments}
          dataCy="filter-test-name"
        />
        <FilterDropdown
          label="Status"
          allOptionText="All Statuses"
          onChange={(selected) =>
            updateFilters({ ...filters, status: selected })
          }
          value={filters.status}
          options={data.statusList}
          dataCy="filter-status"
        />
        <FilterDropdown
          label="Class Grade"
          allOptionText="All Grades"
          mode="multiple"
          el={gradeRef}
          onChange={(selected) =>
            updateFilters({ ...filters, grades: selected })
          }
          value={filters.grades}
          options={data.grades}
          dataCy="grades"
        />
        <FilterDropdown
          label="Class Subject"
          allOptionText="All Class Subjects"
          mode="multiple"
          el={subjectRef}
          onChange={(selected) =>
            updateFilters({ ...filters, subjects: selected })
          }
          value={filters.subjects}
          options={data.subjects}
          dataCy="subjects"
        />
        <FilterDropdown
          label="Year"
          onChange={(selected) =>
            updateFilters({ ...filters, termId: selected })
          }
          value={filters.termId}
          options={data.terms}
          dataCy="schoolYear"
        />
        <FilterDropdown
          label="Test Type"
          allOptionText="All Test Types"
          onChange={(selected) =>
            updateFilters({ ...filters, testType: selected })
          }
          value={filters.testType}
          options={data.testTypes}
          dataCy="filter-testType"
        />
        <GroupsFilter
          onNewGroupClick={onNewGroupClick}
          onClick={(selected) =>
            updateFilters({ ...filters, groupId: selected })
          }
          current={filters.groupId}
          options={data.groups}
        />
      </StyledRow>
    </div>
  )
}

export default GradebookFilters

const StyledRow = styled(Row)`
  width: 100%;
  > div {
    margin-bottom: 20px;
  }
`

const StyledSpan = styled.span`
  letter-spacing: ${(props) => (props.onClick ? '0px' : '0.3px')};
  color: ${(props) => (props.onClick ? themeColor : titleColor)};
  font-size: ${(props) => (props.onClick ? '12px' : '13px')};
  font-weight: 600;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
`
