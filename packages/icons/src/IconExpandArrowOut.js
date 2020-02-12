/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconExpandArrowOut = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.849 17.849" {...props}>
    <g transform="translate(17.603 17.599) rotate(180)">
      <g transform="translate(0.004)">
        <g transform="translate(7.981)">
          <path d="M215.013,8.29l.986.984,6.9-6.9v3.8h1.392V0h-6.175V1.393h3.8Z" transform="translate(-215.013)" />
        </g>
        <g transform="translate(0)">
          <path d="M15.906,9.2v6.7H1.451V1.447H7.908V0H0V17.349H17.353V9.2Z" transform="translate(-0.004)" />
        </g>
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconExpandArrowOut);
