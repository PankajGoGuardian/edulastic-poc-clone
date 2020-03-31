import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { IconClose, IconCheck } from "@edulastic/icons";
import { red, green } from "@edulastic/colors";

import { EDIT, CLEAR, CHECK, SHOW } from "../../../constants/constantsForQuestions";

import { Circle, Cross } from "../styled";
import { convertUnitToPx, getGridVariables } from "../helpers";

const Points = ({
  item,
  circles,
  onPointOver,
  onMouseDown,
  activeIndex,
  view,
  gridParams,
  previewTab,
  correct,
  paddingTop
}) => {
  const { margin, pointStyle } = gridParams;
  const { chart_data = {} } = item;
  const { data = [] } = chart_data;

  const { padding, step } = getGridVariables(circles, gridParams);

  const handleMouseAction = value => () => {
    if (activeIndex === null) {
      onPointOver(value);
    }
  };

  const getCenterX = index => step * index + margin / 2 + padding;

  const getCenterY = dot => convertUnitToPx(dot.y, gridParams) + paddingTop;

  const getCrossD = (x, y) => `M ${x - 6},${y - 6} L ${x + 7},${y + 7} M ${x + 7},${y - 6} L ${x - 6},${y + 7}`;

  const renderValidationIcons = index => (
    <g transform={`translate(${getCenterX(index) - 6},${getCenterY(circles[index]) - 24})`}>
      {correct[index] && <IconCheck color={green} width={12} height={12} />}
      {!correct[index] && <IconClose color={red} width={12} height={12} />}
    </g>
  );

  const isRenderIcons = !!(correct && correct.length);

  return (
    <Fragment>
      {circles.map(
        (dot, index) =>
          ((view !== EDIT && !data[index].notInteractive) || view === EDIT) && (
            <Fragment key={`dot-point-${index}`}>
              {(previewTab === SHOW || previewTab === CHECK) && isRenderIcons && renderValidationIcons(index)}
              {pointStyle === "cross" ? (
                <Cross
                  key={`cross-${index}`}
                  d={getCrossD(getCenterX(index), getCenterY(dot))}
                  onMouseEnter={handleMouseAction(index)}
                  onMouseLeave={handleMouseAction(null)}
                  onMouseDown={onMouseDown(index)}
                />
              ) : (
                <Circle
                  interactive
                  key={`circle-${index}`}
                  onMouseEnter={handleMouseAction(index)}
                  onClick={handleMouseAction(index)}
                  onMouseLeave={handleMouseAction(null)}
                  onTouchEnd={handleMouseAction(null)}
                  onMouseDown={onMouseDown(index)}
                  onTouchStart={onMouseDown(index)}
                  cx={getCenterX(index)}
                  cy={getCenterY(dot)}
                  r={6}
                />
              )}
            </Fragment>
          )
      )}
    </Fragment>
  );
};

Points.propTypes = {
  item: PropTypes.object.isRequired,
  circles: PropTypes.array.isRequired,
  onPointOver: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  activeIndex: PropTypes.number,
  view: PropTypes.string.isRequired,
  gridParams: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    yAxisMax: PropTypes.number,
    yAxisMin: PropTypes.number,
    stepSize: PropTypes.number,
    snapTo: PropTypes.number,
    pointStyle: PropTypes.string
  }).isRequired,
  correct: PropTypes.array.isRequired,
  previewTab: PropTypes.string,
  paddingTop: PropTypes.number.isRequired
};

Points.defaultProps = {
  previewTab: CLEAR
};

export default Points;
