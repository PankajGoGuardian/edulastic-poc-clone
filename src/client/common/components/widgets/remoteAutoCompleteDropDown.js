//@ts-check
import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { AutoComplete, Input, Icon, Menu } from "antd";
import styled from "styled-components";
import { some } from "lodash";

import { useInternalEffect } from "../../../author/Reports/common/hooks/useInternalEffect";

import { black, themeColor } from "@edulastic/colors";

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

const _wipeSelected = {};

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
  rotateIcon = true,
  onChange,
  createNew = false,
  createNewLabel = "Create New",
  existingLabel = "Existing",
  placeholder = "",
  ItemTemplate = null,
  minHeight = "30px",
  filterKeys = ["title"],
  setSelectedOnDataChange = false,
  isLoading = false,
  _ref,
  disabled = false
}) => {
  const [dropDownData, setDropDownData] = useState(data);
  const [selected, setSelected] = useState(by);
  const [text, setText] = useState(by.title);
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [addCreateNewOption, setAddCreateNewOption] = useState(false);
  const autoRef = useRef(null);
  const textChangeStatusRef = useRef(false);
  const isFirstRender = useRef(true);

  const isItemPresent = (_data, isPresentItem) => {
    const isItemPresentFlag = _data.find(_item => _item.title === isPresentItem.title);
    return !!isItemPresentFlag;
  };

  useInternalEffect(() => {
    let item = null;
    if (setSelectedOnDataChange) {
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
    }

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

    if (setSelectedOnDataChange) {
      setSelected(item);
    } else {
      setSelected({ key: "", title: "" });
    }
  }, []);

  useInternalEffect(() => {
    setDropDownData([...data]);
  }, [isLoading]);

  useImperativeHandle(_ref, () => ({
    wipeSelected: () => {
      setText("");
      setDropDownData([...data]);
      onSelect("", { props: { title: "" } });
    }
  }));

  const buildDropDownData = datum => {
    let searchedDatum;
    if (text && text.length >= 3) {
      searchedDatum = datum.filter(item => {
        return some(filterKeys, fKey => {
          let test = item[fKey] || item.title;
          test = (test + "").toLocaleLowerCase();
          return test.includes((text + "").toLocaleLowerCase());
        });
      });
    } else {
      searchedDatum = datum;
    }

    let arr;
    if (addCreateNewOption && text && text.trim() && text.length >= 3 && !isLoading) {
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
      const searchItem = data.filter(item => item.title === value);
      if (searchItem) {
        exactMatchFound = true;
      }
      setDropDownData([...data]);

      if (createNew && !exactMatchFound) {
        setAddCreateNewOption(true);
      } else {
        setAddCreateNewOption(false);
      }
    } else {
      if (data.length !== dropDownData.length) {
        // If search text length is less than 3 and we are not displaying all the iteps then display all the items.
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
    setText(obj.title);
    selectCB(obj, comData);

    triggerChange(obj);
    autoRef.current.blur(obj.title);

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
  isFirstRender.current = false;
  return (
    <StyledDiv className={`${containerClassName} remote-autocomplete-dropdown`}>
      <AutoComplete
        getPopupContainer={triggerNode => triggerNode.parentNode}
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
        disabled={disabled}
      >
        <Input
          data-cy={selected.title ? selected.title : placeholder}
          suffix={
            <Icon
              type={isLoading ? "loading" : iconType}
              className={`${isDropDownVisible && rotateIcon ? "ant-input-suffix-icon-rotate-up" : ""}`}
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
    .ant-select-dropdown-menu-item {
      padding: 10px;
      min-height: ${props => (props.minHeight ? props.minHeight : "30px")};
      &-active,
      &:hover {
        background-color: ${themeColor}33;
      }
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
