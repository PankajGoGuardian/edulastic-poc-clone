/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconClever = props => (
  <StyledSVG
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 225.000000 225.000000"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <g transform="translate(0.000000,225.000000) scale(0.100000,-0.100000)" fill="#4B66F5" stroke="none">
      <path
        fill="#4B66F5"
        d="M510 2240 c-47 -4 -111 -13 -143 -20 -68 -16 -194 -90 -189 -111 2 -8 0 -11 -4 -7 -10 11 -35 -12 -27 -25 3 -6 1 -7 -5 -3 -16 10 -87 -102 -107 -167 -29 -98 -37 -313 -32 -892 3 -460 7 -572 20 -626 45 -194 193 -334 389 -370 105 -20 1320 -20 1425 -1 197 37 345 178 391 374 15 65 17 147 17 723 0 504 -3 666 -14 723 -19 105 -69 199 -142 266 -98 91 -177 122 -349 136 -130 11 -1100 11 -1230 0z m955 -410 c96 -30 197 -85 256 -138 27 -24 49 -47 49 -52 0 -6 -125 -152 -189 -223 -4 -4 -33 13 -64 37 -215 167 -468 150 -623 -41 -61 -74 -86 -148 -92 -264 -7 -157 39 -273 146 -369 93 -83 223 -116 352 -91 85 17 135 40 212 100 37 28 71 51 76 51 12 0 192 -187 192 -199 0 -17 -117 -115 -182 -154 -34 -21 -99 -50 -143 -64 -74 -25 -93 -27 -245 -27 -187 -1 -230 8 -362 76 -174 90 -303 252 -360 454 -30 107 -30 285 0 395 72 268 275 462 546 524 97 22 341 14 431 -15z"
      />
    </g>
  </StyledSVG>
);

export default withIconStyles(IconClever);

const StyledSVG = styled(SVG)`
  border-radius: 4px;
  background-color: #fff;
`;
