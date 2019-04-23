/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconFolderMove = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <g transform="translate(0)">
      <path fill="none" d="M0,0H24V24H0Z" />
      <path
        fill="#fff"
        d="M20,6H12L10,4H4A2.006,2.006,0,0,0,2,6V18a2.006,2.006,0,0,0,2,2H20a2.006,2.006,0,0,0,2-2V8A2.006,2.006,0,0,0,20,6ZM11.223,16.115,14.541,13,11.223,9.948,12,9l4.328,4L12,17Z"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconFolderMove);
