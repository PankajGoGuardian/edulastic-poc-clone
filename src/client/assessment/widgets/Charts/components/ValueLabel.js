import React from "react";
import PropTypes from "prop-types";

import AxisLabel from "./AxisLabel";
import { convertNumberToFraction } from "../../../utils/helpers";
import { ValueBg } from "../styled";

const ValueLabel = ({ getActivePoint, getActivePointValue, active, getActiveFractionFormat }) => {
  const textPaddingLeft = 5;
  const margin = 15;
  const symbolWidth = 8;

  const visibleValue = () => +getActivePointValue()?.toFixed(2);

  const fractionFormat = getActiveFractionFormat();

  const getWidth = value => {
    if (getActivePoint(0)) {
      if (fractionFormat !== "Decimal") {
        const result = convertNumberToFraction(value, fractionFormat);
        const plainText = Object.values(result).join("");
        return plainText.length * symbolWidth + textPaddingLeft * 2;
      }
      return value.toString().length * symbolWidth + textPaddingLeft * 2;
    }
    return 0;
  };

  const _visibleValue = visibleValue();
  const value = _visibleValue || _visibleValue === 0 ? _visibleValue : "";

  const getX = () => (active === 0 ? getActivePoint(0) + margin : getActivePoint(0) - getWidth(value) - margin);

  return (
    <g opacity={getActivePoint(0) ? 1 : 0} style={{ zIndex: 10 }}>
      <ValueBg x={getX()} y={getActivePoint(1) - 34} width={getWidth(value)} />
      <g transform={`translate(${getX() + textPaddingLeft}, ${getActivePoint(1) - 17})`}>
        <AxisLabel fractionFormat={fractionFormat} value={value} textAnchor="start" verticalAnchor="end" />
      </g>
    </g>
  );
};

ValueLabel.propTypes = {
  getActivePoint: PropTypes.func.isRequired,
  getActivePointValue: PropTypes.func.isRequired,
  getActiveFractionFormat: PropTypes.func,
  active: PropTypes.number
};

ValueLabel.defaultProps = {
  getActiveFractionFormat: () => "Decimal"
};

export default ValueLabel;
