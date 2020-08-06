import React from "react";
import PropTypes from "prop-types";

import { DragDropValuesContainer } from "./styled";
import { DropContainerTitle } from "../../../DropContainerTitle";

import { Responses } from "./Responses";

const DragDropValues = ({ values, width, layoutWidth, valueHeight }) => (
  <DragDropValuesContainer width={layoutWidth}>
    <DropContainerTitle>DRAG DROP VALUES</DropContainerTitle>
    <Responses values={values} width={width} valueHeight={valueHeight} />
  </DragDropValuesContainer>
);

DragDropValues.propTypes = {
  values: PropTypes.array,
  layoutWidth: PropTypes.number,
  width: PropTypes.number,
  valueHeight: PropTypes.number
};

DragDropValues.defaultProps = {
  values: [],
  width: 140,
  layoutWidth: 600,
  valueHeight: 32
};

export default DragDropValues;
