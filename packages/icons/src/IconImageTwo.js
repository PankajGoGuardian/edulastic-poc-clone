/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconImageTwo = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="18.741" height="13.386" viewBox="0 0 18.741 13.386" {...props}>
    <g transform="translate(0 -68.267)">
      <g transform="translate(0 68.267)">
        <path
          d="M16.733,68.267H2.008A2.008,2.008,0,0,0,0,70.275v9.37a2.008,2.008,0,0,0,2.008,2.008H16.733a2.008,2.008,0,0,0,2.008-2.008v-9.37A2.008,2.008,0,0,0,16.733,68.267Zm.669,7.755L13.19,71.81a.669.669,0,0,0-.946,0L6.693,77.36l-2.2-2.2a.669.669,0,0,0-.946,0l-2.2,2.2V70.275a.669.669,0,0,1,.669-.669H16.733a.669.669,0,0,1,.669.669v5.747Z"
          transform="translate(0 -68.267)"
          fill="#66717a"
        />
      </g>
      <g transform="translate(4.016 70.944)">
        <circle cx="2.008" cy="2.008" r="2.008" fill="#66717a" />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconImageTwo);
