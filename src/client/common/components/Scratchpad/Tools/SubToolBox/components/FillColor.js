import React from "react";
import { FlexContainer, hexToRGB } from "@edulastic/common";
import ColorPicker from "./ColorPicker";
import { Sprite } from "../../styled";

const FillColor = ({ fillColor = "", onChangeOption }) => {
  const onChangeColorHandler = value => {
    onChangeOption("fillColor", hexToRGB(value.color, (value.alpha ? value.alpha : 1) / 100));
  };

  return (
    <FlexContainer id="fill-color" marginLeft="14px" alignItems="center">
      <Sprite pos={-732} />
      <ColorPicker color={fillColor} onChangeColor={onChangeColorHandler} />
    </FlexContainer>
  );
};

export default FillColor;
