import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconPlay = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
    <path d="M50,10c22.1,0,40,17.9,40,40S72.1,90,50,90S10,72.1,10,50S27.9,10,50,10 M50,0C22.4,0,0,22.4,0,50  s22.4,50,50,50s50-22.4,50-50S77.6,0,50,0L50,0z" />
    <polygon points="38.7,27.2 73.6,49.8 38.7,72.4 " />
  </SVG>
);

export default withIconStyles(IconPlay);
