import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconPlayFilled = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.255 16.824" {...props}>
    <g transform="translate(0 0)">
      <path
        d="M31.214,7.22,20.018.166A2.008,2.008,0,0,0,18.966,0,1.088,1.088,0,0,0,17.73,1.2V15.621a1.1,1.1,0,0,0,1.236,1.2,2.009,2.009,0,0,0,1.052-.164L31.214,9.6c.919-.547.76-1.192.76-1.192S32.133,7.767,31.214,7.22Z"
        transform="translate(-17.73 0)"
        fill="#00ad50"
        fill-rule="evenodd"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconPlayFilled);
