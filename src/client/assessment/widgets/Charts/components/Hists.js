import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import { red, green } from "@edulastic/colors";
import { IconCheck, IconClose } from "@edulastic/icons";

import { EDIT, CLEAR, CHECK, SHOW } from "../../../constants/constantsForQuestions";

import { Bar, ActiveBar, Text } from "../styled";
import { convertUnitToPx, getGridVariables } from "../helpers";

const Hists = ({ bars, onPointOver, onMouseDown, activeIndex, view, gridParams, previewTab, correct }) => {
  const { margin, yAxisMin, height, multicolorBars } = gridParams;

  const { padding, step } = getGridVariables(bars, gridParams, true);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseAction = value => () => {
    if (activeIndex === null) {
      onPointOver(value);
    }
  };

  const getCenterX = index => step * index + margin / 2 + padding;

  const getCenterY = dot => convertUnitToPx(dot.y, gridParams);

  const handleMouse = index => () => {
    handleMouseAction(index)();
    setHoveredIndex(index);
  };

  const Colors = [
    "#587C02",
    "#F25515",
    "#FBDEAD",
    "#5AD81C",
    "#A84A08",
    "#02952b",
    "#5EB950",
    "#6494BF",
    "#C852BE",
    "#F325A1"
  ];

  const HoverColors = [
    "#416102",
    "#c54715",
    "#c3a889",
    "#4cae1a",
    "#904108",
    "#025F1C",
    "#499846",
    "#5179a2",
    "#99408f",
    "#bd1f7c"
  ];

  const renderValidationIcons = index => (
    <g transform={`translate(${getCenterX(index) + step / 2 - 6},${getCenterY(bars[index]) - 30})`}>
      {correct[index] && <IconCheck color={green} width={12} height={12} />}
      {!correct[index] && <IconClose color={red} width={12} height={12} />}
    </g>
  );

  const getBarHeight = y => Math.abs(convertUnitToPx(yAxisMin, gridParams) - convertUnitToPx(y, gridParams));

  const isHovered = index => hoveredIndex === index || activeIndex === index;

  const getColorForIndex = index => {
    if (isHovered(index)) {
      return HoverColors[index % 10];
    }
    if (multicolorBars) {
      return Colors[index % 10];
    }
    return null;
  };

  return (
    <Fragment>
      {bars.map((dot, index) => (
        <Fragment>
          {(previewTab === SHOW || previewTab === CHECK) && renderValidationIcons(index)}
          <Bar
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            x={getCenterX(index)}
            y={getCenterY(dot)}
            width={step - 2}
            height={getBarHeight(dot.y)}
            color={getColorForIndex(index)}
          />
          {((view !== EDIT && !dot.notInteractive) || view === EDIT) && (
            <ActiveBar
              onMouseEnter={handleMouse(index)}
              onMouseLeave={handleMouse(null)}
              onMouseDown={onMouseDown(index)}
              x={getCenterX(index)}
              y={getCenterY(dot)}
              width={step - 2}
              color={getColorForIndex(index)}
              hoverState={isHovered(index)}
              height={isHovered(index) ? 5 : 1}
            />
          )}
          <Text textAnchor="middle" x={getCenterX(index) + (step - 2) / 2} y={height}>
            {dot.x}
          </Text>
        </Fragment>
      ))}
    </Fragment>
  );
};

Hists.propTypes = {
  bars: PropTypes.array.isRequired,
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
    snapTo: PropTypes.number,
    multicolorBars: PropTypes.bool
  }).isRequired,
  correct: PropTypes.array.isRequired,
  previewTab: PropTypes.string
};
Hists.defaultProps = {
  previewTab: CLEAR
};
export default Hists;
