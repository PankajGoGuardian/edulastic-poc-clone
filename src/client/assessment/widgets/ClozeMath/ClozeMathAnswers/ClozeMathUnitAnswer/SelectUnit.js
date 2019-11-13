import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Select } from "antd";
import { MathKeyboard } from "@edulastic/common";
import { response } from "@edulastic/constants";

const { Option } = Select;

const SelectUnit = ({
  onChange,
  onDropdownVisibleChange,
  unit,
  customUnits,
  keypadMode,
  preview,
  height,
  dropdownStyle
}) => {
  let allBtns = MathKeyboard.KEYBOARD_BUTTONS.filter(btn => btn.types.includes(keypadMode));

  if (keypadMode === "custom") {
    allBtns = customUnits
      .split(",")
      .filter(u => !!u)
      .map(u => ({ label: u.trim(), handler: u.trim() }));
  }

  const onChangeUnit = v => {
    onChange("unit", v);
  };

  const dropdownWrapper = useRef(null);

  const menuStyle = { top: `${dropdownWrapper.current?.clientHeight}px !important`, left: `0px !important` };

  return (
    <DropDownWrapper ref={dropdownWrapper} menuStyle={menuStyle}>
      <StyledSelect
        onChange={onChangeUnit}
        value={unit}
        preview={preview}
        height={height}
        getPopupContainer={trigger => trigger.parentNode}
        onDropdownVisibleChange={onDropdownVisibleChange}
        dropdownStyle={dropdownStyle}
      >
        {allBtns.map((btn, i) => (
          <Option value={btn.handler} key={i}>
            {btn.label}
          </Option>
        ))}
      </StyledSelect>
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
  dropdownStyle: PropTypes.object
};

SelectUnit.defaultProps = {
  height: "",
  customUnits: "",
  preview: false,
  dropdownStyle: {}
};

export default SelectUnit;

const DropDownWrapper = styled.div`
  disply: flex;
  align-self: stretch;
  height: auto;
  position: relative;
  .ant-select-dropdown {
    ${({ menuStyle }) => menuStyle};
  }
`;

const StyledSelect = styled(Select)`
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
    height: 100%;
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
`;
