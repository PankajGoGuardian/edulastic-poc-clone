/* eslint-disable react/prop-types */
import React from 'react';

import withIconStyles from '../HOC/withIconStyles';
import SVG from './common/SVG';

const IconClockCircularOutline = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.874 16.728" {...props}>
    <g id="clock-circular-outline">
      <g id="Group_9" data-name="Group 9">
        <path
          id="Path_36"
          d="M8.437 0A8.41 8.41 0 0 0 0 8.364a8.437 8.437 0 0 0 16.873 0A8.41 8.41 0 0 0 8.437 0zm0 14.948a6.584 6.584 0 1 1 6.642-6.584 6.621 6.621 0 0 1-6.642 6.584z"
          className="cls-1"
          data-name="Path 36"
        />
        <path
          id="Path_37"
          d="M49.247 22.038h-3.792v-4.519a.695.695 0 0 0-1.389 0v5.208a.692.692 0 0 0 .695.689h4.486a.689.689 0 1 0 0-1.377z"
          className="cls-1"
          data-name="Path 37"
          transform="translate(-36.413 -13.932)"
        />
      </g>
    </g>
  </SVG>
);

export default withIconStyles(IconClockCircularOutline);
