import React, { useState, useRef } from "react";
import next from "immer";
import { find, map, findIndex } from "lodash";
import { AutoComplete, Input, Icon, Menu, Select } from "antd";
import styled from "styled-components";

import { useInternalEffect } from "../../hooks/useInternalEffect";

import { black } from "@edulastic/colors";

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

const MultipleSelect = ({
  className,
  containerClassName = "",
  prefix = "",
  by = [{ key: "", title: "" }],
  selectCB,
  data = [],
  comData,
  placeholder = ""
}) => {
  const [text, setText] = useState(by.title);
  const autoRef = useRef(null);
  const textChangeStatusRef = useRef(false);

  const buildDropDownData = datum => {
    let arr = [
      <OptGroup key={"group"} label={prefix ? prefix : ""}>
        {datum.map((item, index) => {
          return (
            <Option key={item.key} optionKey={item.key} title={item.title} value={item.title}>
              {item.title}
            </Option>
          );
        })}
      </OptGroup>
    ];
    return arr;
  };

  const onChange = (values, items) => {
    const newSelectedItems = map(items, ({ props = {} }) => ({
      key: props.optionKey || "",
      title: props.title || ""
    }));

    selectCB(newSelectedItems, comData);
  };

  const dataSource = buildDropDownData(data);
  const selected = [].concat(by); // convert selected value to an array even if an object is passed

  return (
    <StyledDiv className={`${containerClassName} autocomplete-dropdown`}>
      <Select
        dropdownClassName={className}
        className={className}
        onChange={onChange}
        value={map(selected, item => item.title)}
        ref={autoRef}
        placeholder={placeholder}
        mode="multiple"
      >
        {dataSource}
      </Select>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  margin: 0px 5px;
  overflow: hidden;
  button {
    white-space: pre-wrap;
  }
  input {
    cursor: pointer;
  }
`;

const StyledMultipleSelect = styled(MultipleSelect)`
  width: 100%;

  .ant-select-dropdown-menu {
    display: flex;
    flex-direction: column;
    .ant-select-dropdown-menu-item-group {
      display: flex;
      flex-direction: column;
      .ant-select-dropdown-menu-item-group-title {
        font-weight: 900;
        color: ${black};
        cursor: default;
      }

      .ant-select-dropdown-menu-item-group-list {
        flex: 1;
        overflow: auto;
      }
    }
  }

  .ant-select-dropdown-menu-item-disabled {
    font-weight: 900;
    color: ${black};
    cursor: default;
  }
`;

export { StyledMultipleSelect as MultipleSelect };
