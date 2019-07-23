import React from "react";
import PropTypes from "prop-types";

import { ValueBg } from "../styled";

const ValueLabel = ({ getActivePoint, getActivePointValue, active }) => {
  const textPaddingLeft = 5;
  const margin = 15;
  const symbolWidth = 8;

  const getWidth = () => {
    if (getActivePoint(0)) {
      return getActivePointValue().toString().length * symbolWidth + textPaddingLeft * 2;
    }
    return 0;
  };

  const getX = () => (active === 0 ? getActivePoint(0) + margin : getActivePoint(0) - getWidth() - margin);

  return (
    <g opacity={getActivePoint(0) ? 1 : 0} style={{ zIndex: 10 }}>
      <ValueBg x={getX()} y={getActivePoint(1) - 34} width={getWidth()} />
      <text x={getX() + textPaddingLeft} y={getActivePoint(1) - 17}>
        {getActivePointValue()}
      </text>
    </g>
  );
};

ValueLabel.propTypes = {
  getActivePoint: PropTypes.func.isRequired,
  getActivePointValue: PropTypes.func.isRequired,
  active: PropTypes.number.isRequired
};

export default ValueLabel;
