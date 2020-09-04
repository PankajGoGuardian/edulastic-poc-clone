/* eslint-disable react/prop-types */
import React from "react";

import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconUndo = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="13.291" height="15.794" viewBox="0 0 13.291 15.794" {...props}>
    <g transform="translate(0 0)">
      <g transform="translate(0)">
        <path
          d="M34.535,131.527l-1.181-1.181A6.6,6.6,0,0,0,32,133.592h1.685A4.97,4.97,0,0,1,34.535,131.527Z"
          transform="translate(-31.999 -125.248)"
          fill="#66707a"
        />
        <path
          d="M33.685,256H32a6.6,6.6,0,0,0,1.356,3.246l1.181-1.181A4.969,4.969,0,0,1,33.685,256Z"
          transform="translate(-32 -245.988)"
          fill="#66707a"
        />
        <path
          d="M96.64,339.97a6.573,6.573,0,0,0,3.254,1.343v-1.685a4.92,4.92,0,0,1-2.057-.855Z"
          transform="translate(-94.112 -325.524)"
          fill="#66707a"
        />
        <path
          d="M129.236,2.561V0l-3.8,3.8,3.8,3.713V4.247a5,5,0,0,1,0,9.862v1.685a6.668,6.668,0,0,0,0-13.233Z"
          transform="translate(-121.786)"
          fill="#66707a"
        />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconUndo);
