import React, { useState } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";

import { FlexContainer } from "@edulastic/common";

import { EDIT } from "../../../constants/constantsForQuestions";
import AnnotationRnd from "../../../components/Annotations/AnnotationRnd";
import { AxisLabel } from "../styled/AxisLabel";

const withGrid = WrappedComponent => {
  const hocComponent = props => {
    const {
      theme,
      name,
      gridParams: { width, xAxisLabel, yAxisLabel },
      view,
      item,
      setQuestionData,
      showChartTitle
    } = props;

    const [barIsDragging, toggleBarDragging] = useState(false);

    return (
      <FlexContainer justifyContent="flex-start" style={{ background: theme.widgets.chart.bgColor, overflowX: "auto" }}>
        <AxisLabel axis="y">{yAxisLabel}</AxisLabel>
        <div style={{ position: "relative" }}>
          <AnnotationRnd
            question={item}
            setQuestionData={setQuestionData}
            disableDragging={view !== EDIT}
            noBorder={view !== EDIT}
            isAbove={!barIsDragging}
            onDoubleClick={() => toggleBarDragging(!barIsDragging)}
          />
          {showChartTitle && (
            <FlexContainer style={{ width, marginBottom: 20 }} justifyContent="center">
              {name}
            </FlexContainer>
          )}
          <WrappedComponent {...props} toggleBarDragging={toggleBarDragging} />
          <AxisLabel>{xAxisLabel}</AxisLabel>
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
    showChartTitle: PropTypes.bool,
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
    showChartTitle: false,
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
