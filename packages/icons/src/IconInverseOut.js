/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconInverseOut = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="20.32" height="20.32" {...props}>
    <g transform="translate(0 0)" stroke="#fff" strokeWidth="1.5px">
      <rect width="15.601" height="15.601" stroke="none" fill="none" />
      <rect x="0.75" y="0.75" width="14.101" height="14.101" fill="none" />
    </g>
    <rect width="15.601" height="15.601" transform="translate(4.72 4.72)" opacity={0.8} fill="#fff" />
  </SVG>
);

export default withIconStyles(IconInverseOut);
