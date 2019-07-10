import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledSpan = styled.span`
  padding: 5px;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
`;

const ClozeInputAnswerDisplay = ({ resprops, id }) => {
  const { answers = {} } = resprops;
  const { inputs: _userAnwers } = answers;
  const val = _userAnwers[id] ? _userAnwers[id].value : "";
  return <StyledSpan>{val}</StyledSpan>;
};

ClozeInputAnswerDisplay.propTypes = {
  id: PropTypes.string.isRequired,
  resprops: PropTypes.object.isRequired
};

export default ClozeInputAnswerDisplay;
