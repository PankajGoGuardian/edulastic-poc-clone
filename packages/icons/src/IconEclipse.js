/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";

import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconEclipse = props => (
  <StyledSVG xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="33%" cy="50%" r="33%" stroke-width="10%" />
    <circle cx="67%" cy="50%" r="33%" stroke-width="10%" />
  </StyledSVG>
);

export default withIconStyles(IconEclipse);

const StyledSVG = styled(SVG)`
  circle {
    stroke: ${props => (props.hoverColor != props.color ? props.hoverColor : "white")};
  }
  &:hover {
    circle {
      stroke: ${props => (props.hoverColor != props.color ? props.color : "white")};
    }
  }
`;
