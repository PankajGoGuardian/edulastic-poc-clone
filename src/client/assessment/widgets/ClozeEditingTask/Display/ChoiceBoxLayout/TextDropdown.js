import React from "react";
import styled from "styled-components";
import { Select as AntSelect } from "antd";
import { green } from "@edulastic/colors";
import { MathSpan } from "@edulastic/common";
import { subOptions } from "../../constants";

const { Option } = AntSelect;

const TextDropdown = ({ styles, options, placeholder, userAnswer, disableResponse, onChange, displayStyleOption }) => {
  const isDahsline = subOptions.DASHED_LINE === displayStyleOption;

  return (
    <SelectWrapper style={styles}>
      <Select
        isDahsline={isDahsline}
        value={userAnswer?.value}
        placeholder={placeholder}
        disabled={disableResponse}
        onChange={onChange}
      >
        {options.map((response, respID) => (
          <Option title={response} value={response} key={respID}>
            <MathSpan dangerouslySetInnerHTML={{ __html: response }} />
          </Option>
        ))}
      </Select>
    </SelectWrapper>
  );
};

export default TextDropdown;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  vertical-align: bottom;
`;

const Select = styled(AntSelect)`
  width: 100%;
  height: 100%;

  & .ant-select-selection {
    border: 0px;
    ${({ isDahsline }) => (isDahsline ? "border-bottom: 2px dashed;" : `background: ${green}`)};
  }

  & .ant-select-selection__rendered {
    padding: 8px 10px;
    margin: 0px;
    line-height: 1.2;
  }

  & .ant-select-arrow {
    display: none;
  }
`;
