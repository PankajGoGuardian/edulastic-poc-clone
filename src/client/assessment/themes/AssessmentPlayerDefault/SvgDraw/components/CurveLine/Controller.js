import React from "react";
import PropTypes from "prop-types";
import ConnectingLine from "./ConnectingLine";
import { EllipseComp } from "./styled";

const Controller = ({ controlPoint, cPoint, lineWidth, onMouseDown }) => (
  <>
    <ConnectingLine from={cPoint} to={controlPoint} />
    <EllipseComp
      cx={controlPoint.x}
      cy={controlPoint.y}
      rx={lineWidth * 1}
      ry={lineWidth * 1}
      fill="rgb(255, 255, 255)"
      stroke="rgb(244, 0, 137)"
      strokeWidth={1}
      onMouseDown={onMouseDown}
    />
  </>
);

Controller.propTypes = {
  lineWidth: PropTypes.number.isRequired,
  cPoint: PropTypes.object.isRequired,
  controlPoint: PropTypes.object.isRequired,
  onMouseDown: PropTypes.func.isRequired
};

export default Controller;
