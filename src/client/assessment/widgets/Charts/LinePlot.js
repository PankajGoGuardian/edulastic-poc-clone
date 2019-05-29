import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";

import { SHOW } from "../../constants/constantsForQuestions";

import ArrowPair from "./components/ArrowPair";
import Crosses from "./components/Crosses";
import withGrid from "./HOC/withGrid";
import { convertPxToUnit, convertUnitToPx, getGridVariables } from "./helpers";
import { Line } from "./styled";

const LinePlot = ({ data, previewTab, validation, saveAnswer, gridParams, view }) => {
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

  const getPolylinePoints = () => {
    const points = previewTab === SHOW ? validation.valid_response.value : localData;
    return points.map((dot, index) => `${step * index + step / 2 + 2},${convertUnitToPx(dot.y, gridParams)}`).join(" ");
  };

  const getActivePoint = index =>
    active !== null
      ? +getPolylinePoints()
          .split(" ")
          [active].split(",")[index]
      : null;

  const save = () => {
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

  return (
    <svg
      style={{ userSelect: "none" }}
      width={width}
      height={height}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <Line x1={0} y1={height - margin} x2={width - margin} y2={height - margin} strokeWidth={1} />

      <Crosses
        activeIndex={activeIndex}
        onPointOver={setActive}
        previewTab={previewTab}
        validation={validation}
        bars={previewTab === SHOW ? validation.valid_response.value : localData}
        view={view}
        onMouseDown={onMouseDown}
        gridParams={gridParams}
      />
      <ArrowPair getActivePoint={getActivePoint} />
    </svg>
  );
};

LinePlot.propTypes = {
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
  validation: PropTypes.object.isRequired
};

export default withGrid(LinePlot);
