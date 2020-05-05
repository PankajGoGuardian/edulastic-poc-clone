import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Radio, Select } from "antd";
import { get, isObject } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { white, red } from "@edulastic/colors";
import { Label } from "../../../../../styled/WidgetOptions/Label";
import { toggleAdvancedSections } from "../../../../../actions/questions";
import { SelectInputStyled } from "../../../../../styled/InputStyles";
import { RadioLabel } from "../../../../../styled/RadioWithLabel";
import { Row } from "../../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../../styled/WidgetOptions/Col";

const { Option } = Select;

const UnitsDropdownPure = ({
  item,
  onChange,
  t,
  keypadOffset,
  preview,
  selected,
  options,
  onChangeShowDropdown,
  disabled,
  statusColor
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

  const symbol = get(item, "symbols", [])[0]; // units_us units_si
  const customKeys = get(item, "customKeys", []);

  const allBtns = customKeys.map(key => ({
    handler: key,
    label: key,
    types: [isObject(symbol) ? symbol.label : symbol],
    command: "write"
  }));

  const getLabel = handler => {
    const seleted = allBtns.find(btn => btn.handler === handler) || {};
    return seleted.label;
  };

  useEffect(() => {
    if (offset !== keypadOffset && offset === 0) {
      scrollToKeypad();
    }
  }, [keypadOffset]);

  const dropdownWrapper = useRef(null);
  const menuStyle = { top: `${dropdownWrapper.current?.clientHeight}px !important`, left: `0px !important` };
  return (
    <>
      {!preview && (
        <Row marginTop={15}>
          <Col span={24}>
            <Label marginBottom="0" data-cy="answer-math-unit-dropdown">
              {t("component.math.showDropdown")}
              <SubLabel>&nbsp;(Use keypad section to customize)</SubLabel>
            </Label>
          </Col>
          <Col span={24}>
            <Radio.Group onChange={onChnageRadioGroup} value={item.showDropdown ? "dropdown" : "keypad"}>
              <RadioLabel value="dropdown">{t("component.math.dropdown")}</RadioLabel>
              <RadioLabel value="keypad">{t("component.math.keypad")}</RadioLabel>
            </Radio.Group>
          </Col>
        </Row>
      )}
      {item.showDropdown && (
        <Row>
          <Col span={12} marginBottom="0px" style={{ height: "100%" }}>
            <DropdownWrapper menuStyle={menuStyle} ref={dropdownWrapper}>
              <SelectInputStyled
                value={preview ? selected : options ? options.unit : ""}
                onChange={handleChange}
                disabled={disabled}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                style={{ visibility: item.showDropdown ? "visible" : "hidden", height: item.showDropdown ? "100%" : 0 }}
                bg={statusColor}
              >
                {allBtns.map((btn, i) => (
                  <Option value={btn.handler} key={i}>
                    {getLabel(btn.handler)}
                  </Option>
                ))}
              </SelectInputStyled>
            </DropdownWrapper>
          </Col>
        </Row>
      )}
    </>
  );
};

UnitsDropdownPure.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  keypadOffset: PropTypes.number,
  selected: PropTypes.string,
  preview: PropTypes.bool,
  t: PropTypes.func.isRequired,
  onChangeShowDropdown: PropTypes.func,
  disabled: PropTypes.bool,
  statusColor: PropTypes.string
};

UnitsDropdownPure.defaultProps = {
  keypadOffset: 0,
  preview: false,
  disabled: false,
  selected: "",
  statusColor: "",
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

const DropdownWrapper = styled.div`
  position: relative;
  height: 100%;
  .ant-select-dropdown {
    ${({ menuStyle }) => menuStyle};
  }
  .ant-select {
    min-width: 85px;
    svg {
      display: inline-block;
    }
  }
  .ant-select-selection {
    padding: 5px 2px;
    background: ${({ statusColor }) => statusColor || white};
  }
`;

const SubLabel = styled.span`
  color: ${red};
  text-transform: initial;
`;
