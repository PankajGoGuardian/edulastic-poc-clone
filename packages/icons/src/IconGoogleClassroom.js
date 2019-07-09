/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconGoogleClassroom = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" {...props}>
    <g transform="translate(-11002 2530)">
      <path d="M96,0A96,96,0,1,1,0,96,96,96,0,0,1,96,0Z" transform="translate(11002 -2530)" fill="#ffc112" />
      <path d="M88,0A88,88,0,1,1,0,88,88,88,0,0,1,88,0Z" transform="translate(11010 -2522)" fill="#21a465" />
      <path d="M11,0A11,11,0,1,1,0,11,11,11,0,0,1,11,0Z" transform="translate(11050.087 -2456.289)" fill="#57bb8a" />
      <path
        d="M11065.766-2412.236v-9.387a29.829,29.829,0,0,1,25.033-13.017,30.889,30.889,0,0,1,25.408,13.017v9.387Z"
        transform="translate(-30 6.122)"
        fill="#57bb8a"
      />
      <path d="M11,0A11,11,0,1,1,0,11,11,11,0,0,1,11,0Z" transform="translate(11124.087 -2456.289)" fill="#57bb8a" />
      <path
        d="M11065.766-2412.236v-9.387a29.829,29.829,0,0,1,25.033-13.017,30.889,30.889,0,0,1,25.408,13.017v9.387Z"
        transform="translate(44 6.122)"
        fill="#57bb8a"
      />
      <path d="M14,0A14,14,0,1,1,0,14,14,14,0,0,1,14,0Z" transform="translate(11084 -2470)" fill="#fff" />
      <path
        d="M11065.766-2406.114v-11.953a37.978,37.978,0,0,1,31.873-16.574,39.331,39.331,0,0,1,32.352,16.574v11.953Z"
        fill="#fff"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconGoogleClassroom);
