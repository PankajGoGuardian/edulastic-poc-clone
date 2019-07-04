/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconTime = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.854 14.726" {...props}>
    <g transform="translate(0 0)">
      <path
        d="M7.427,0A7.4,7.4,0,0,0,0,7.363a7.427,7.427,0,0,0,14.854,0A7.4,7.4,0,0,0,7.427,0Zm0,13.159a5.8,5.8,0,1,1,5.847-5.8A5.828,5.828,0,0,1,7.427,13.159Z"
        fill="#abbed5"
      />
      <path
        d="M48.627,21.415H45.289V17.436a.612.612,0,0,0-1.223,0v4.585a.609.609,0,0,0,.612.606h3.949a.606.606,0,1,0,0-1.212Z"
        transform="translate(-37.329 -14.279)"
        fill="#abbed5"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconTime);
