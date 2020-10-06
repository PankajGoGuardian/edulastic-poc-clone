/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconVideo = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="19.192" height="12.904" viewBox="0 0 19.192 12.904" {...props}>
    <g transform="translate(0 0)">
      <path
        d="M134.908,110.545H146.9a1.2,1.2,0,0,1,1.09,1.29v10.323a1.2,1.2,0,0,1-1.09,1.29H134.908a1.2,1.2,0,0,1-1.09-1.29V111.835A1.2,1.2,0,0,1,134.908,110.545Z"
        transform="translate(-133.818 -110.545)"
        fill="#66717a"
      />
    </g>
    <g transform="translate(13.227 0.175)">
      <path
        d="M.008,118.187l5.016-2.905a.565.565,0,0,1,.633.04.82.82,0,0,1,.308.66v11a.82.82,0,0,1-.311.663.579.579,0,0,1-.343.115.57.57,0,0,1-.295-.083L0,124.665Z"
        transform="translate(0 -115.203)"
        fill="#66717a"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconVideo);
