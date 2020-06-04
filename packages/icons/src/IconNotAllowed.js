/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconNotAllowed = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" {...props}>
    <path d="M16,0A16,16,0,1,0,32,16,16,16,0,0,0,16,0Zm0,4a11.9,11.9,0,0,1,6.934,2.242L6.238,22.93A11.963,11.963,0,0,1,16,4Zm0,24a11.9,11.9,0,0,1-6.934-2.242L25.762,9.07A11.963,11.963,0,0,1,16,28Z" />
  </SVG>
);

export default withIconStyles(IconNotAllowed);
