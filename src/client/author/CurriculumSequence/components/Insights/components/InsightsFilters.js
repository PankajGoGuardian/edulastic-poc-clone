import React from "react";
import { Row, Col, Select } from "antd";
import styled from "styled-components";
import {
  greyThemeDark1,
  lightGrey9,
  themeColor,
  greyThemeLight,
  greyThemeLighter,
  titleColor
} from "@edulastic/colors";
import GroupsFilter from "./GroupsFilter";
import { FlexContainer } from "@edulastic/common";

const handleModulesChange = (selected, prevFilters, updateFilters) =>
  updateFilters({
    ...prevFilters,
    modules: selected
  });

const handleStandardsChange = (selected, prevFilters, updateFilters) =>
  updateFilters({
    ...prevFilters,
    standards: selected
  });

const handleMasteryListChange = (selected, prevFilters, updateFilters) =>
  updateFilters({
    ...prevFilters,
    masteryList: selected
  });

const handleGroupsChange = (selected, prevFilters, updateFilters) =>
  updateFilters({
    ...prevFilters,
    groups: selected
  });

const FilterDropdown = ({ onChange, value, options, label, dataCy }) => (
  <StyledRow type="flex" gutter={[0, 10]} style={{ "margin-bottom": "20px" }}>
    <Col span={24}>
      <StyledSpan>{label}</StyledSpan>
    </Col>
    <Col span={24}>
      <StyledSelect
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
      </StyledSelect>
    </Col>
  </StyledRow>
);

const InsightsFilters = ({ data, prevFilters, updateFilters, clearFilter }) => {
  const { modulesData, standardsData, groupsData, masteryData } = data;

  return (
    <StyledRow>
      <FilterHeading justifyContent="space-between">
        <Title>FILTERS</Title>
        <ClearAll data-cy="clearAll" onClick={clearFilter}>
          CLEAR ALL
        </ClearAll>
      </FilterHeading>
      <FilterDropdown
        label="Module"
        onChange={selected => handleModulesChange(selected, prevFilters, updateFilters)}
        value={prevFilters.modules}
        options={modulesData}
      />
      <FilterDropdown
        label="Standards"
        onChange={selected => handleStandardsChange(selected, prevFilters, updateFilters)}
        value={prevFilters.standards}
        options={standardsData}
      />
      <FilterDropdown
        label="Mastery"
        onChange={selected => handleMasteryListChange(selected, prevFilters, updateFilters)}
        value={prevFilters.masteryList}
        options={masteryData}
      />
      <GroupsFilter
        onClickAction={selected => handleGroupsChange(selected, prevFilters, updateFilters)}
        current={prevFilters.groups}
        options={groupsData}
      />
    </StyledRow>
  );
};

export default InsightsFilters;

const StyledRow = styled(Row)`
  width: 100%;
`;

const StyledSpan = styled.span`
  font: 11px/15px Open Sans;
  font-weight: 600;
  text-transform: uppercase;
  color: ${greyThemeDark1};
`;

const StyledSelect = styled(Select)`
  width: 100%;
  .ant-select-selection {
    background: ${greyThemeLighter};
    min-height: 40px;
    padding: 5px;
    border-radius: 2px;
    border: 1px solid ${greyThemeLight};
    .ant-select-selection__rendered {
      .ant-select-selection__placeholder {
        font-size: 13px;
        letter-spacing: 0.24px;
        color: ${lightGrey9};
      }
    }
    .ant-select-arrow {
      top: 20px;
    }
    .ant-select-arrow-icon {
      svg {
        fill: ${themeColor};
      }
    }
  }
`;

const FilterHeading = styled(FlexContainer)`
  margin-bottom: 10px;
`;

const ClearAll = styled.span`
  color: ${themeColor};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  :hover {
    color: ${themeColor};
  }
`;

const Title = styled.span`
  color: ${titleColor};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
`;
