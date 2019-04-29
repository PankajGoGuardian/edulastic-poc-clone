//@ts-check
import React, { useState } from "react";
import { AutoComplete, Input, Icon, Menu } from "antd";
import styled from "styled-components";

import { useInternalEffect } from "../../hooks/useInternalEffect";

import { black } from "@edulastic/colors";

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

const AutocompleteDropDown = ({
  className,
  containerClassName = "",
  prefix = "",
  by = { key: "", title: "" },
  selectCB,
  data = [],
  comData,
  iconType = "caret-down"
}) => {
  const [dropDownData, setDropDownData] = useState(data);
  const [selected, setSelected] = useState(by);
  const [text, setText] = useState(by.title);

  useInternalEffect(() => {
    let item = null;
    if (data.length) {
      item = data.find((item, index) => {
        if (item.key === selected.key) {
          return true;
        }
      });
      if (!item) {
        item = data[0];
      }
    } else {
      item = { key: "", title: "" };
    }

    setSelected(item);
    setText(item.title);
    setDropDownData(data);
  }, [data]);

  useInternalEffect(() => {
    let item = data.find((item, index) => {
      if (typeof by === "string" && item.key === by) {
        return true;
      }
      if (typeof by === "object" && item.key === by.key) {
        return true;
      }
    });

    if (!item && data.length) {
      item = data[0];
    } else if (!item && !data.length) {
      item = { key: "", title: "" };
    }

    setSelected(item);
    setText(item.title);
  }, [by]);

  const buildDropDownData = datum => {
    let arr = [
      <OptGroup key={"group"} label={prefix ? prefix : ""}>
        {datum.map((item, index) => {
          return (
            <Option key={item.key} title={item.title}>
              {item.title}
            </Option>
          );
        })}
      </OptGroup>
    ];
    return arr;
  };

  const onSearch = value => {
    if (value.length > 2) {
      let regExp = new RegExp(`${value}`, "i");
      let searchedData = data.filter((item, index) => {
        if (regExp.test(item.title)) {
          return true;
        } else {
          return false;
        }
      });
      setDropDownData(searchedData);
    } else {
      if (data.length !== dropDownData.length) {
        setDropDownData(data);
      }
    }
  };

  const onBlur = key => {
    let item = data.find(o => o.key === key);
    if (!item) {
      setText(selected.title);
    }
  };

  const onSelect = (key, item) => {
    let obj = { key: key, title: item.props.title };
    setSelected(obj);
    selectCB(obj, comData);
  };

  const onChange = value => {
    setText(value);
  };

  const onFocus = () => {
    setDropDownData(data);
  };

  const dataSource = buildDropDownData(dropDownData);

  return (
    <StyledDiv className={`${containerClassName} autocomplete-dropdown`}>
      <AutoComplete
        dataSource={dataSource}
        dropdownClassName={className}
        className={className}
        onSearch={onSearch}
        onBlur={onBlur}
        onFocus={onFocus}
        onSelect={onSelect}
        onChange={onChange}
        value={text}
      >
        <Input suffix={<Icon type={iconType} className="" />} />
      </AutoComplete>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  margin: 0px 5px;
  overflow: hidden;
  button {
    white-space: pre-wrap;
  }
`;

const StyledAutocompleteDropDown = styled(AutocompleteDropDown)`
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

export { StyledAutocompleteDropDown as AutocompleteDropDown };
