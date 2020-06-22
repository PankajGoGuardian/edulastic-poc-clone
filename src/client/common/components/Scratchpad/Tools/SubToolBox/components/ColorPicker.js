import React from "react";
import RcColorPicker from "rc-color-picker";
import styled from "styled-components";
import { getAlpha } from "@edulastic/common";
import { IconCaretDown } from "@edulastic/icons";

const ColorPicker = ({ color, onChangeColor }) => (
  <RcColorPicker
    animation="slide-up"
    color={color}
    style={{ zIndex: 100000 }}
    alpha={getAlpha(color)}
    onChange={onChangeColor}
  >
    <ColorPickerTrigger className="react-colorpicker-trigger-dem">
      <CaretDown>
        <IconCaretDown />
      </CaretDown>
    </ColorPickerTrigger>
  </RcColorPicker>
);

export default ColorPicker;

const CaretDown = styled.div`
  bottom: -2px;
  right: -2px;
  height: 8px;
  width: 8px;
  position: absolute;
  background: #f1f1f1;

  svg {
    width: 3px;
    height: 3px;
    top: 3px;
    left: -3px;
    position: absolute;
  }
`;

const ColorPickerTrigger = styled.div`
  width: 22px;
  height: 18px;
  cursor: pointer;
  outline: 1px solid #969696;
  outline-offset: 2px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
