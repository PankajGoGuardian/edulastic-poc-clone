/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconDynamic = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="21.784" height="9.803" viewBox="0 0 21.784 9.803" {...props}>
    <g transform="translate(-0.05 -141.332)">
      <g transform="translate(0.05 141.332)">
        <path
          d="M16.925,141.333a4.852,4.852,0,0,0-3.436,1.4L10.92,145l0,0-1.378,1.214.009.009L7.1,148.4a3.07,3.07,0,1,1,.04-4.306L8.17,145l1.373-1.214L8.393,142.77a4.886,4.886,0,1,0-.041,6.948l2.569-2.278,0,0,1.373-1.218,0,0,2.451-2.169a3.075,3.075,0,1,1,2.179,5.239,3.121,3.121,0,0,1-2.219-.933l-1.032-.914L12.3,148.663l1.151,1.019a4.9,4.9,0,1,0,3.474-8.35Z"
          transform="translate(-0.05 -141.332)"
        />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconDynamic);
