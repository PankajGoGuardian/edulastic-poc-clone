/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconMarkAsAbsent = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2.889 13.116" {...props}>
    <g transform="translate(-13.25 -6.166)">
      <path d="M13.25,6.166h2.888v9.265H13.25Zm0,10.83h2.888v2.286H13.25Z" transform="translate(0)" fill="#434b5d" />
    </g>
  </SVG>
);

export default withIconStyles(IconMarkAsAbsent);
