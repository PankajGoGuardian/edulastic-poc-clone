import React from "react";
import PropTypes from "prop-types";
import { PathComp } from "./styled";

const Curve = ({ pathStr, lineWidth, lineColor, onClick }) => (
  <PathComp d={pathStr} fill="none" stroke={lineColor} strokeWidth={lineWidth} onClick={onClick} />
);

Curve.propTypes = {
  onClick: PropTypes.func.isRequired,
  pathStr: PropTypes.string.isRequired,
  lineWidth: PropTypes.number.isRequired,
  lineColor: PropTypes.string.isRequired
};

export default Curve;
