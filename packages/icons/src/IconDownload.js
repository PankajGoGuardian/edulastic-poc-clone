/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconDownload = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.57 12.994" {...props}>
    <g transform="translate(-0.489)">
      <path
        d="M11.314,19.1v2.968H2.234V19.1H.489v3.841a.872.872,0,0,0,.874.872H12.185a.872.872,0,0,0,.874-.872V19.1Z"
        transform="translate(0 -10.824)"
        fill="#434b5d"
      />
      <path
        d="M11.146,7.987l-2.5-3.019s-.38-.359.032-.359h1.408V.214S10.031,0,10.354,0h1.982c.232,0,.227.18.227.18V4.518h1.3c.5,0,.124.376.124.376S11.86,7.716,11.563,8.012A.277.277,0,0,1,11.146,7.987Z"
        transform="translate(-4.531)"
        fill="#434b5d"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconDownload);
