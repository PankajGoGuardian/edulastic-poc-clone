/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconMatrixDot = ({ color, ...rest }) => (
  <SVG xmlns="http://www.w3.org/2000/svg" width="19px" height="19px" viewBox="0 0 19 19" {...rest}>
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="three-dots" fillRule="nonzero" fill={color}>
        <circle id="Oval" cx="2.5" cy="9.5" r="2.5" />
        <circle id="Oval" cx="2.5" cy="16.5" r="2.5" />
        <circle id="Oval" cx="2.5" cy="2.5" r="2.5" />
      </g>
      <g id="three-dots-1" transform="translate(7.000000, 0.000000)" fillRule="nonzero" fill={color}>
        <circle id="Oval" cx="2.5" cy="9.5" r="2.5" />
        <circle id="Oval" cx="2.5" cy="16.5" r="2.5" />
        <circle id="Oval" cx="2.5" cy="2.5" r="2.5" />
      </g>
      <g id="three-dots-2" transform="translate(14.000000, 0.000000)" fillRule="nonzero" fill={color}>
        <circle id="Oval" cx="2.5" cy="9.5" r="2.5" />
        <circle id="Oval" cx="2.5" cy="16.5" r="2.5" />
        <circle id="Oval" cx="2.5" cy="2.5" r="2.5" />
      </g>
    </g>
  </SVG>
);
export default withIconStyles(IconMatrixDot);
