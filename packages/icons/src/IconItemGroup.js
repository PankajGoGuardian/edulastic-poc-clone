/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconItemGroup = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" {...props} width="14.696" height="12.859" viewBox="0 0 14.696 12.859">
    <g transform="translate(0 -2)">
      <g transform="translate(0 2)">
        <path class="a" d="M0,22l7.348,1.837L14.7,22v1.837L7.348,25.674,0,23.837Z" transform="translate(0 -12.815)" />
        <path class="a" d="M0,14l7.348,1.837L14.7,14v1.837L7.348,17.674,0,15.837Z" transform="translate(0 -8.489)" />
        <path class="a" d="M0,3.837,7.348,2,14.7,3.837V5.674L7.348,7.511,0,5.674Z" transform="translate(0 -2)" />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconItemGroup);
