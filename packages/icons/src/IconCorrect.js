/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconCorrect = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.998 16.156" {...props}>
    <g transform="translate(0 0)">
      <path
        d="M21.677,68.32a1.1,1.1,0,0,0-1.556,0L6.943,81.5,1.877,76.433A1.1,1.1,0,0,0,.322,77.988l5.843,5.843a1.1,1.1,0,0,0,1.556,0L21.677,69.875A1.1,1.1,0,0,0,21.677,68.32Z"
        transform="translate(0 -67.997)"
        fill="#36d29c"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconCorrect);
