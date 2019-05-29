import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import { IconClose, IconCheck } from "@edulastic/icons";
import { red, green } from "@edulastic/colors";
import { Circle } from "../styled";
import { EDIT, CLEAR } from "../../../constants/constantsForQuestions";
import { convertUnitToPx, getGridVariables } from "../helpers";

const Points = ({ circles, onPointOver, onMouseDown, activeIndex, view, gridParams, validation, previewTab }) => {
  const { margin } = gridParams;

  const { padding, step } = getGridVariables(circles, gridParams);

  const handleMouseAction = value => () => {
    if (activeIndex === null) {
      onPointOver(value);
    }
  };

  const newValidation = [validation.valid_response, ...validation.alt_responses];

  let matches = 0;
  let validatingIndex = 0;

  newValidation.forEach(({ value }, mainIndex) => {
    const currentMatches = value.filter((ans, ind) => isEqual(ans.y.toFixed(4), circles[ind].y.toFixed(4))).length;
    matches = Math.max(currentMatches, matches);
    if (matches === currentMatches) {
      validatingIndex = mainIndex;
    }
  });

  const getCenterX = index => step * index + margin / 2 + padding;

  const getCenterY = dot => convertUnitToPx(dot.y, gridParams);

  const renderValidationIcons = index => {
    if (isEqual(newValidation[validatingIndex].value[index].y.toFixed(4), circles[index].y.toFixed(4))) {
      return (
        <g transform={`translate(${getCenterX(index) - 20},${getCenterY(circles[index]) - 20})`}>
          <IconCheck color={green} width={12} height={12} />
        </g>
      );
    }
    return (
      <g transform={`translate(${getCenterX(index) - 20},${getCenterY(circles[index]) - 20})`}>
        <IconClose color={red} width={12} height={12} />
      </g>
    );
  };

  return (
    <Fragment>
      {circles.map(
        (dot, index) =>
          ((view !== EDIT && !dot.notInteractive) || view === EDIT) && (
            <Fragment>
              {previewTab !== CLEAR && renderValidationIcons(index)}
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
  previewTab: PropTypes.string,
  validation: PropTypes.object
};

Points.defaultProps = {
  previewTab: CLEAR,
  validation: {
    valid_response: { value: [] },
    alt_responses: [{ value: [] }]
  }
};

export default Points;
