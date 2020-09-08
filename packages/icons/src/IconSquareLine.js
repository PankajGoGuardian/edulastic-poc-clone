/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconSquareLine = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 15.982 15.982" {...props}>
    <path
      d="M13.984-2497.018H2a2,2,0,0,1-2-2V-2511a2,2,0,0,1,2-2H13.984a2,2,0,0,1,2,2v11.986A2,2,0,0,1,13.984-2497.018ZM4-2511.67l-2,0a.667.667,0,0,0-.666.666v11.986a.667.667,0,0,0,.666.666H13.984a.667.667,0,0,0,.666-.666V-2511a.667.667,0,0,0-.666-.666H13Z"
      transform="translate(0 2513)"
    />
  </SVG>
);

export default withIconStyles(IconSquareLine);
