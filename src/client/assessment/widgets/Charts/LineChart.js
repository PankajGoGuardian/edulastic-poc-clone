import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";

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

  const { padding, step } = getGridVariables(data, gridParams);

  const [active, setActive] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cursorY, setCursorY] = useState(null);
  const [initY, setInitY] = useState(null);

  const [localData, setLocalData] = useState(data);

  const paddingTop = 20;

  useEffect(() => {
    if (!isEqual(data, localData)) {
      setLocalData(data);
    }
  }, [data]);

  const getPolylinePoints = () =>
    localData
      .map(
        (dot, index) => `${step * index + gridMargin / 2 + padding},${convertUnitToPx(dot.y, gridParams) + paddingTop}`
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
      <g
        width={width}
        height={height}
        style={{
          marginLeft: `${margin.left}px`,
          marginRight: `${margin.right}px`,
          marginTop: `${margin.top}px`,
          marginBottom: `${margin.bottom}px`
        }}
      >
        <VerticalLines lines={data} gridParams={gridParams} displayGridlines={displayVerticalLines(showGridlines)} />

        <HorizontalLines
          gridParams={gridParams}
          displayGridlines={displayHorizontalLines(showGridlines)}
          paddingTop={paddingTop}
          isLine
        />

        <StyledPolyline points={getPolylinePoints()} strokeWidth={3} fill="none" />

        <ArrowPair getActivePoint={getActivePoint} />

        <ValueLabel getActivePoint={getActivePoint} getActivePointValue={getActivePointValue} active={active} />

        <Points
          item={item}
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
      </g>
    </svg>
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
    pointStyle: PropTypes.string
  }).isRequired,
  disableResponse: PropTypes.bool,
  deleteMode: PropTypes.bool,
  previewTab: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  correct: PropTypes.array.isRequired,
  toggleBarDragging: PropTypes.func
};

LineChart.defaultProps = {
  disableResponse: false,
  deleteMode: false,
  toggleBarDragging: () => {}
};

export default withGrid(LineChart);

const StyledPolyline = styled.polyline`
  stroke: ${props => props.theme.widgets.chart.stockColor};
`;
