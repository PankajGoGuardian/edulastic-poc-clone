import React from "react";
import { Row, Col, Select, Checkbox, Tooltip } from "antd";
import styled from "styled-components";
import { greyThemeDark1, themeColor, titleColor } from "@edulastic/colors";
import { IconInfo } from "@edulastic/icons";
import { FlexContainer, FieldLabel, SelectInputStyled } from "@edulastic/common";
import GroupsFilter from "./GroupsFilter";

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
  <StyledRow type="flex" style={{ marginBottom: "20px" }}>
    <Col span={24}>
      <FieldLabel>{label}</FieldLabel>
      <SelectInputStyled
        showArrow
        data-cy={dataCy}
        placeholder={`All ${label}`}
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
  </StyledRow>
);

const InsightsFilters = ({
  data,
  prevFilters,
  updateFilters,
  overallProgressCheck,
  setOverallProgressCheck,
  clearFilter
}) => {
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
        label="Modules"
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
      <StyledCheckbox checked={overallProgressCheck} onChange={e => setOverallProgressCheck(e.target.checked)}>
        Include all Assignments
        <Tooltip
          placement="right"
          title="It will include all the assignments that the student has attempted in current school year"
        >
          <IconInfo height={12} width={12} />
        </Tooltip>
      </StyledCheckbox>
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

const StyledCheckbox = styled(Checkbox)`
  margin-bottom: 20px;
  font: 11px/15px Open Sans;
  font-weight: 600;
  white-space: nowrap;
  text-transform: uppercase;
  color: ${greyThemeDark1};
  span {
    display: inline-flex;
    align-items: center;
  }
  svg {
    margin-left: 8px;
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
