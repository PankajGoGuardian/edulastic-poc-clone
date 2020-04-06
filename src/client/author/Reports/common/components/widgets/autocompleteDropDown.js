//@ts-check
import React, { useState, useRef } from "react";
import { AutoComplete, Input, Icon, Menu } from "antd";
import styled from "styled-components";

import { useInternalEffect } from "../../hooks/useInternalEffect";

import { IconGroup, IconClass } from "@edulastic/icons";
import { black, greyThemeDark1 } from "@edulastic/colors";
import { StyledAutocompleteDropDownContainer } from "../../styled";

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
  iconType = "down",
  iconActiveType = "up"
}) => {
  const [dropDownData, setDropDownData] = useState(data);
  const [selected, setSelected] = useState(by);
  const [text, setText] = useState(by.title);
  const [isActive, setActive] = useState(false);
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
          const isSelected = selected.key === item.key;
          const className = isSelected ? "ant-select-dropdown-menu-item-active" : null;
          return (
            <Option key={item.key} title={item.title} className={className}>
              {prefix === "Class" &&
                item.groupType &&
                (item.groupType === "custom" ? (
                  <IconGroup width={20} height={19} color={greyThemeDark1} margin="0 7px 0 0" />
                ) : (
                  <IconClass width={13} height={14} color={greyThemeDark1} margin="0 10px 0 3px" />
                ))}
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
    setText(value);
    textChangeStatusRef.current = true;
  };

  const onBlur = key => {
    let item = data.find(o => o.key === key);
    if (!item) {
      setText(selected.title);
    }
    setActive(false);

    textChangeStatusRef.current = false;
  };

  const onSelect = (key, item) => {
    let obj = { key: key, title: item.props.title };
    setSelected(obj);
    selectCB(obj, comData);
    setActive(false);

    textChangeStatusRef.current = false;
  };

  const onChange = value => {
    if (textChangeStatusRef.current !== true) {
      autoRef.current.blur();
    }
  };

  const onFocus = () => {
    setText("");
    setDropDownData(data);
    setActive(true);
    textChangeStatusRef.current = true;
  };

  const dataSource = buildDropDownData(dropDownData);

  const title = selected.title || prefix;

  return (
    <StyledAutocompleteDropDownContainer className={`${containerClassName} autocomplete-dropdown`}>
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
        ref={autoRef}
      >
        <Input
          title={title}
          suffix={<Icon type={isActive ? iconActiveType : iconType} className="" />}
          placeholder={selected.title}
        />
      </AutoComplete>
    </StyledAutocompleteDropDownContainer>
  );
};

const StyledAutocompleteDropDown = styled(AutocompleteDropDown)`
  .ant-select-dropdown-menu {
    display: flex;
    flex-direction: column;
    .ant-select-dropdown-menu-item-group {
      display: flex;
      flex-direction: column;
      .ant-select-dropdown-menu-item-group-title {
        font-weight: 900;
        font-size: 14px;
        color: ${black};
        cursor: default;
      }
      .ant-select-dropdown-menu-item-group-list {
        flex: 1;
        overflow: auto;
        > .ant-select-dropdown-menu-item {
          padding-left: 12px;
        }
      }
    }
  }
  .ant-select-dropdown-menu-item-disabled {
    font-weight: 900;
    color: ${black};
    cursor: default;
  }

  .anticon {
    height: 13px;
    font-size: 13px;
  }
`;

export { StyledAutocompleteDropDown as AutocompleteDropDown };
