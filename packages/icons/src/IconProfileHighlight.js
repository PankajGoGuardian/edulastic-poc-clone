/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconProfileHighlight = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.212 20" {...props}>
    <g transform="translate(-41.895)">
      <path
        d="M108.562,9.781c2.224,0,4.026-2.19,4.026-4.891S112,0,108.562,0s-4.027,2.19-4.027,4.891S106.338,9.781,108.562,9.781Z"
        transform="translate(-59.06)"
      />
      <path d="M41.9,300.457c0-.165,0-.046,0,0Z" transform="translate(0 -283.208)" />
      <path d="M308.085,301.636c0-.045,0-.313,0,0Z" transform="translate(-250.979 -284.258)" />
      <path
        d="M57.11,184.635c-.075-4.705-.689-6.046-5.392-6.895a3.3,3.3,0,0,1-4.41,0c-4.651.839-5.3,2.16-5.389,6.742-.007.374-.01.394-.012.35,0,.081,0,.232,0,.494,0,0,1.12,2.257,7.6,2.257s7.6-2.257,7.6-2.257c0-.169,0-.286,0-.366A3.027,3.027,0,0,1,57.11,184.635Z"
        transform="translate(-0.012 -167.583)"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconProfileHighlight);
