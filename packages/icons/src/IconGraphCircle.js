import React from 'react';
import withIconStyles from '@edulastic/icons/src/HOC/withIconStyles';
import SVG from '@edulastic/icons/src/common/SVG';

const IconGraphCircle = (props) => {
  const { width } = props;
  const radius = Math.floor(width / 2);

  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${width}`} {...props}>
      <g fill="none" strokeWidth={2} transform="translate(0)">
        <circle stroke="none" cx={radius} cy={radius} r={radius} />
        <circle fill="none" cx={radius} cy={radius} r={radius - 1} />
      </g>
    </SVG>
  );
};

export default withIconStyles(IconGraphCircle);
