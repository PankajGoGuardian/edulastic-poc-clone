/* eslint-disable react/prop-types */
import React from "react";

import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconEraseText = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="18.833" height="17.255" viewBox="0 0 18.833 17.255" {...props}>
    <g transform="translate(0 -21.444)">
      <g transform="translate(0 21.444)">
        <path
          d="M11.268,21.444,0,32.712,5.987,38.7H9.142l9.691-9.691ZM8.684,37.593H6.445l-4.88-4.88,4.46-4.46,6,6Z"
          transform="translate(0 -21.444)"
          fill="#66707a"
        />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconEraseText);
