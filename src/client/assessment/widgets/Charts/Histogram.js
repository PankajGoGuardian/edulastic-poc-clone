import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import produce from "immer";

import { useDisableDragScroll } from "@edulastic/common";

import HorizontalLines from "./components/HorizontalLines";
import ArrowPair from "./components/ArrowPair";
import ValueLabel from "./components/ValueLabel";
import withGrid from "./HOC/withGrid";
import {
  convertPxToUnit,
  convertUnitToPx,
  getGridVariables,
  displayHorizontalLines,
  displayVerticalLines
} from "./helpers";
import Hists from "./components/Hists";

import BarsAxises from "./components/BarsAxises";

const Histogram = ({
  item,
  data,
  previewTab,
  saveAnswer,
  gridParams,
  view,
  correct,
  disableResponse,
  toggleBarDragging,
  deleteMode,
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
          `${step * index + gridMargin / 2 + padding + (step - 2) / 2},${convertUnitToPx(dot.y, gridParams) + 20}`
      )
      .join(" ");

  const getActivePoint = index =>
    active !== null
      ? +getPolylinePoints()
          .split(" ")
          [active].split(",")[index]
      : null;

  const getActivePointValue = () => (active !== null ? localData[active].y : null);

  const getActiveFractionFormat = () => (active !== null ? localData[active].labelFractionFormat : "Decimal");

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

  const normalizeTouchEvent = e => {
    if (e?.nativeEvent?.changedTouches?.length) {
      e.pageX = e.nativeEvent.changedTouches[0].pageX;
      e.pageY = e.nativeEvent.changedTouches[0].pageY;
    }
  };

  const onMouseMove = e => {
    if (window.isIOS) normalizeTouchEvent(e);
    if (isMouseDown && cursorY && !deleteMode) {
      const newPxY = convertUnitToPx(initY, gridParams) + e.pageY - cursorY;
      setLocalData(
        produce(localData, newLocalData => {
          setLocalData(newLocalData);
          newLocalData[activeIndex].y = convertPxToUnit(newPxY, gridParams);
        })
      );
    }
  };

  const onMouseDown = index => e => {
    if (window.isIOS) normalizeTouchEvent(e);
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

  const targetRef = useDisableDragScroll();

  return (
    <svg
      style={{ userSelect: "none", position: "relative", zIndex: "15" }}
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchMove={onMouseMove}
      onTouchEnd={onMouseUp}
      ref={targetRef}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <BarsAxises
          lines={data}
          gridParams={gridParams}
          displayAxisLabel={false}
          displayGridlines={displayVerticalLines(showGridlines)}
        />

        <HorizontalLines
          paddingTop={20}
          gridParams={gridParams}
          displayGridlines={displayHorizontalLines(showGridlines)}
        />

        <Hists
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
        />

        <ArrowPair getActivePoint={getActivePoint} />

        {gridParams.displayPositionOnHover && (
          <ValueLabel
            getActivePoint={getActivePoint}
            getActivePointValue={getActivePointValue}
            getActiveFractionFormat={getActiveFractionFormat}
            active={active}
          />
        )}
      </g>
    </svg>
  );
};

Histogram.propTypes = {
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
    snapTo: PropTypes.number,
    showGridlines: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
  }).isRequired,
  view: PropTypes.string.isRequired,
  disableResponse: PropTypes.bool,
  deleteMode: PropTypes.bool,
  previewTab: PropTypes.string.isRequired,
  correct: PropTypes.array.isRequired,
  toggleBarDragging: PropTypes.func,
  margin: PropTypes.object
};

Histogram.defaultProps = {
  disableResponse: false,
  deleteMode: false,
  toggleBarDragging: () => {}
};

export default withGrid(Histogram);
