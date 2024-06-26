import React, { useContext } from "react";
import styled from "styled-components";
import { Select as AntSelect } from "antd";
import { lightBlue1 } from "@edulastic/colors";
import { MathSpan, ScrollContext } from "@edulastic/common";
import { subOptions } from "../../constants";

const { Option } = AntSelect;

const TextDropdown = ({ styles, options, placeholder, userAnswer, disableResponse, onChange, displayStyleOption }) => {
  const isDahsline = subOptions.DASHED_LINE === displayStyleOption;
  const { getScrollElement } = useContext(ScrollContext);
  return (
    <SelectWrapper style={{ ...styles, minWidth: styles.minWidthpx }}>
      <Select
        isDahsline={isDahsline}
        value={userAnswer}
        placeholder={placeholder}
        disabled={disableResponse}
        onChange={onChange}
        getPopupContainer={getScrollElement}
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
    ${({ isDahsline }) => (isDahsline ? "border-bottom: 2px dashed;" : `background: ${lightBlue1}`)};
    border-radius: 0px;
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
