import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";

import HorizontalLines from "./components/HorizontalLines";
import ArrowPair from "./components/ArrowPair";
import ValueLabel from "./components/ValueLabel";
import withGrid from "./HOC/withGrid";
import {
  convertPxToUnit,
  convertUnitToPx,
  displayHorizontalLines,
  displayVerticalLines,
  getGridVariables
} from "./helpers";
import Bars from "./components/Bars";
import BarsAxises from "./components/BarsAxises";

const BarChart = ({
  item,
  data,
  previewTab,
  saveAnswer,
  gridParams,
  view,
  correct,
  disableResponse,
  deleteMode,
  toggleBarDragging,
  showAnswer,
  margin = { top: 0, right: 0, left: 0, bottom: 50 }
}) => {
  const { width, height, margin: gridMargin, showGridlines } = gridParams;

  const { padding, step } = getGridVariables(data, gridParams, true);

  const [active, setActive] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cursorY, setCursorY] = useState(null);
  const [initY, setInitY] = useState(null);

  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    if (!isEqual(data, localData)) {
      setLocalData(data);
    }
  }, [data]);

  const getPolylinePoints = () =>
    localData
      .map(
        (dot, index) =>
          `${step * index + gridMargin / 2 + padding + step / 2},${convertUnitToPx(dot.y, gridParams) + 20}`
      )
      .join(" ");

  const getActivePoint = index =>
    active !== null
      ? +getPolylinePoints()
          .split(" ")
          [active].split(",")[index]
      : null;

  const getActivePointValue = () => (active !== null ? localData[active].y : null);

  const save = () => {
    if (cursorY === null) {
      return;
    }
    setCursorY(null);
    setActiveIndex(null);
    setInitY(null);
    setActive(null);
    setIsMouseDown(false);
    toggleBarDragging(false);
    saveAnswer(localData, active);
  };

  const onMouseMove = e => {
    const newLocalData = cloneDeep(localData);
    if (isMouseDown && cursorY && !deleteMode) {
      const newPxY = convertUnitToPx(initY, gridParams) + e.pageY - cursorY;
      newLocalData[activeIndex].y = convertPxToUnit(newPxY, gridParams);

      setLocalData(newLocalData);
    }
  };

  const onMouseDown = index => e => {
    setCursorY(e.pageY);
    setActiveIndex(index);
    setInitY(localData[index].y);
    setIsMouseDown(true);
    toggleBarDragging(true);
  };

  const onMouseUp = () => {
    save();
  };

  const onMouseLeave = () => {
    save();
  };

  return (
    <svg
      style={{ userSelect: "none", position: "relative", zIndex: "15" }}
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <BarsAxises lines={data} gridParams={gridParams} displayGridlines={displayVerticalLines(showGridlines)} />

        <HorizontalLines
          paddingTop={20}
          gridParams={gridParams}
          displayGridlines={displayHorizontalLines(showGridlines)}
        />

        <Bars
          item={item}
          saveAnswer={i => saveAnswer(localData, i)}
          deleteMode={deleteMode}
          activeIndex={activeIndex}
          onPointOver={setActive}
          previewTab={previewTab}
          bars={localData}
          view={view}
          onMouseDown={!disableResponse ? onMouseDown : () => {}}
          gridParams={gridParams}
          correct={correct}
          showAnswer={showAnswer}
        />

        <ArrowPair getActivePoint={getActivePoint} />

        <ValueLabel
          getActivePoint={getActivePoint}
          getActivePointValue={getActivePointValue}
          active={active}
          gridParams={gridParams}
        />
      </g>
    </svg>
  );
};

BarChart.propTypes = {
  item: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  gridParams: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    yAxisMax: PropTypes.number,
    yAxisMin: PropTypes.number,
    stepSize: PropTypes.number,
    snapTo: PropTypes.number
  }).isRequired,
  disableResponse: PropTypes.bool,
  deleteMode: PropTypes.bool,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  correct: PropTypes.array.isRequired,
  toggleBarDragging: PropTypes.func
};

BarChart.defaultProps = {
  disableResponse: false,
  deleteMode: false,
  toggleBarDragging: () => {}
};

export default withGrid(BarChart);
