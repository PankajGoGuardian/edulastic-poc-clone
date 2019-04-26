import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";

import { mainBlueColor } from "@edulastic/colors";

import HorizontalLines from "./components/HorizontalLines";
import VerticalLines from "./components/VerticalLines";
import Points from "./components/Points";
import ArrowPair from "./components/ArrowPair";
import withGrid from "./HOC/withGrid";
import { getGridVariables, getReCalculatedPoints } from "./helpers";
import { SHOW } from "../../constants/constantsForQuestions";

const LineChart = ({
  data,
  previewTab,
  validation,
  saveAnswer,
  ui_style: { width, height, margin, yAxisCount, stepSize },
  view
}) => {
  const { yAxis, padding, yAxisStep, changingStep, step } = getGridVariables(
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

  useEffect(() => {
    setLocalData(data);
  }, []);

  const getPolylinePoints = () =>
    previewTab === SHOW
      ? validation.valid_response.value
          .map((dot, index) => `${step * index + margin / 2 + padding},${height - margin - dot.y}`)
          .join(" ")
      : localData.map((dot, index) => `${step * index + margin / 2 + padding},${height - margin - dot.y}`).join(" ");

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
    <svg style={{ userSelect: "none" }} width={width} onMouseMove={onMouseMove} onMouseUp={onMouseUp} height={height}>
      <VerticalLines lines={data} step={step} height={height} margin={margin} padding={padding} />

      <HorizontalLines lines={yAxis} step={yAxisStep} height={height} width={width} margin={margin} padding={padding} />

      <polyline points={getPolylinePoints()} strokeWidth={3} fill="none" stroke={mainBlueColor} />

      <ArrowPair getActivePoint={getActivePoint} />

      <Points
        isMouseDown={activeIndex !== null}
        onPointOver={setActive}
        previewTab={previewTab}
        validation={validation}
        circles={previewTab === SHOW ? validation.valid_response.value : localData}
        view={view}
        step={step}
        height={height}
        padding={padding}
        margin={margin}
        onMouseDown={onMouseDown}
      />
    </svg>
  );
};

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  ui_style: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    yAxisCount: PropTypes.number,
    stepSize: PropTypes.number
  }).isRequired,
  previewTab: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired
};

export default withGrid(LineChart);
