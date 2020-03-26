import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { Icon } from "antd";
import { white, black, red, blue, highlightColors } from "@edulastic/colors";

const ColorPicker = ({ selectColor, bg }) => {
  const { blue: highlightBlue, green, orange, yellow, pink } = highlightColors;
  const chooseColor = value => () => {
    selectColor(value);
  };
  return (
    <FlexContainer>
      <ColorButton onClick={chooseColor("remove")}>
        <BackSlashIcon type="minus" />
      </ColorButton>
      <ColorButton onClick={chooseColor(highlightBlue)} color={highlightBlue} active={bg === highlightBlue} />
      <ColorButton onClick={chooseColor(green)} color={green} active={bg === green} />
      <ColorButton onClick={chooseColor(orange)} color={orange} active={bg === orange} />
      <ColorButton onClick={chooseColor(yellow)} color={yellow} active={bg === yellow} />
      <ColorButton onClick={chooseColor(pink)} color={pink} active={bg === pink} />
    </FlexContainer>
  );
};

export default ColorPicker;

ColorPicker.propTypes = {
  selectColor: PropTypes.func.isRequired,
  bg: PropTypes.string
};

ColorPicker.defaultProps = {
  bg: null
};

const BackSlashIcon = styled(Icon)`
  font-size: 30px;
  transform: translate(-10%, -10%) rotate(-45deg);
  color: ${red};
`;

const ColorButton = styled.div`
  height: 25px;
  width: 25px;
  margin-right: 5px;
  border-radius: 4px;
  border: 1px solid;
  cursor: pointer;

  &:hover {
    border-color: ${blue};
  }

  ${({ color, active }) => `
    background: ${color || white};
    border-color: ${active ? blue : color || black};
  `}
`;
