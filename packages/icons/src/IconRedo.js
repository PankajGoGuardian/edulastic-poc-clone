/* eslint-disable react/prop-types */
import React from "react";

import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconRedo = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="13.291" height="15.794" viewBox="0 0 13.291 15.794" {...props}>
    <g transform="translate(0 0)">
      <path
        d="M32,131.527l1.181-1.181a6.6,6.6,0,0,1,1.356,3.246H32.85A4.969,4.969,0,0,0,32,131.527Z"
        transform="translate(-21.244 -125.248)"
        fill="#66707a"
      />
      <path
        d="M32.851,256h1.685a6.6,6.6,0,0,1-1.356,3.246L32,258.065A4.969,4.969,0,0,0,32.851,256Z"
        transform="translate(-21.245 -245.988)"
        fill="#66707a"
      />
      <path
        d="M99.894,339.97a6.573,6.573,0,0,1-3.254,1.343v-1.685a4.92,4.92,0,0,0,2.057-.855Z"
        transform="translate(-89.131 -325.524)"
        fill="#66707a"
      />
      <path
        d="M131.28,2.561V0l3.8,3.8-3.8,3.713V4.247a5,5,0,0,0,0,9.862v1.685a6.668,6.668,0,0,1,0-13.233Z"
        transform="translate(-125.44)"
        fill="#66707a"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconRedo);
