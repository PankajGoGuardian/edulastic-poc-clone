/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconMultipart = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.555 19.556" {...props}>
    <g transform="translate(0 0)">
      <path
        d="M164.809,13.033a.889.889,0,0,1-.628-1.517l2.369-2.369A4.259,4.259,0,0,0,167.816,6.1,4.322,4.322,0,0,0,163.5,1.778a4.259,4.259,0,0,0-3.048,1.264l-2.372,2.372a.889.889,0,0,1-1.257-1.257l2.369-2.369A6.019,6.019,0,0,1,163.5,0a6.1,6.1,0,0,1,6.1,6.1,6.02,6.02,0,0,1-1.791,4.311l-2.366,2.365a.885.885,0,0,1-.628.261Zm0,0"
        transform="translate(-150.038)"
      />
      <path
        d="M6.1,169.594A6.1,6.1,0,0,1,0,163.5a6.019,6.019,0,0,1,1.791-4.311l2.366-2.365a.889.889,0,0,1,1.257,1.257l-2.369,2.369A4.255,4.255,0,0,0,1.778,163.5,4.322,4.322,0,0,0,6.1,167.816a4.259,4.259,0,0,0,3.048-1.264l2.372-2.372a.889.889,0,0,1,1.257,1.257L10.4,167.806A6.02,6.02,0,0,1,6.1,169.594Zm0,0"
        transform="translate(0 -150.038)"
      />
      <path
        d="M128.884,136.884a.889.889,0,0,1-.628-1.517l7.111-7.111a.889.889,0,0,1,1.257,1.257l-7.111,7.111A.886.886,0,0,1,128.884,136.884Zm0,0"
        transform="translate(-122.662 -122.661)"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconMultipart);
