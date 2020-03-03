/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconExpand = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17.606" {...props}>
    <g transform="translate(0 0)">
      <path d="M1.727,7.161H5.851V5.434H0v5.852H1.727Z" transform="translate(0 -5.434)" />
      <path d="M339.024,7.161v4.125h1.727V5.434H334.9V7.161Z" transform="translate(-322.751 -5.434)" />
      <path d="M5.851,333.59H1.727v-4.125H0v5.851H5.851Z" transform="translate(0 -317.711)" />
      <path d="M340.751,329.465h-1.727v4.125H334.9v1.727h5.851Z" transform="translate(-322.751 -317.711)" />
      <rect width="8.434" height="6.543" transform="translate(4.783 5.532)" />
    </g>
  </SVG>
);

export default withIconStyles(IconExpand);
