import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconStopCircle = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.312 19.312">
    <g transform="translate(0.25 0.25)">
      <path
        class="a"
        d="M9.406,0a9.406,9.406,0,1,0,9.406,9.406A9.4,9.4,0,0,0,9.406,0Zm0,16.93A7.525,7.525,0,1,1,16.93,9.406,7.535,7.535,0,0,1,9.406,16.93Z"
      />
      <g class="a" transform="translate(6 6)">
        <rect class="b" width="7" height="7" rx="1" />
        <rect class="c" x="0.25" y="0.25" width="6.5" height="6.5" rx="0.75" />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconStopCircle);
