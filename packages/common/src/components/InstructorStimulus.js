import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withMathFormula } from "../HOC/withMathFormula";
import helpers from "../helpers";

const InstructorStimulus = ({ children, width }) =>
  !helpers.isEmpty(children) ? <Wrapper width={width} dangerouslySetInnerHTML={{ __html: children }} /> : null;

InstructorStimulus.propTypes = {
  children: PropTypes.string
};

InstructorStimulus.defaultProps = {
  children: ""
};

const Wrapper = withMathFormula(styled.div`
  padding: 25px;
  background: #e5f2fb;
  border-radius: 10px;
  margin-bottom: 15px;
  height: ${({ width }) => (!width ? null : width)};
`);

export default InstructorStimulus;
