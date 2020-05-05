import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { greyThemeLight, greyThemeLighter } from "@edulastic/colors";

const StyledSpan = styled.span`
  padding: 4px 5px;
  border-radius: 2px;
  border: 1px solid ${greyThemeLight};
  background: ${greyThemeLighter};
  display: inline-block;
  vertical-align: middle;
  margin-top: 2px;
  margin-bottom: 2px;
  height: ${({ height }) => height || "31px"};
  width: ${({ width }) => width || "31px"};
`;

const ClozeInputAnswerDisplay = ({ resprops, id }) => {
  const { answers = {}, uiStyles } = resprops;
  const { inputs: _userAnwers = [] } = answers;
  const val = _userAnwers[id] ? _userAnwers[id].value : "";
  return (
    <StyledSpan height={uiStyles.height} width={uiStyles.minWidth}>
      {val}
    </StyledSpan>
  );
};

ClozeInputAnswerDisplay.propTypes = {
  id: PropTypes.string.isRequired,
  resprops: PropTypes.object.isRequired
};

export default ClozeInputAnswerDisplay;
