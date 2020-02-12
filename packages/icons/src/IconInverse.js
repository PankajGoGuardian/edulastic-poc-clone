/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";
// fill: rgba(0,173,80,0.85);
// stroke: #fff;
// stroke-width: 1.5px;
// }
const IconInverse = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="20.32" height="20.32" {...props}>
    <rect width="15.601" height="15.601" transform="translate(4.72 4.72)" fill="#fff" />
    <g transform="translate(0 0)" fill="rgba(0,173,80,0.85)" stroke="#fff" strokeWidth="1.5x">
      <rect width="15.601" height="15.601" />
      <rect x="0.75" y="0.75" width="14.101" height="14.101" />
    </g>
  </SVG>
);

export default withIconStyles(IconInverse);
