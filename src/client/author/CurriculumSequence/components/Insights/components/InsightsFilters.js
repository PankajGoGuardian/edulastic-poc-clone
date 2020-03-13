import React from "react";
import { Row, Col, Select } from "antd";
import styled from "styled-components";

import { greyThemeDark1, lightGrey9, themeColor, greyThemeLight, greyThemeLighter } from "@edulastic/colors";

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

const FilterDropdown = ({ onChange, value, options, label, dataCy }) => (
  <Row style={{ width: "100%", "margin-bottom": "20px" }} type="flex" gutter={[0, 10]}>
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
  </Row>
);

const InsightsFilters = ({ data, prevFilters, updateFilters }) => {
  const { modulesData, standardsData, groupsData, masteryData } = data;

  return (
    <Row style={{ width: "100%" }}>
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
    </Row>
  );
};

export default InsightsFilters;

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
