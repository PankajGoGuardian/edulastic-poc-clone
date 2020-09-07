/* eslint-disable react/prop-types */
import React from "react";

import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconCursor = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="10.209" height="16.323" viewBox="0 0 10.209 16.323" {...props}>
    <path
      d="M10.382,9.323,1.165.11A.526.526,0,0,0,.32.5V13.09a.511.511,0,0,0,.51.51.484.484,0,0,0,.333-.125l2.553-2.225L5.8,16.116a.341.341,0,0,0,.186.182.356.356,0,0,0,.127.024.342.342,0,0,0,.134-.028l2.191-.939a.34.34,0,0,0,.179-.446L6.6,10.2h3.418a.511.511,0,0,0,.51-.51.567.567,0,0,0-.147-.363Zm0,0"
      transform="translate(-0.32 0)"
      fill="#66707a"
    />
  </SVG>
);

export default withIconStyles(IconCursor);
