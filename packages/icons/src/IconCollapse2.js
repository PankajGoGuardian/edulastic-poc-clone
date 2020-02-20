/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconCollapse2 = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.644 13.346" {...props}>
    <g transform="translate(0 0)">
      <path d="M1.309,6.743H4.436V5.434H0V9.87H1.309Z" transform="translate(0 -5.434)" />
      <path d="M338.026,6.743V9.87h1.309V5.434H334.9V6.743Z" transform="translate(-325.691 -5.434)" />
      <path d="M4.436,332.591H1.309v-3.127H0V333.9H4.436Z" transform="translate(0 -320.555)" />
      <path d="M339.335,329.465h-1.309v3.127H334.9V333.9h4.436Z" transform="translate(-325.691 -320.555)" />
    </g>
    <rect width="6.394" height="4.96" transform="translate(3.626 4.193)" />
  </SVG>
);

export default withIconStyles(IconCollapse2);
