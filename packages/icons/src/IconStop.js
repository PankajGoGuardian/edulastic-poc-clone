import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconStop = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
    <rect width="16" height="16" rx="2" transform="translate(0 0)" fill="#00ad50" />
  </SVG>
);

export default withIconStyles(IconStop);
