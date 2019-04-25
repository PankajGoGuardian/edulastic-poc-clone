import React from "react";

import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconDescription = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="16.195" height="16.195" viewBox="0 0 16.195 16.195" {...props}>
    <g transform="translate(-2.698 -12.5)">
      <path
        d="M15.2,28.7H26A2.7,2.7,0,0,0,28.7,26V15.2A2.7,2.7,0,0,0,26,12.5H15.2a2.7,2.7,0,0,0-2.7,2.7V26A2.7,2.7,0,0,0,15.2,28.7Zm-.907-13.5a.912.912,0,0,1,.907-.907H26a.912.912,0,0,1,.907.907V26A.912.912,0,0,1,26,26.9H15.2A.912.912,0,0,1,14.292,26Z"
        transform="translate(-9.801)"
      />
      <rect width="9.005" height="1.792" transform="translate(6.305 19.691)" />
      <rect width="9.005" height="1.792" transform="translate(6.305 16.106)" />
      <rect width="5.398" height="1.792" transform="translate(6.305 23.297)" />
    </g>
  </SVG>
);

export default withIconStyles(IconDescription);
