import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import { red, green } from "@edulastic/colors";
import { IconCheck, IconClose } from "@edulastic/icons";

import { EDIT, CLEAR, CHECK, SHOW } from "../../../constants/constantsForQuestions";

import { Bar, ActiveBar, VxText } from "../styled";
import { convertUnitToPx } from "../helpers";
import { SHOW_ALWAYS, SHOW_BY_HOVER } from "../const";

const Hists = ({
  item,
  bars,
  onPointOver,
  onMouseDown,
  activeIndex,
  view,
  gridParams,
  previewTab,
  evaluation,
  deleteMode,
  saveAnswer
}) => {
  const { margin, yAxisMin, height, multicolorBars } = gridParams;
  const { chart_data = {} } = item;
  const { data = [] } = chart_data;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseAction = value => () => {
    if (activeIndex === null) {
      onPointOver(value);
    }
  };

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

  const renderValidationIcons = (bar, index) => (
    <g transform={`translate(${bar.posX + bar.width / 2 - 6},${bar.posY - 30})`}>
      {evaluation[index] && <IconCheck color={green} width={12} height={12} />}
      {!evaluation[index] && <IconClose color={red} width={12} height={12} />}
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

  const labelIsVisible = index =>
    data[index] &&
    ((data[index].labelVisibility === SHOW_BY_HOVER && hoveredIndex === index) ||
      (data[index].labelVisibility === SHOW_ALWAYS || !data[index].labelVisibility));

  const isRenderIcons = !isEmpty(evaluation);

  return (
    <Fragment>
      {bars.map((bar, index) => (
        <Fragment key={`bar-${index}`}>
          <rect
            fill="transparent"
            x={bar.posX}
            y={0}
            onMouseEnter={handleMouse(index)}
            onMouseLeave={handleMouse(null)}
            width={bar.width}
            height={height + margin}
          />
          {(previewTab === SHOW || previewTab === CHECK) && isRenderIcons && renderValidationIcons(bar, index)}
          <Bar
            onClick={deleteMode ? () => saveAnswer(index) : () => {}}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            x={bar.posX}
            y={bar.posY}
            width={bar.width}
            height={getBarHeight(bar.y)}
            color={getColorForIndex(index)}
          />
          {((view !== EDIT && !data[index].notInteractive) || view === EDIT) && (
            <ActiveBar
              onMouseEnter={handleMouse(index)}
              onMouseLeave={handleMouse(null)}
              onMouseDown={onMouseDown(index)}
              onClick={handleMouse(index)}
              onTouchEnd={handleMouse(null)}
              onTouchStart={onMouseDown(index)}
              x={bar.posX}
              y={bar.posY}
              width={bar.width}
              deleteMode={deleteMode}
              color={getColorForIndex(index)}
              hoverState={isHovered(index)}
              height={isHovered(index) ? 5 : 1}
            />
          )}
          {labelIsVisible(index) && (
            <VxText
              textAnchor="middle"
              verticalAnchor="start"
              x={bar.posX + bar.width / 2}
              y={height}
              width={70}
              onMouseEnter={handleMouse(index)}
              onMouseLeave={handleMouse(null)}
            >
              {bar.x}
            </VxText>
          )}
        </Fragment>
      ))}
    </Fragment>
  );
};

Hists.propTypes = {
  item: PropTypes.object.isRequired,
  bars: PropTypes.array.isRequired,
  onPointOver: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
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
  evaluation: PropTypes.object.isRequired,
  previewTab: PropTypes.string,
  saveAnswer: PropTypes.func,
  deleteMode: PropTypes.bool
};
Hists.defaultProps = {
  previewTab: CLEAR,
  saveAnswer: () => {},
  deleteMode: false
};
export default Hists;
