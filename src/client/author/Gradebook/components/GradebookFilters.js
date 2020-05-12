import React from "react";
import styled from "styled-components";

// components
import { Row, Col, Select } from "antd";
import GroupsFilter from "./GroupsFilter";
import { FieldLabel, SelectInputStyled } from "@edulastic/common";

// constants
import { themeColor, titleColor } from "@edulastic/colors";

const FilterDropdown = ({ onChange, value, options, label, dataCy }) => (
  <Col span={24}>
    <FieldLabel>{label}</FieldLabel>
    <SelectInputStyled
      showArrow
      data-cy={dataCy}
      placeholder={`Select ${label}`}
      mode="tags"
      onChange={onChange}
      value={value}
      labelInValue
      maxTagCount={4}
      maxTagTextLength={10}
    >
      {options.map(data => (
        <Select.Option key={data.id} value={data.id}>
          {data.name}
        </Select.Option>
      ))}
    </SelectInputStyled>
  </Col>
);

const GradebookFilters = ({ data, filters, updateFilters, clearFilters }) => (
  <div style={{ minWidth: "220px", maxWidth: "220px" }}>
    <StyledRow type="flex">
      {/* <Col span={24} style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}}>
          <StyledSpan> FILTERS </StyledSpan>
          <StyledSpan onClick={clearFilters}> CLEAR ALL </StyledSpan>
        </Col> */}
      <FilterDropdown
        label="Assessment"
        onChange={selected => updateFilters({ ...filters, assessments: selected })}
        value={filters.assessments}
        options={data.assessments}
      />
      <FilterDropdown
        label="Status"
        onChange={selected => updateFilters({ ...filters, statuses: selected })}
        value={filters.statuses}
        options={data.statuses}
      />
      <FilterDropdown
        label="Class"
        onChange={selected => updateFilters({ ...filters, classes: selected })}
        value={filters.classes}
        options={data.classes}
      />
      <FilterDropdown
        label="Grade"
        onChange={selected => updateFilters({ ...filters, grades: selected })}
        value={filters.grades}
        options={data.grades}
      />
      <FilterDropdown
        label="Subject"
        onChange={selected => updateFilters({ ...filters, subjects: selected })}
        value={filters.subjects}
        options={data.subjects}
      />
      <FilterDropdown
        label="Year"
        onChange={selected => updateFilters({ ...filters, years: selected })}
        value={filters.years}
        options={data.years}
      />
      <FilterDropdown
        label="Test Type"
        onChange={selected => updateFilters({ ...filters, testTypes: selected })}
        value={filters.testTypes}
        options={data.testTypes}
      />
      <GroupsFilter
        onClick={selected => updateFilters({ ...filters, groups: selected })}
        current={filters.groups}
        options={data.groups}
      />
    </StyledRow>
  </div>
);

export default GradebookFilters;

const StyledRow = styled(Row)`
  width: 100%;
  > div {
    margin-bottom: 20px;
  }
`;

const StyledSpan = styled.span`
  letter-spacing: ${props => (props.onClick ? "0px" : "0.3px")};
  color: ${props => (props.onClick ? themeColor : titleColor)};
  font-size: ${props => (props.onClick ? "12px" : "13px")};
  font-weight: 600;
`;
