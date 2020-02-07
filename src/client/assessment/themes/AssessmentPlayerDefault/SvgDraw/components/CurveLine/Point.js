import React from "react";
import PropTypes from "prop-types";
import { EllipseComp } from "./styled";

const LargeHandle = ({ coordinates, lineWidth, color, ...rest }) => (
  <EllipseComp cx={coordinates.x} cy={coordinates.y} rx={lineWidth * 1.3} ry={lineWidth * 1.3} fill={color} {...rest} />
);

LargeHandle.propTypes = {
  lineWidth: PropTypes.number.isRequired,
  coordinates: PropTypes.object.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired
};

export default LargeHandle;
