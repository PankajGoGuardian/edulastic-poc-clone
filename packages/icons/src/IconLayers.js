/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconLayers = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="15.924" height="15.924" viewBox="0 0 15.924 15.924" {...props}>
    <g transform="translate(1 1)">
      <g transform="translate(-1 -1)">
        <path
          d="M14.616,9.056,11.325,6.962l3.291-2.094a.663.663,0,0,0,0-1.12L7.318-.9a.664.664,0,0,0-.712,0l-7.3,4.644a.663.663,0,0,0,0,1.12L2.6,6.962-.693,9.056a.663.663,0,0,0,0,1.12l7.3,4.644a.664.664,0,0,0,.712,0l7.3-4.644A.663.663,0,0,0,14.616,9.056ZM6.961.45l6.063,3.858L9.735,6.4h0L6.961,8.166,4.19,6.4h0L.9,4.308Zm0,13.024L.9,9.616,3.834,7.748,6.6,9.509l0,0h0l.031.018.011.006a.662.662,0,0,0,.084.038h0l.024.008.021.007a.679.679,0,0,0,.3.016.656.656,0,0,0,.071-.016l.021-.007.024-.008h0a.663.663,0,0,0,.084-.038l.011-.006.031-.018h0l0,0,2.767-1.761,2.935,1.867Z"
          transform="translate(1 1)"
        />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconLayers);
