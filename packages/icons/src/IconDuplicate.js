/* eslint-disable react/prop-types */
import React from "react";

import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconDuplicate = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g transform="translate(0)">
      <path fill="none" d="M0,0H20V20H0Z" />
      <path d="M13.053,1H3.579A1.613,1.613,0,0,0,2,2.636V14.091H3.579V2.636h9.474Zm-.789,3.273L17,9.182v8.182A1.613,1.613,0,0,1,15.421,19H6.729a1.607,1.607,0,0,1-1.571-1.636L5.166,5.909A1.607,1.607,0,0,1,6.737,4.273ZM11.474,10h4.342L11.474,5.5Z" />
    </g>
  </SVG>
);

export default withIconStyles(IconDuplicate);
