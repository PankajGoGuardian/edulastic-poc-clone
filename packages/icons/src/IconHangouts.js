/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconHangouts = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.456 23.382" {...props}>
    <g transform="translate(-32.028)">
      <path
        className="a"
        d="M42.255,0a10.229,10.229,0,0,0-.487,20.446v2.447a.487.487,0,0,0,.629.467c5.655-1.717,10.087-7.481,10.087-13.131A10.24,10.24,0,0,0,42.255,0Z"
      />
      <g transform="translate(36.897 6.819)">
        <path
          className="b"
          d="M143.04,149.333h-3.9a.487.487,0,0,0-.487.487v3.9a.487.487,0,0,0,.487.487h2.436v1.461a.487.487,0,0,0,.292.447.5.5,0,0,0,.195.04.487.487,0,0,0,.333-.132,3.516,3.516,0,0,0,1.128-2.3v-3.9A.487.487,0,0,0,143.04,149.333Z"
          transform="translate(-138.656 -149.333)"
        />
        <path
          className="b"
          d="M271.04,149.333h-3.9a.487.487,0,0,0-.487.487v3.9a.487.487,0,0,0,.487.487h2.435v1.461a.487.487,0,0,0,.292.447.5.5,0,0,0,.195.04.487.487,0,0,0,.333-.132,3.516,3.516,0,0,0,1.128-2.3v-3.9A.487.487,0,0,0,271.04,149.333Z"
          transform="translate(-260.811 -149.333)"
        />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconHangouts);
