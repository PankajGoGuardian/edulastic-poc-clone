import React from "react";
import PropTypes from "prop-types";
import { svgMapStrokeColor } from "@edulastic/colors";

const ConnectingLine = ({ from, to }) => (
  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={svgMapStrokeColor} strokeDasharray="5,5" strokeWidth={2} />
);

ConnectingLine.propTypes = {
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired
};

export default ConnectingLine;
