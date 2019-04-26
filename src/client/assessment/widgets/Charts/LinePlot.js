import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";

import ArrowPair from "./components/ArrowPair";
import withGrid from "./HOC/withGrid";
import { getGridVariables, getReCalculatedPoints } from "./helpers";
import { Line } from "./styled";
import Crosses from "./components/Crosses";
import { SHOW } from "../../constants/constantsForQuestions";

const LinePlot = ({
  data,
  previewTab,
  validation,
  saveAnswer,
  ui_style: { width, height, margin, yAxisCount, stepSize },
  view
}) => {
  const { padding, yAxisStep, changingStep, step } = getGridVariables(
    yAxisCount,
    stepSize,
    data,
    height,
    width,
    margin
  );

  const [active, setActive] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cursorY, setCursorY] = useState(null);

  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    if (!isEqual(data, localData)) {
      setLocalData(data);
    }
  }, [data]);

  const getPolylinePoints = () =>
    previewTab === SHOW
      ? validation.valid_response.value
          .map((dot, index) => `${step * index + step / 2 + 2},${height - margin - dot.y}`)
          .join(" ")
      : localData.map((dot, index) => `${step * index + step / 2 + 2},${height - margin - dot.y}`).join(" ");

  const getActivePoint = index =>
    active !== null
      ? +getPolylinePoints()
          .split(" ")
          [active].split(",")[index]
      : null;

  const onMouseMove = e => {
    const newLocalData = cloneDeep(localData);
    if (isMouseDown && cursorY) {
      newLocalData[activeIndex].y -= e.pageY - cursorY;

      if (newLocalData[activeIndex].y >= 0) {
        setCursorY(e.pageY);
      } else {
        newLocalData[activeIndex].y = 0;
      }

      setLocalData(newLocalData);
    }
  };

  const onMouseDown = index => e => {
    setCursorY(e.pageY);
    setActiveIndex(index);
    setIsMouseDown(true);
  };

  const onMouseUp = () => {
    setCursorY(null);
    setActiveIndex(null);
    setActive(null);
    setIsMouseDown(false);
    saveAnswer(getReCalculatedPoints(localData, { oldStep: yAxisStep, yAxisStep, yAxisCount, changingStep }));
  };

  return (
    <svg
      style={{ userSelect: "none" }}
      width={width + step - 20}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      height={height}
    >
      <Line x1={0} y1={height - margin} x2={width + step - 20 - margin} y2={height - margin} strokeWidth={1} />

      <Crosses
        isMouseDown={activeIndex !== null}
        onPointOver={setActive}
        previewTab={previewTab}
        validation={validation}
        bars={previewTab === SHOW ? validation.valid_response.value : localData}
        view={view}
        step={step}
        yAxisStep={yAxisStep}
        height={height}
        padding={padding}
        margin={margin}
        onMouseDown={onMouseDown}
      />
      <ArrowPair getActivePoint={getActivePoint} />
    </svg>
  );
};

LinePlot.propTypes = {
  data: PropTypes.array.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  ui_style: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    yAxisCount: PropTypes.number,
    stepSize: PropTypes.number
  }).isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired
};

export default withGrid(LinePlot);
