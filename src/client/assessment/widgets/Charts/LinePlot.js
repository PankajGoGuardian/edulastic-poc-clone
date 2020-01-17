import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import produce from "immer";

import { useDisableDragScroll } from "@edulastic/common";

import ArrowPair from "./components/ArrowPair";
import ValueLabel from "./components/ValueLabel";
import Crosses from "./components/Crosses";
import withGrid from "./HOC/withGrid";
import { convertPxToUnit, convertUnitToPx, getGridVariables } from "./helpers";
import { Line } from "./styled";

const LinePlot = ({
  item,
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
  const { width, height, margin } = gridParams;

  const { step } = getGridVariables(data, gridParams, true);

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
      .map((dot, index) => `${step * index + step / 2 + 2},${convertUnitToPx(dot.y, gridParams) + 20}`)
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
      width={width}
      height={height + 40}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchMove={onMouseMove}
      onTouchEnd={onMouseUp}
      ref={targetRef}
    >
      <Line x1={0} y1={height - margin + 20} x2={width - margin} y2={height - margin + 20} strokeWidth={1} />

      <Crosses
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

      <ValueLabel
        getActivePoint={getActivePoint}
        getActivePointValue={getActivePointValue}
        active={active}
        gridParams={gridParams}
      />
    </svg>
  );
};

LinePlot.propTypes = {
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

LinePlot.defaultProps = {
  disableResponse: false,
  deleteMode: false,
  toggleBarDragging: () => {}
};

export default withGrid(LinePlot);
