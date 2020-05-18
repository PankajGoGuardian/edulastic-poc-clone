/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconAirdrop = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.918 19.855" {...props}>
    <path d="M10.459,0A10.458,10.458,0,0,0,5.6,19.719a.613.613,0,1,0,.571-1.084,9.233,9.233,0,1,1,8.458.061.613.613,0,1,0,.556,1.092A10.458,10.458,0,0,0,10.459,0Zm0,0" />
    <path
      d="M91.543,89.26a7.264,7.264,0,1,0-9.4,2.632.613.613,0,1,0,.55-1.1,6.041,6.041,0,1,1,5.4,0,.613.613,0,1,0,.55,1.1A7.306,7.306,0,0,0,91.543,89.26Zm0,0"
      transform="translate(-74.933 -74.933)"
    />
    <path
      d="M164.4,160.329a4.075,4.075,0,1,0-5.9,3.644.613.613,0,0,0,.55-1.1,2.85,2.85,0,1,1,2.546,0,.613.613,0,0,0,.55,1.1A4.058,4.058,0,0,0,164.4,160.329Zm0,0"
      transform="translate(-149.87 -149.87)"
    />
  </SVG>
);

export default withIconStyles(IconAirdrop);
