/* eslint-disable react/prop-types */
import React from "react";

import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconPlaylist2 = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.62 22.561" {...props}>
    <g transform="translate(-1352.869 -793)">
      <path
        d="M34.471,0H24.992a2.5,2.5,0,0,0-2.5,2.5V2.8H20.844a2.5,2.5,0,0,0-2.5,2.5V20.064a2.5,2.5,0,0,0,2.5,2.5h9.478a2.5,2.5,0,0,0,2.5-2.5v-.306H34.47a2.5,2.5,0,0,0,2.5-2.5V2.5A2.5,2.5,0,0,0,34.471,0ZM31.208,20.064a.887.887,0,0,1-.886.886H20.844a.887.887,0,0,1-.886-.886V5.3a.887.887,0,0,1,.886-.886h9.478a.887.887,0,0,1,.886.886V20.064Zm4.148-2.8a.887.887,0,0,1-.886.886H32.819V5.3a2.5,2.5,0,0,0-2.5-2.5H24.106V2.5a.887.887,0,0,1,.886-.886h9.478a.887.887,0,0,1,.886.886V17.26Z"
        transform="translate(1389.836 815.561) rotate(180)"
      />
      <path d="M2.329,3.447h-6.66V1.8h6.66Z" transform="translate(1365.332 802)" />
      <path d="M2.329,3.447h-6.66V1.8h6.66Z" transform="translate(1365.332 799)" />
    </g>
  </SVG>
);

export default withIconStyles(IconPlaylist2);
