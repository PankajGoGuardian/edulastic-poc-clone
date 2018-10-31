/* eslint-disable react/prop-types */
import React from 'react';
import withIconStyles from './HOC/withIconStyles';
import SVG from './common/SVG';

const IconHamburger = props => (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <g>
      <path d="M 6 22 L 42 22 L 42 26 L 6 26 Z " />
      <path d="M 6 10 L 42 10 L 42 14 L 6 14 Z " />
      <path d="M 6 34 L 42 34 L 42 38 L 6 38 Z " />
    </g>
  </SVG>
);

export default withIconStyles(IconHamburger);
