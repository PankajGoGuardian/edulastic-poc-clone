import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Checkbox, Select } from "antd";
import { get, isObject } from "lodash";

import { FlexContainer, MathKeyboard } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { textColor } from "@edulastic/colors";
import { toggleAdvancedSections } from "../../../../../actions/questions";

const { Option } = Select;

const UnitsDropdownPure = ({ item, onChange, t, handleAdvancedOpen, keypadOffset, preview, selected, options }) => {
  const [offset, updateOffset] = useState(keypadOffset);
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

  return (
    <FlexContainer alignItems="center" justifyContent="flex-start">
      {item.showDropdown && (
        <UniteSelet value={preview ? selected : options ? options.unit : ""} onChange={handleChange}>
          {allBtns.map((btn, i) => (
            <Option value={btn.handler} key={i}>
              {getLabel(btn.handler)}
            </Option>
          ))}
        </UniteSelet>
      )}
      {!preview && (
        <FlexContainer flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
          <Checkbox
            data-cy="answer-allowed-variables"
            checked={item.showDropdown}
            onChange={e => {
              onChange("showDropdown", e.target.checked);
            }}
          >
            {`${t("component.math.showDropdown")} ${item.showDropdown ? "dropdown" : "keypad"}`}
          </Checkbox>
          <CustomKeyLink onClick={handlePressCustomize}>{t("component.math.customizeunits")}</CustomKeyLink>
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
  t: PropTypes.func.isRequired
};

UnitsDropdownPure.defaultProps = {
  keypadOffset: 0,
  preview: false,
  selected: ""
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

const CustomKeyLink = styled.a`
  cursor: pointer;
  font-size: 11px;
  color: ${textColor};
  position: relative;
  margin-top: 2px;
  display: inline-block;
  letter-spacing: 0.1px;
  margin-left: 36px;
  margin-top: 2px;
  user-select: none;
`;
