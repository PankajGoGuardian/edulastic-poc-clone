/* eslint-disable react/prop-types */
import React from "react";

import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

<svg xmlns="http://www.w3.org/2000/svg" width="17.463" height="17.464" viewBox="0 0 17.463 17.464" />;
const IconPlaylist = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.228 29.197" {...props}>
    <g transform="translate(-51 -195)">
      <g transform="translate(51 195)">
        <rect width="19.927" height="3.243" rx="1.622" transform="translate(0 8.65)" />
        <rect width="32.228" height="3.243" rx="1.622" transform="translate(0 17.292)" />
        <rect width="32.228" height="3.243" rx="1.622" transform="translate(0 25.954)" />
        <rect width="32.228" height="3.243" rx="1.622" transform="translate(0)" />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconPlaylist);
