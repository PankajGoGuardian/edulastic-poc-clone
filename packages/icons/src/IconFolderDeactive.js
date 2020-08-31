/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconFolderDeactive = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" {...props}>
    <g transform="translate(-2 -38)">
      <path
        fill="#7c848e"
        d="M10,4H4A2,2,0,0,0,2.01,6L2,18a2.006,2.006,0,0,0,2,2H20a2.006,2.006,0,0,0,2-2V8a2.006,2.006,0,0,0-2-2H12Z"
        transform="translate(0 34)"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconFolderDeactive);
