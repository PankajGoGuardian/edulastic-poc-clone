import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { IconClose, IconCheck } from "@edulastic/icons";
import { red, green } from "@edulastic/colors";

import { EDIT, CLEAR, CHECK, SHOW } from "../../../constants/constantsForQuestions";

import { Circle } from "../styled";
import { convertUnitToPx, getGridVariables } from "../helpers";

const Points = ({ circles, onPointOver, onMouseDown, activeIndex, view, gridParams, previewTab, correct }) => {
  const { margin } = gridParams;

  const { padding, step } = getGridVariables(circles, gridParams);

  const handleMouseAction = value => () => {
    if (activeIndex === null) {
      onPointOver(value);
    }
  };

  const getCenterX = index => step * index + margin / 2 + padding;

  const getCenterY = dot => convertUnitToPx(dot.y, gridParams);

  const renderValidationIcons = index => (
    <g transform={`translate(${getCenterX(index) - 20},${getCenterY(circles[index]) - 20})`}>
      {correct[index] && <IconCheck color={green} width={12} height={12} />}
      {!correct[index] && <IconClose color={red} width={12} height={12} />}
    </g>
  );

  return (
    <Fragment>
      {circles.map(
        (dot, index) =>
          ((view !== EDIT && !dot.notInteractive) || view === EDIT) && (
            <Fragment>
              {(previewTab === SHOW || previewTab === CHECK) && renderValidationIcons(index)}
              <Circle
                onMouseEnter={handleMouseAction(index)}
                onMouseLeave={handleMouseAction(null)}
                onMouseDown={onMouseDown(index)}
                cx={getCenterX(index)}
                cy={getCenterY(dot)}
                r={6}
              />
            </Fragment>
          )
      )}
    </Fragment>
  );
};

Points.propTypes = {
  circles: PropTypes.array.isRequired,
  onPointOver: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  activeIndex: PropTypes.number.isRequired,
  view: PropTypes.string.isRequired,
  gridParams: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    yAxisMax: PropTypes.number,
    yAxisMin: PropTypes.number,
    stepSize: PropTypes.number,
    snapTo: PropTypes.number
  }).isRequired,
  correct: PropTypes.array.isRequired,
  previewTab: PropTypes.string
};

Points.defaultProps = {
  previewTab: CLEAR
};

export default Points;
