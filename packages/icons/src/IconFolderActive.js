/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconFolderActive = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path
      fill="#1774f0"
      d="M10,4H4A2,2,0,0,0,2.01,6L2,18a2.006,2.006,0,0,0,2,2H20a2.006,2.006,0,0,0,2-2V8a2.006,2.006,0,0,0-2-2H12Z"
    />
    <path fill="none" d="M0,0H24V24H0Z" />
  </SVG>
);

export default withIconStyles(IconFolderActive);
