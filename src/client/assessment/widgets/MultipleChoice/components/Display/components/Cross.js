import React from "react";
import styled from "styled-components";
import { red } from "@edulastic/colors";

const Cross = ({ hovered }) => {
  const opacity = hovered ? 0.3 : 1;
  return (
    <Svg>
      <line x1="5%" y1="80%" x2="95%" y2="20%" stroke={red} strokeWidth={4} strokeOpacity={opacity} />
      <line x1="5%" y1="20%" x2="95%" y2="80%" stroke={red} strokeWidth={4} strokeOpacity={opacity} />
    </Svg>
  );
};

export default Cross;

const Svg = styled.svg`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
`;
