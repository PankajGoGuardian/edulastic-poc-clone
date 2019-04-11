import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconPlay = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19" {...props}>
    <path d="M9.5,0A9.5,9.5,0,1,0,19,9.5,9.51,9.51,0,0,0,9.5,0Zm0,17.273A7.773,7.773,0,1,1,17.273,9.5,7.781,7.781,0,0,1,9.5,17.273ZM8.2,12.091,12.091,9.5,8.2,6.909Z" />
  </SVG>
);

export default withIconStyles(IconPlay);
