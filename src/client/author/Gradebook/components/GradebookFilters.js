import React from "react";
import styled from "styled-components";

// components
import { Row, Col, Select } from "antd";
import GroupsFilter from "./GroupsFilter";
import { FieldLabel, SelectInputStyled } from "@edulastic/common";

// constants
import { themeColor, titleColor } from "@edulastic/colors";

const FilterDropdown = ({ label, mode, onChange, value, options, dataCy }) => (
  <Col span={24}>
    <FieldLabel>{label}</FieldLabel>
    <SelectInputStyled
      showArrow
      data-cy={dataCy}
      placeholder={`All ${label}`}
      mode={mode}
      onChange={onChange}
      value={value}
      maxTagCount={4}
      maxTagTextLength={10}
      optionFilterProp="children"
      getPopupContainer={triggerNode => triggerNode.parentNode}
    >
      {options.map(data => (
        <Select.Option key={data.id} value={data.id}>
          {data.name === "All" ? `All ${label}` : data.name}
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
        mode="multiple"
        onChange={selected => updateFilters({ ...filters, assessmentIds: selected })}
        value={filters.assessmentIds}
        options={data.assessments}
      />
      <FilterDropdown
        label="Status"
        onChange={selected => updateFilters({ ...filters, status: selected })}
        value={filters.status}
        options={data.statusList}
      />
      <FilterDropdown
        label="Class"
        mode="multiple"
        onChange={selected => updateFilters({ ...filters, classIds: selected })}
        value={filters.classIds}
        options={data.classes}
      />
      <FilterDropdown
        label="Grade"
        mode="multiple"
        onChange={selected => updateFilters({ ...filters, grades: selected })}
        value={filters.grades}
        options={data.grades}
      />
      <FilterDropdown
        label="Subject"
        mode="multiple"
        onChange={selected => updateFilters({ ...filters, subjects: selected })}
        value={filters.subjects}
        options={data.subjects}
      />
      <FilterDropdown
        label="Year"
        onChange={selected => updateFilters({ ...filters, termId: selected })}
        value={filters.termId}
        options={data.terms}
      />
      <FilterDropdown
        label="Test Type"
        onChange={selected => updateFilters({ ...filters, testType: selected })}
        value={filters.testType}
        options={data.testTypes}
      />
      <GroupsFilter
        onClick={selected => updateFilters({ ...filters, groupId: selected })}
        current={filters.groupId}
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
