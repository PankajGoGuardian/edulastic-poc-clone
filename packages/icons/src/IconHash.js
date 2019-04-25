/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconHash = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.516 13.16" {...props}>
    <g transform="translate(-0.001 0)">
      <path
        d="M13.515,4.935V3.29H11.457L11.869,0H10.224L9.812,3.29H6.523L6.934,0H5.289L4.878,3.29H2V4.935H4.672l-.41,3.29H2V9.87H4.056l-.411,3.29H5.29L5.7,9.87h3.29l-.412,3.29h1.646l.411-3.29h2.879V8.225H10.842l.41-3.29ZM9.2,8.225H5.907l.41-3.29H9.607Z"
        transform="translate(-2)"
      />
    </g>
  </SVG>
);

export default withIconStyles(IconHash);
