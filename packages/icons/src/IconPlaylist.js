/* eslint-disable react/prop-types */
import React from "react";

import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconPlaylist = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.84 17.115" {...props}>
    <g transform="translate(-50.75 -194.75)">
      <g transform="translate(14466.809 13535)">
        <rect width="11.341" height="1.846" rx="0.923" transform="translate(-14415.809 -13335.077)" strokeWidth="0.5" />
        <rect width="18.341" height="1.846" rx="0.923" transform="translate(-14415.809 -13330.159)" strokeWidth="0.5" />
        <rect width="18.341" height="1.846" rx="0.923" transform="translate(-14415.809 -13325.229)" strokeWidth="0.5" />
        <rect width="18.341" height="1.846" rx="0.923" transform="translate(-14415.809 -13340)" strokeWidth="0.5" />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconPlaylist);
