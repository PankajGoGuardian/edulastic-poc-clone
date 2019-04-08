import React from "react";
import { Row, Col } from "antd";

export const CustomChartTooltip = props => {
  const { className, payload, getJSX, barIndex } = props;
  if (barIndex !== null) {
    const tooltip = getJSX(payload, barIndex);
    return tooltip ? <div className={`chart-tooltip ${className}`}>{tooltip}</div> : <div />;
  } else return null;
};
