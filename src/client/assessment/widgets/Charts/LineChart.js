import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import produce from "immer";
import { themeColor } from "@edulastic/colors";

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

function normalizeTouchEvent(e) {
  if (e?.nativeEvent?.changedTouches?.length) {
    // e.preventDefault();
    // e.clientX = e.nativeEvent.changedTouches[0].clientX;
    // e.clientY = e.nativeEvent.changedTouches[0].clientY;
    e.pageX = e.nativeEvent.changedTouches[0].pageX;
    e.pageY = e.nativeEvent.changedTouches[0].pageY;
  }
}

function useDisableDragScroll() {
  const targetRef = useRef();

  useEffect(() => {
    const preventDefault = e => {
      e.preventDefault();
    };
    targetRef.current.addEventListener("touchmove", preventDefault, { passive: false });
    return () => targetRef.current.removeEventListener("touchmove", preventDefault);
  }, []);

  return targetRef;
}

const LineChart = ({
  item,
  data,
  previewTab,
  saveAnswer,
  gridParams,
  view,
  evaluation,
  disableResponse,
  toggleBarDragging,
  deleteMode,
  margin = { top: 0, right: 0, left: 0, bottom: 50 }
}) => {
  const { width, height, showGridlines, margin: gridMargin } = gridParams;
  const { padding, step } = getGridVariables(data, gridParams);

  const [active, setActive] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cursorY, setCursorY] = useState(null);
  const [initY, setInitY] = useState(null);

  const [localData, setLocalData] = useState(data);

  const paddingTop = 20;
  const points = useMemo(
    () =>
      (localData || []).map((dot, index) => ({
        ...dot,
        posY: convertUnitToPx(dot.y, gridParams) + paddingTop,
        posX: step * index + (padding + gridMargin) / 2,
        labelVisibility: data[index].labelVisibility
      })),
    [localData]
  );

  useEffect(() => {
    if (!isEqual(data, localData)) {
      setLocalData(data);
    }
  }, [data]);

  const getPolylinePoints = () =>
    points.map(dot => `${dot.posX},${convertUnitToPx(dot.y, gridParams) + paddingTop}`).join(" ");

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

  const onMouseMove = e => {
    normalizeTouchEvent(e);
    if (isMouseDown && cursorY && !deleteMode) {
      const newPxY = convertUnitToPx(initY, gridParams) + e.pageY - cursorY;
      setLocalData(
        produce(localData, newLocalData => {
          newLocalData[activeIndex].y = convertPxToUnit(newPxY, gridParams);
        })
      );
    }
  };

  const onMouseDown = index => e => {
    normalizeTouchEvent(e);
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
    <StyledSvg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
      onMouseMove={onMouseMove}
      onTouchMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchEnd={onMouseUp}
      onMouseLeave={onMouseLeave}
      ref={targetRef}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <VerticalLines
          points={points}
          gridParams={gridParams}
          displayGridlines={displayVerticalLines(showGridlines)}
          active={active}
        />

        <HorizontalLines
          gridParams={gridParams}
          displayGridlines={displayHorizontalLines(showGridlines)}
          paddingTop={paddingTop}
          isLine
        />

        <StyledPolyline points={getPolylinePoints()} strokeWidth={3} fill="none" />

        <ArrowPair getActivePoint={getActivePoint} />

        {gridParams.displayPositionOnHover && (
          <ValueLabel
            getActivePoint={getActivePoint}
            getActivePointValue={getActivePointValue}
            getActiveFractionFormat={getActiveFractionFormat}
            active={active}
          />
        )}

        <Points
          item={item}
          activeIndex={activeIndex}
          onPointOver={setActive}
          previewTab={previewTab}
          points={points}
          view={view}
          onMouseDown={!disableResponse ? onMouseDown : () => {}}
          gridParams={gridParams}
          evaluation={evaluation}
        />
      </g>
    </StyledSvg>
  );
};

LineChart.propTypes = {
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
    pointStyle: PropTypes.string,
    showGridlines: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
  }).isRequired,
  disableResponse: PropTypes.bool,
  deleteMode: PropTypes.bool,
  previewTab: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  evaluation: PropTypes.object.isRequired,
  toggleBarDragging: PropTypes.func
};

LineChart.defaultProps = {
  disableResponse: false,
  deleteMode: false,
  toggleBarDragging: () => {}
};

export default withGrid(LineChart);

const StyledPolyline = styled.polyline`
  stroke: ${themeColor};
`;

const StyledSvg = styled.svg`
  user-select: none;
  position: relative;
  z-index: 15;
`;
