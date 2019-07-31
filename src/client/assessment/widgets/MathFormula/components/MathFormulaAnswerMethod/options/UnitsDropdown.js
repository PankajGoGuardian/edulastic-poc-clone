import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Radio, Select } from "antd";
import { get, isObject } from "lodash";

import { FlexContainer, MathKeyboard } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { textColor, mainTextColor } from "@edulastic/colors";
import { toggleAdvancedSections } from "../../../../../actions/questions";

const { Option } = Select;

const UnitsDropdownPure = ({
  item,
  onChange,
  t,
  handleAdvancedOpen,
  keypadOffset,
  preview,
  selected,
  options,
  onChangeShowDropdown,
  disabled
}) => {
  const [offset, updateOffset] = useState(keypadOffset);

  const onChnageRadioGroup = e => {
    onChangeShowDropdown(e.target.value === "dropdown");
  };

  const handleChange = value => {
    if (preview) {
      onChange(value);
    } else {
      onChange("unit", value);
    }
  };

  const scrollToKeypad = () => {
    window.scrollTo({
      top: keypadOffset - 115,
      behavior: "smooth"
    });
    updateOffset(keypadOffset);
  };

  const handlePressCustomize = () => {
    handleAdvancedOpen({ isOpen: true });
    scrollToKeypad();
  };

  const symbol = get(item, "symbols", [])[0]; // units_us units_si
  const customKeys = get(item, "custom_keys", []);

  let allBtns = customKeys.map(key => ({
    handler: key,
    label: key,
    types: [isObject(symbol) ? symbol.label : symbol],
    command: "write"
  }));

  if (isObject(symbol) || symbol === "units_us" || symbol === "units_si") {
    allBtns = MathKeyboard.KEYBOARD_BUTTONS.map(btn => {
      if (isObject(symbol) && symbol.value.includes(btn.handler)) {
        btn.types.push(symbol.label);
      }
      return btn;
    })
      .filter(btn => btn.types.includes(isObject(symbol) ? symbol.label : symbol))
      .concat(allBtns);
  }

  const getLabel = handler => {
    const seleted = allBtns.find(btn => btn.handler === handler) || {};
    return seleted.label;
  };

  useEffect(() => {
    if (offset !== keypadOffset && offset === 0) {
      scrollToKeypad();
    }
  }, [keypadOffset]);

  useEffect(() => {
    if (!item.showDropdown) {
      onChange("unit", null);
    }
  }, [item.showDropdown]);

  return (
    <FlexContainer alignItems="center" justifyContent="flex-start">
      {item.showDropdown && (
        <UniteSelet
          value={preview ? selected : options ? options.unit : ""}
          onChange={handleChange}
          disabled={disabled}
        >
          {allBtns.map((btn, i) => (
            <Option value={btn.handler} key={i}>
              {getLabel(btn.handler)}
            </Option>
          ))}
        </UniteSelet>
      )}
      {!preview && (
        <FlexContainer alignItems="center" justifyContent="flex-start">
          <FlexContainer flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
            <FieldLabel>{t("component.math.showDropdown")}</FieldLabel>
            <CustomKeyLink onClick={handlePressCustomize}>{t("component.math.customizeunits")}</CustomKeyLink>
          </FlexContainer>
          <Radio.Group onChange={onChnageRadioGroup} value={item.showDropdown ? "dropdown" : "keypad"}>
            <Radio value="dropdown">
              <FieldLabel>{t("component.math.dropdown")}</FieldLabel>
            </Radio>
            <Radio value="keypad">
              <FieldLabel>{t("component.math.keypad")}</FieldLabel>
            </Radio>
          </Radio.Group>
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

UnitsDropdownPure.propTypes = {
  handleAdvancedOpen: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  keypadOffset: PropTypes.number,
  selected: PropTypes.string,
  preview: PropTypes.bool,
  t: PropTypes.func.isRequired,
  onChangeShowDropdown: PropTypes.func,
  disabled: PropTypes.bool
};

UnitsDropdownPure.defaultProps = {
  keypadOffset: 0,
  preview: false,
  disabled: false,
  selected: "",
  onChangeShowDropdown: () => null
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    null,
    {
      handleAdvancedOpen: toggleAdvancedSections
    }
  )
);

export const UnitsDropdown = enhance(UnitsDropdownPure);

const UniteSelet = styled(Select)`
  min-width: 80px;
  .ant-select-selection {
    padding: 5px 2px;
  }
`;

const FieldLabel = styled.div`
  cursor: pointer;
  text-transform: uppercase;
  font-size: 11px;
  color: ${mainTextColor};
  position: relative;
  margin-top: 2px;
  display: inline-block;
  letter-spacing: 0.1px;
`;

const CustomKeyLink = styled.a`
  cursor: pointer;
  font-size: 11px;
  color: ${textColor};
  position: relative;
  margin-top: 2px;
  display: inline-block;
  letter-spacing: 0.1px;
  margin-top: 2px;
  user-select: none;
`;
