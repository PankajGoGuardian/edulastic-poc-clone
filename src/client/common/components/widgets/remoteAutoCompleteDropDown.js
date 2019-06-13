//@ts-check
import React, { useState, useRef } from "react";
import { AutoComplete, Input, Icon, Menu } from "antd";
import styled from "styled-components";
import { some } from "lodash";

import { useInternalEffect } from "../../../author/Reports/common/hooks/useInternalEffect";

import { black } from "@edulastic/colors";

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

// IMPORTANT:
// onChange props is passed by ant design to support Ant design Form items as it requires onChange Callback

// IMPORTANT:
// To see what bug exists in this, refer https://snapwiz.atlassian.net/browse/EV-4322

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
  onChange,
  createNew = false,
  createNewLabel = "Create New",
  existingLabel = "Existing",
  placeholder = "",
  ItemTemplate = null,
  minHeight = "30px",
  filterKeys = ["title"]
}) => {
  const [dropDownData, setDropDownData] = useState(data);
  const [selected, setSelected] = useState(by);
  const [text, setText] = useState(by.title);
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [addCreateNewOption, setAddCreateNewOption] = useState(false);
  const autoRef = useRef(null);
  const textChangeStatusRef = useRef(false);

  const isItemPresent = (_data, isPresentItem) => {
    const isItemPresentFlag = _data.find(_item => _item.title === isPresentItem.title);
    return !!isItemPresentFlag;
  };

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
    if (isItemPresent(data, { title: text }) && createNew) {
      setAddCreateNewOption(false);
    } else if (createNew) {
      setAddCreateNewOption(true);
    }
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
  }, []);

  const buildDropDownData = datum => {
    let regExp = new RegExp(`${text}`, "i");
    const searchedDatum = datum.filter(item => {
      return some(filterKeys, fKey => {
        let test = item[fKey] || item.title;
        return regExp.test(test);
      });
    });
    let arr;
    if (addCreateNewOption) {
      let existingArr = searchedDatum.map((item, index) => {
        return (
          <Option key={item.key} title={item.title}>
            {!ItemTemplate ? item.title : <ItemTemplate itemData={item} />}
          </Option>
        );
      });
      arr = [
        <OptGroup key={"Create New"} label={createNewLabel}>
          {[
            <Option key="Add New" title={text}>
              <p data-title={text} style={{ width: "100%", height: "100%" }}>
                {text}
              </p>
            </Option>
          ]}
        </OptGroup>,
        <OptGroup key={"Existing"} label={existingLabel}>
          {[...existingArr]}
        </OptGroup>
      ];
    } else {
      arr = searchedDatum.map((item, index) => {
        return (
          <Option key={item.key} title={item.title}>
            {!ItemTemplate ? item.title : <ItemTemplate itemData={item} />}
          </Option>
        );
      });
    }

    return arr;
  };

  const onSearch = value => {
    if (value.length > 2) {
      let exactMatchFound = false;
      let regExp = new RegExp(`${value}`, "i");
      let searchedData = data.filter((item, index) => {
        if (value === item.title) {
          exactMatchFound = true;
          return true;
        }
        return some(filterKeys, fKey => {
          let test = item[fKey] || item.title;
          return regExp.test(test);
        });
      });
      setDropDownData(searchedData);

      if (createNew && !exactMatchFound) {
        setAddCreateNewOption(true);
      } else {
        setAddCreateNewOption(false);
      }
    } else {
      if (data.length !== dropDownData.length) {
        setDropDownData(data);
      }
      if (createNew && !isItemPresent(data, { title: value }) && value) {
        setAddCreateNewOption(true);
      } else {
        setAddCreateNewOption(false);
      }
    }
    setText(value);
    textChangeStatusRef.current = true;
    onSearchTextChange(value);
  };

  const onBlur = title => {
    setText(selected.title);
    triggerChange(selected);

    textChangeStatusRef.current = false;
  };

  const onSelect = (key, item) => {
    let obj = { key: key, title: item.props.title };
    setSelected(obj);
    selectCB(obj, comData);

    triggerChange(obj);

    textChangeStatusRef.current = false;
  };

  const _onChange = value => {
    if (textChangeStatusRef.current !== true) {
      autoRef.current.blur();
    }
  };

  const onFocus = () => {
    setText("");
    triggerChange({ key: "", title: "" });
    setDropDownData(data);
    setAddCreateNewOption(false);
    textChangeStatusRef.current = true;
  };

  const onDropdownVisibleChange = open => {
    setIsDropDownVisible(open);
  };

  const triggerChange = changedValue => {
    if (onChange) {
      onChange({
        ...changedValue
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
          placeholder={selected.title ? selected.title : placeholder}
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

    .ant-select-dropdown-menu-item {
      min-height: ${props => (props.minHeight ? props.minHeight : "30px")};
    }

    .ant-select-dropdown-menu-item-group {
      display: flex;
      flex-direction: column;
      .ant-select-dropdown-menu-item-group-title {
        font-weight: 900;
        color: ${black};
        cursor: default;
      }

      .ant-select-dropdown-menu-item-group-list {
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

export { StyledRemoteAutocompleteDropDown as RemoteAutocompleteDropDown };
