/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconMarkAsSubmitted = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.988 8.191" {...props}>
    <g transform="translate(0 0)">
      <path
        d="M4.974,13.632a1.276,1.276,0,0,1-1.8,0l-2.8-2.8a1.276,1.276,0,0,1,1.8-1.8L3.844,10.7a.323.323,0,0,0,.456,0l4.51-4.51a1.276,1.276,0,1,1,1.8,1.8Z"
        transform="translate(0 -5.814)"
        fill="#fff"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconMarkAsSubmitted);
