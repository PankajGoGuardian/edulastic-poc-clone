import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconPlayBig = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.312 19.312" {...props}>
    <g transform="translate(0.25 0.25)">
      <path class="a" d="M170.667,125.8l5.643-4.233-5.643-4.233Z" transform="translate(-163.142 -112.16)" />
      <path
        class="b"
        d="M9.406,0a9.406,9.406,0,1,0,9.406,9.406A9.4,9.4,0,0,0,9.406,0Zm0,16.93A7.525,7.525,0,1,1,16.93,9.406,7.535,7.535,0,0,1,9.406,16.93Z"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconPlayBig);
