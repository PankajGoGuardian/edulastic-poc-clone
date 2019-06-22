import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";

import HorizontalLines from "./components/HorizontalLines";
import ArrowPair from "./components/ArrowPair";
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

const BarChart = ({ data, previewTab, saveAnswer, gridParams, view, correct }) => {
  const { width, height, margin, showGridlines } = gridParams;

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
      .map((dot, index) => `${step * index + margin / 2 + padding + step / 2},${convertUnitToPx(dot.y, gridParams)}`)
      .join(" ");

  const getActivePoint = index =>
    active !== null
      ? +getPolylinePoints()
          .split(" ")
          [active].split(",")[index]
      : null;

  const save = () => {
    if (cursorY === null) {
      return;
    }
    setCursorY(null);
    setActiveIndex(null);
    setInitY(null);
    setActive(null);
    setIsMouseDown(false);
    saveAnswer(localData);
  };

  const onMouseMove = e => {
    const newLocalData = cloneDeep(localData);
    if (isMouseDown && cursorY) {
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
  };

  const onMouseUp = () => {
    save();
  };

  const onMouseLeave = () => {
    save();
  };

  const [heightAddition, setHeightAddition] = useState(17);

  return (
    <svg
      style={{ userSelect: "none" }}
      width={width}
      height={height + heightAddition}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <BarsAxises
        setHeightAddition={setHeightAddition}
        heightAddition={heightAddition}
        lines={data}
        gridParams={gridParams}
        displayGridlines={displayVerticalLines(showGridlines)}
      />

      <HorizontalLines gridParams={gridParams} displayGridlines={displayHorizontalLines(showGridlines)} />

      <Bars
        activeIndex={activeIndex}
        onPointOver={setActive}
        previewTab={previewTab}
        bars={localData}
        view={view}
        onMouseDown={onMouseDown}
        gridParams={gridParams}
        correct={correct}
      />
      <ArrowPair getActivePoint={getActivePoint} />
    </svg>
  );
};

BarChart.propTypes = {
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
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  correct: PropTypes.array.isRequired
};

export default withGrid(BarChart);
