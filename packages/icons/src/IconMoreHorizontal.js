/* eslint-disable react/prop-types */
import { themeColor } from "@edulastic/colors";
import React from "react";
import SVG from "./common/SVG";
import withIconStyles from "./HOC/withIconStyles";

const IconMoreHorizontal = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 4" {...props}>
    <g transform="translate(-4 1356.194) rotate(-90)">
      <g transform="translate(1202.861 4)">
        <g transform="translate(149.333 0)">
          <g transform="translate(0 0)">
            <circle cx="2" cy="2" r="2" fill={themeColor} />
          </g>
        </g>
        <g transform="translate(149.333 7)">
          <circle cx="2" cy="2" r="2" fill={themeColor} />
        </g>
        <g transform="translate(149.333 14)">
          <circle cx="2" cy="2" r="2" fill={themeColor} />
        </g>
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconMoreHorizontal);
