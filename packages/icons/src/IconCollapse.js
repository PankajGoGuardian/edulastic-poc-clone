/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconCollapse = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17.606" {...props}>
    <g transform="translate(0 0)">
      <path d="M4.125,9.559H0v1.727H5.852V5.434H4.125Z" transform="translate(0 -5.434)" />
      <path d="M336.627,9.559V5.434H334.9v5.852h5.852V9.559Z" transform="translate(-322.752 -5.434)" />
      <path d="M0,331.192H4.125v4.125H5.852v-5.852H0Z" transform="translate(0 -317.711)" />
      <path d="M334.9,335.317h1.727v-4.125h4.125v-1.727H334.9Z" transform="translate(-322.752 -317.711)" />
      <rect width="5.796" height="3.905" transform="translate(6.102 6.851)" />
    </g>
  </SVG>
);

export default withIconStyles(IconCollapse);
