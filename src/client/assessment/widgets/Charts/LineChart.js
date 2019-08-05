import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";

import { themeColorLight } from "@edulastic/colors";

import HorizontalLines from "./components/HorizontalLines";
import VerticalLines from "./components/VerticalLines";
import Points from "./components/Points";
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

const LineChart = ({
  data,
  previewTab,
  saveAnswer,
  gridParams,
  view,
  correct,
  disableResponse,
  toggleBarDragging,
  deleteMode
}) => {
  const { width, height, margin, showGridlines } = gridParams;

  const { padding, step } = getGridVariables(data, gridParams);

  const [active, setActive] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cursorY, setCursorY] = useState(null);
  const [initY, setInitY] = useState(null);

  const [localData, setLocalData] = useState(data);

  const paddingTop = 15;

  useEffect(() => {
    if (!isEqual(data, localData)) {
      setLocalData(data);
    }
  }, [data]);

  const getPolylinePoints = () =>
    localData
      .map((dot, index) => `${step * index + margin / 2 + padding},${convertUnitToPx(dot.y, gridParams) + paddingTop}`)
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
      width={width}
      height={height}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <VerticalLines lines={data} gridParams={gridParams} displayGridlines={displayVerticalLines(showGridlines)} />

      <HorizontalLines
        gridParams={gridParams}
        displayGridlines={displayHorizontalLines(showGridlines)}
        paddingTop={paddingTop}
      />

      <polyline points={getPolylinePoints()} strokeWidth={3} fill="none" stroke={themeColorLight} />

      <ArrowPair getActivePoint={getActivePoint} />

      <ValueLabel getActivePoint={getActivePoint} getActivePointValue={getActivePointValue} active={active} />

      <Points
        activeIndex={activeIndex}
        onPointOver={setActive}
        previewTab={previewTab}
        circles={localData}
        view={view}
        onMouseDown={!disableResponse ? onMouseDown : () => {}}
        gridParams={gridParams}
        correct={correct}
        paddingTop={paddingTop}
      />
    </svg>
  );
};

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  saveAnswer: PropTypes.func.isRequired,
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
  disableResponse: PropTypes.bool,
  previewTab: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  correct: PropTypes.array.isRequired
};

LineChart.defaultProps = {
  disableResponse: false
};

export default withGrid(LineChart);
