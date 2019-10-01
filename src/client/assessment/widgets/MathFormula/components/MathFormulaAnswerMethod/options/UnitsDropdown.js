import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Radio, Select } from "antd";
import { get, isObject } from "lodash";

import { FlexContainer } from "@edulastic/common";
import { response } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { textColor, mainTextColor, white } from "@edulastic/colors";
import { Label } from "../../../../../styled/WidgetOptions/Label";
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
  disabled,
  statusColor,
  unitsStyle
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
  const customKeys = get(item, "customKeys", []);

  const allBtns = customKeys.map(key => ({
    handler: key,
    label: key,
    types: [isObject(symbol) ? symbol.label : symbol],
    command: "write"
  }));

  const uiStyle = get(item, "uiStyle", {});
  const styles = {
    height: uiStyle.heightpx || response.minHeight
  };

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
    <>
      <UniteSelet
        value={preview ? selected : options ? options.unit : ""}
        onChange={handleChange}
        disabled={disabled}
        style={{ ...styles, visibility: item.showDropdown ? "visible" : "hidden" }}
        statusColor={statusColor}
      >
        {allBtns.map((btn, i) => (
          <Option value={btn.handler} key={i}>
            {getLabel(btn.handler)}
          </Option>
        ))}
      </UniteSelet>

      {!preview && (
        <FlexContainer justifyContent="center" style={{ width: "50%" }}>
          <FlexContainer alignItems="center" flexDirection="row">
            <Label marginBottom="0" marginY="0" marginX="10" data-cy="answer-math-unit-dropdown">
              {t("component.math.showDropdown")}
            </Label>
            <FlexContainer style={{ height: styles.height || 35, flexWrap: "wrap" }} justifyContent="flex-start">
              <Radio.Group onChange={onChnageRadioGroup} value={item.showDropdown ? "dropdown" : "keypad"}>
                <Radio value="dropdown">
                  <FieldLabel>{t("component.math.dropdown")}</FieldLabel>
                </Radio>
                <Radio value="keypad">
                  <FieldLabel>{t("component.math.keypad")}</FieldLabel>
                </Radio>
              </Radio.Group>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      )}
    </>
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
  disabled: PropTypes.bool,
  statusColor: PropTypes.string,
  unitsStyle: PropTypes.bool
};

UnitsDropdownPure.defaultProps = {
  keypadOffset: 0,
  preview: false,
  disabled: false,
  selected: "",
  statusColor: "",
  onChangeShowDropdown: () => null,
  unitsStyle: false
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
  min-width: 85px;
  .ant-select-selection {
    padding: 5px 2px;
    background: ${({ statusColor }) => statusColor || white};
  }
  svg {
    display: inline-block;
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
