import React from "react";
import PropTypes from "prop-types";
import RcColorPicker from "rc-color-picker";
import { drawTools } from "@edulastic/constants";
import { getAlpha } from "@edulastic/common";

import { Block, Label } from "./styled";

const ColorPicker = ({ activeMode, fillColor, currentColor, onFillColorChange, onColorChange, style }) => {
  const showFillColorArray = [drawTools.DRAW_SQUARE, drawTools.DRAW_CIRCLE, drawTools.DRAW_TRIANGLE];

  return (
    <>
      {showFillColorArray.includes(activeMode) && (
        <Block style={style}>
          <Label>Fill</Label>
          <RcColorPicker
            animation="slide-up"
            color={fillColor}
            style={{ zIndex: 100000 }}
            alpha={getAlpha(fillColor)}
            onChange={onFillColorChange}
          />
        </Block>
      )}
      <Block style={style}>
        <Label>Color</Label>
        <RcColorPicker
          style={{ zIndex: 100000 }}
          animation="slide-up"
          color={currentColor}
          alpha={getAlpha(currentColor)}
          onChange={onColorChange}
        />
      </Block>
    </>
  );
};

ColorPicker.propTypes = {
  activeMode: PropTypes.string.isRequired,
  fillColor: PropTypes.string.isRequired,
  currentColor: PropTypes.string.isRequired,
  onFillColorChange: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired
};

export default ColorPicker;
