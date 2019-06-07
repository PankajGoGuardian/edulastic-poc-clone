//@ts-check
import React, { useState, useRef } from "react";
import { AutoComplete, Input, Icon, Menu } from "antd";
import styled from "styled-components";

import { useInternalEffect } from "../../../author/Reports/common/hooks/useInternalEffect";

import { black } from "@edulastic/colors";

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

const RemoteAutocompleteDropDown = ({
  className,
  containerClassName = "",
  prefix = "",
  by = { key: "", title: "" },
  selectCB = (obj, comData) => {},
  onSearchTextChange = value => {},
  data = [],
  comData,
  iconType = "caret-down",
  onChange
}) => {
  const [dropDownData, setDropDownData] = useState(data);
  const [selected, setSelected] = useState(by);
  const [text, setText] = useState(by.title);
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const autoRef = useRef(null);
  const textChangeStatusRef = useRef(false);

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
  }, [by]);

  const buildDropDownData = datum => {
    let arr = datum.map((item, index) => {
      return (
        <Option key={item.key} title={item.title}>
          {item.title}
        </Option>
      );
    });
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
      if (searchedData.length === 0) {
        onSearchTextChange(value);
      }
    } else {
      if (data.length !== dropDownData.length) {
        setDropDownData(data);
      }
    }
    setText(value);
    triggerChange(value);
    textChangeStatusRef.current = true;
  };

  const onBlur = key => {
    let item = data.find(o => o.key === key);
    if (!item) {
      setText(selected.title);
      triggerChange(selected.title);
    }

    textChangeStatusRef.current = false;
  };

  const onSelect = (key, item) => {
    let obj = { key: key, title: item.props.title };
    setSelected(obj);
    selectCB(obj, comData);

    textChangeStatusRef.current = false;
  };

  const _onChange = value => {
    if (textChangeStatusRef.current !== true) {
      autoRef.current.blur();
    }
  };

  const onFocus = () => {
    setText("");
    triggerChange("");
    setDropDownData(data);
    textChangeStatusRef.current = true;
  };

  const onDropdownVisibleChange = open => {
    setIsDropDownVisible(open);
  };

  const triggerChange = changedValue => {
    if (onChange) {
      onChange({
        title: changedValue
      });
    }
  };

  const dataSource = buildDropDownData(dropDownData);

  return (
    <StyledDiv className={`${containerClassName} remote-autocomplete-dropdown`}>
      <AutoComplete
        dataSource={dataSource}
        dropdownClassName={className}
        className={className}
        onSearch={onSearch}
        onBlur={onBlur}
        onFocus={onFocus}
        onSelect={onSelect}
        onChange={_onChange}
        value={text}
        ref={autoRef}
        onDropdownVisibleChange={onDropdownVisibleChange}
      >
        <Input
          suffix={
            <Icon
              type={iconType}
              className={`${isDropDownVisible ? "ant-input-suffix-icon-rotate-up" : ""}`}
              style={{ color: "#00ad50" }}
            />
          }
          placeholder={selected.title}
        />
      </AutoComplete>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  margin: 0px 5px;
  overflow: hidden;

  .ant-input-suffix i {
    transition-duration: 0.25s;
  }

  .ant-input-suffix-icon-rotate-up {
    transform: rotate(180deg);
    transition-duration: 0.25s;
  }

  button {
    white-space: pre-wrap;
  }
`;

const StyledRemoteAutocompleteDropDown = styled(RemoteAutocompleteDropDown)`
  .ant-select-dropdown-menu {
    display: flex;
    flex-direction: column;
    .ant-select-dropdown-menu-item{
      min-height: 30px;
    }
`;

export { StyledRemoteAutocompleteDropDown as RemoteAutocompleteDropDown };
