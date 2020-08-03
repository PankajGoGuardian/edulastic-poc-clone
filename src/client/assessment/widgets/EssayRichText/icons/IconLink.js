import React from "react";
import withIconStyles from "@edulastic/icons/src/HOC/withIconStyles";
import SVG from "@edulastic/icons/src/common/SVG";

const IconLink = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="17.376" height="8.688" viewBox="0 0 17.376 8.688" {...props}>
    <g transform="translate(0 -106.667)">
      <g transform="translate(0 106.667)">
        <g transform="translate(0 0)">
          <path
            d="M238.142,106.667h-3.475v1.651h3.475a2.693,2.693,0,0,1,0,5.387h-3.475v1.651h3.475a4.344,4.344,0,1,0,0-8.688Z"
            transform="translate(-225.11 -106.667)"
          />
          <path
            d="M1.651,111.011a2.7,2.7,0,0,1,2.693-2.693H7.819v-1.651H4.344a4.344,4.344,0,1,0,0,8.688H7.819V113.7H4.344A2.7,2.7,0,0,1,1.651,111.011Z"
            transform="translate(0 -106.667)"
          />
          <rect width="6.951" height="1.738" transform="translate(5.213 3.475)" />
        </g>
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconLink);
