/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Select } from "antd";
import { maxBy, indexOf } from "lodash";
import { MathKeyboard, measureText } from "@edulastic/common";
import { response } from "@edulastic/constants";
import { darkBlue } from "@edulastic/colors";
import { getStemNumeration } from "../../../../utils/helpers";

const { Option } = Select;

const SelectUnit = ({
  onChange,
  onDropdownVisibleChange,
  unit,
  customUnits,
  keypadMode,
  preview,
  height,
  width,
  dropdownStyle,
  disabled,
  forwardedRef,
  getPopupContainer,
  isPrintPreview,
  allOptions,
  id
}) => {
  let allBtns = MathKeyboard.KEYBOARD_BUTTONS.filter(btn => btn.types.includes(keypadMode));
  let containerWidth = width;

  if (keypadMode === "custom") {
    allBtns = customUnits
      .split(",")
      .filter(u => !!u)
      .map(u => ({ label: u.trim(), handler: u.trim() }));
    const lengthyUnit = maxBy(allBtns, btn => btn.label.length) || {};
    const { width: maxWidth } = measureText(lengthyUnit.label);
    if (parseInt(width, 10) < maxWidth) {
      containerWidth = `${maxWidth + 33}px`;
    }
  }

  const onChangeUnit = v => {
    onChange("unit", v);
  };

  const dropdownWrapper = useRef(null);
  const menuStyle = {
    top: `${dropdownWrapper.current?.clientHeight}px !important`,
    left: `${preview ? 0 : 24}px !important`
  };

  let value = unit;
  if (isPrintPreview) {
    const itemIndex = indexOf(allOptions.map(o => o.id), id);
    value = getStemNumeration("lowercase", itemIndex);
  }

  return (
    <DropDownWrapper
      ref={dropdownWrapper}
      menuStyle={menuStyle}
      preview={preview}
      height={height}
      width={containerWidth}
      isPrintPreview={isPrintPreview}
    >
      <Select
        disabled={disabled}
        onChange={onChangeUnit}
        value={value}
        preview={preview}
        height={height}
        getPopupContainer={getPopupContainer}
        onDropdownVisibleChange={onDropdownVisibleChange}
        dropdownStyle={dropdownStyle}
        ref={forwardedRef}
      >
        {allBtns.map((btn, i) => (
          <Option value={btn.handler} key={i}>
            {btn.label}
          </Option>
        ))}
      </Select>
    </DropDownWrapper>
  );
};

SelectUnit.propTypes = {
  onChange: PropTypes.func.isRequired,
  onDropdownVisibleChange: PropTypes.func.isRequired,
  keypadMode: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  customUnits: PropTypes.string,
  height: PropTypes.string,
  preview: PropTypes.bool,
  dropdownStyle: PropTypes.object,
  forwardedRef: PropTypes.object,
  width: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  getPopupContainer: PropTypes.func
};

SelectUnit.defaultProps = {
  height: "",
  customUnits: "",
  preview: false,
  dropdownStyle: {},
  forwardedRef: {},
  width: "120px",
  getPopupContainer: trigger => trigger.parentNode
};

export default SelectUnit;

const DropDownWrapper = styled.div`
  display: flex;
  align-self: stretch;
  height: auto;
  position: relative;
  .ant-select-dropdown {
    ${({ menuStyle }) => menuStyle};
  }
  .ant-select {
    min-width: 118px;
    margin-left: ${({ preview }) => (preview ? "0px" : "24px")};
    height: 100%;
    ${({ preview }) =>
      preview &&
      `
      vertical-align: middle;
    `}
    .ant-select-selection {
      display: flex;
      align-items: center;
      height: ${({ height }) => height || "100%"};
      width: ${({ width }) => width || "auto"};
      padding: ${({ preview }) => (preview ? "0px" : "5px 2px")};
      ${({ preview }) =>
        preview &&
        `
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      `}
    }
    svg {
      display: inline-block;
    }
    .ant-select-selection-selected-value {
      ${({isPrintPreview}) => isPrintPreview ? {color: darkBlue} : {}};
    }
  }
`;
