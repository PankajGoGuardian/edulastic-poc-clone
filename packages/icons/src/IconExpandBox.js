import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconExpandBox = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="15.441" height="15.441" viewBox="0 0 15.441 15.441" {...props}>
    <path
      d="M106.8,0V1.716h3.075l-8.433,8.433,1.214,1.214,8.433-8.433V6H112.8V0Z"
      transform="translate(-97.361)"
      fill="#1ab395"
    />
    <path
      d="M13.726,13.726H1.716V1.716h6V0h-6A1.715,1.715,0,0,0,0,1.716v12.01a1.715,1.715,0,0,0,1.716,1.716h12.01a1.715,1.715,0,0,0,1.716-1.716v-6H13.726Z"
      fill="#1ab395"
    />
  </SVG>
);

export default withIconStyles(IconExpandBox);
