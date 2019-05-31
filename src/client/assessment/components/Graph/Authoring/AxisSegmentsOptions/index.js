import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import AxisSegmentsMoreOptions from "./AxisSegmentsMoreOptions";
import { FRACTIONS_FORMAT, RENDERING_BASE } from "../../Builder/config/constants";

const AxisSegmentsOptions = ({
  setCanvas,
  setOptions,
  setNumberline,
  fillSections,
  cleanSections,
  graphData,
  setValidation,
  setControls,
  advancedAreOpen
}) => {
  const fontSizeList = [
    {
      id: "small",
      label: "Small",
      value: 10,
      selected: false
    },
    {
      id: "normal",
      label: "Normal",
      value: 12,
      selected: true
    },
    {
      id: "large",
      label: "Large",
      value: 16,
      selected: false
    },
    {
      id: "extra_large",
      label: "Extra large",
      value: 20,
      selected: false
    },
    {
      id: "huge",
      label: "Huge",
      value: 24,
      selected: false
    }
  ];

  const orientationList = [{ value: "horizontal", label: "Horizontal" }, { value: "vertical", label: "Vertical" }];

  const fractionsFormatList = [
    {
      id: FRACTIONS_FORMAT.NOT_NORMALIZED,
      value: "Not normalized and mixed fractions",
      label: "Not normalized and mixed fractions",
      selected: true
    },
    {
      id: FRACTIONS_FORMAT.NORMALIZED,
      value: "Normalized and mixed fractions",
      label: "Normalized and mixed fractions",
      selected: false
    },
    {
      id: FRACTIONS_FORMAT.IMPROPER,
      value: "Improper fractions",
      label: "Improper fractions",
      selected: false
    }
  ];

  const renderingBaseList = [
    {
      id: RENDERING_BASE.LINE_MINIMUM_VALUE,
      value: "Line minimum value",
      label: "Line minimum value",
      selected: true
    },
    {
      id: RENDERING_BASE.ZERO_BASED,
      value: "Zero",
      label: "Zero",
      selected: false
    }
  ];

  return (
    <Fragment>
      <AxisSegmentsMoreOptions
        setCanvas={setCanvas}
        setOptions={setOptions}
        setControls={setControls}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setNumberline={setNumberline}
        setValidation={setValidation}
        fontSizeList={fontSizeList}
        orientationList={orientationList}
        renderingBaseList={renderingBaseList}
        fractionsFormatList={fractionsFormatList}
        graphData={graphData}
        advancedAreOpen={advancedAreOpen}
      />
    </Fragment>
  );
};

AxisSegmentsOptions.propTypes = {
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired,
  setOptions: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setValidation: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool
};

AxisSegmentsOptions.defaultProps = {
  advancedAreOpen: false
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(AxisSegmentsOptions);
