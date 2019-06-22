import React from "react";
import withIconStyles from "@edulastic/icons/src/HOC/withIconStyles";
import SVG from "@edulastic/icons/src/common/SVG";

const IconLock = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.195 14.905" {...props}>
    <g transform="translate(0 0)">
      <path
        d="M48.447,7.072a.98.98,0,0,0-.72-.3h-.339V4.743a4.564,4.564,0,0,0-1.4-3.345,4.7,4.7,0,0,0-6.69,0,4.564,4.564,0,0,0-1.4,3.345V6.775h-.339a1.012,1.012,0,0,0-1.016,1.016v6.1a1.012,1.012,0,0,0,1.016,1.016H47.727a1.012,1.012,0,0,0,1.016-1.016v-6.1A.979.979,0,0,0,48.447,7.072Zm-3.091-.3h-5.42V4.743a2.611,2.611,0,0,1,.794-1.916,2.709,2.709,0,0,1,3.832,0,2.611,2.611,0,0,1,.794,1.916Z"
        transform="translate(-36.548)"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconLock);
