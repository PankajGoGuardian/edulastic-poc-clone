import React from "react";
import styled from "styled-components";
import { FlexContainer, FontPicker, hexToRGB } from "@edulastic/common";
import ColorPicker from "./ColorPicker";
import { Sprite, StyledSelect } from "../../styled";

const { Option } = StyledSelect;

const FontOption = ({ fontSize, fontFamily, fontColor, onChangeOption, hideFontFamily }) => {
  const onChangeFontFamilyHandler = value => {
    onChangeOption("fontFamily", value);
  };

  const onChangeFontSizeHandler = size => {
    onChangeOption("fontSize", size);
  };

  const onChangeFontColorHandler = value => {
    onChangeOption("fontColor", hexToRGB(value.color, (value.alpha ? value.alpha : 1) / 100));
  };

  return (
    <FlexContainer id="font-options" marginLeft="14px" alignItems="center">
      <Sprite pos={-692} width={16} />
      {!hideFontFamily && (
        <StyledFontPicker hideLabel onChange={onChangeFontFamilyHandler} currentFont={fontFamily} placeholder="----" />
      )}
      <StyledSelect width={34} defaultValue={fontSize} onChange={onChangeFontSizeHandler}>
        <Option value={8}>8</Option>
        <Option value={10}>10</Option>
        <Option value={12}>12</Option>
        <Option value={16}>16</Option>
        <Option value={20}>20</Option>
        <Option value={28}>28</Option>
        <Option value={40}>40</Option>
      </StyledSelect>
      <ColorPicker color={fontColor} onChangeColor={onChangeFontColorHandler} />
    </FlexContainer>
  );
};

export default FontOption;

const StyledFontPicker = styled(FontPicker)`
  margin-bottom: 0px;
  margin-left: 6px;
  height: 24px;
  width: 80px;
  font-size: 0.92rem;
  border-radius: 2px;
  border: 1px solid #757575;
`;
