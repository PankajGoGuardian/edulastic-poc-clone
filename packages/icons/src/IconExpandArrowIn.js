/* eslint-disable react/prop-types */
import React from "react";
import withIconStyles from "./HOC/withIconStyles";
import SVG from "./common/SVG";

const IconExpandArrowIn = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.857 17.954" {...props}>
    <g transform="translate(17.611 17.599) rotate(180)">
      <g transform="translate(0.004)">
        <g transform="translate(17.254 9.273) rotate(180)">
          <path d="M215.013,8.29l.986.984,6.9-6.9v3.8h1.392V0h-6.175V1.393h3.8Z" transform="translate(-215.013)" />
        </g>
        <g transform="translate(0)">
          <path d="M15.906,7.985V15.9H1.451V1.447H9.269V0H0V17.349H17.353V7.985Z" transform="translate(-0.004)" />
        </g>
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconExpandArrowIn);
