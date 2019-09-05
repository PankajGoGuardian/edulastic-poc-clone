import React, { useState } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";

import { FlexContainer } from "@edulastic/common";

import { getYAxis, getPadding } from "../helpers";
import { EDIT } from "../../../constants/constantsForQuestions";
import AnnotationRnd from "../../../components/Annotations/AnnotationRnd";

const withGrid = WrappedComponent => {
  const hocComponent = props => {
    const {
      theme,
      name,
      gridParams: { width, margin, yAxisMax, yAxisMin, stepSize, xAxisLabel, yAxisLabel },
      view,
      item,
      setQuestionData
    } = props;

    const [barIsDragging, toggleBarDragging] = useState(false);

    const yAxis = getYAxis(yAxisMax, yAxisMin, stepSize);
    const padding = getPadding(yAxis);

    return (
      <FlexContainer justifyContent="flex-start" style={{ background: theme.widgets.chart.bgColor, overflowX: "auto" }}>
        <FlexContainer style={{ transform: "rotate(-90deg)", width: 40, whiteSpace: "nowrap", marginTop: margin }}>
          {yAxisLabel}
        </FlexContainer>
        <div className="chart-parent" style={{ position: "relative" }}>
          {item.type !== "linePlot" && item.type !== "dots" && (
            <AnnotationRnd
              style={{
                backgroundColor: "transparent",
                boxShadow: "none",
                border: view === EDIT ? "1px solid lightgray" : "none"
              }}
              question={item}
              setQuestionData={setQuestionData}
              disableDragging={view !== EDIT}
              isAbove={view === EDIT ? !barIsDragging : false}
              onDoubleClick={() => toggleBarDragging(!barIsDragging)}
            />
          )}
          <FlexContainer style={{ width, marginBottom: 20 }} justifyContent="center">
            {name}
          </FlexContainer>
          <WrappedComponent {...props} toggleBarDragging={toggleBarDragging} />
          <FlexContainer style={{ width, marginTop: 10, marginLeft: padding / 2 }} justifyContent="center">
            {xAxisLabel}
          </FlexContainer>
          {(item.type === "linePlot" || item.type === "dots") && (
            <div
              style={{
                height: "204px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AnnotationRnd
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  border: view === EDIT ? "1px solid lightgray" : "none"
                }}
                question={item}
                setQuestionData={setQuestionData}
                disableDragging={view !== EDIT}
                isAbove={view === EDIT ? !barIsDragging : false}
                onDoubleClick={() => toggleBarDragging(!barIsDragging)}
              />
            </div>
          )}
        </div>
      </FlexContainer>
    );
  };

  hocComponent.propTypes = {
    view: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    theme: PropTypes.any.isRequired,
    data: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    gridParams: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      margin: PropTypes.number,
      yAxisMax: PropTypes.number,
      yAxisMin: PropTypes.number,
      stepSize: PropTypes.number,
      snapTo: PropTypes.number
    })
  };

  hocComponent.defaultProps = {
    gridParams: {
      width: 640,
      height: 440,
      margin: 40,
      yAxisMax: 70,
      yAxisMin: 0,
      stepSize: 5,
      snapTo: 5
    }
  };

  return withTheme(hocComponent);
};

export default withGrid;
