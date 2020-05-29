import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { IconCheck, IconClose } from "@edulastic/icons";
import { mediumDesktopExactWidth } from "@edulastic/colors";

const Wrapper = styled.div`
  display: flex;
  align-self: stretch;
  align-items: center;
  height: 28px;
  padding: 0px 24px 0px 10px;
  position: absolute;
  left: 0%;
  top: 50%;
  transform: translate(-100%, -50%);
  ${({ customStyle }) => ({ ...customStyle })};
  
  ${({ scoreType, theme }) => {
    const obj = {};
    if (scoreType === "allCorrect") {
      obj.backgroundColor = theme.common.correctScoreBlockBgColor;
      obj.fillColor = theme.common.correctScoreBlockIconFillColor;
    } else if (scoreType === "partiallyCorrect") {
      obj.backgroundColor = theme.common.partiallyCorrectScoreBlockBgColor;
      obj.fillColor = theme.common.partiallyCorrectScoreBlockIconFillColor;
    } else {
      obj.backgroundColor = theme.common.incorrectScoreBlockBgColor;
      obj.fillColor = theme.common.incorrectScoreBlockIconFillColor;
    }
    return `
      background-color: ${obj.backgroundColor};
      svg {
        position: unset;
        display: flex;
        transform: unset;
        margin-right: 1rem;
        fill: ${obj.fillColor};
      }
    `;
  }}

  @media(min-width: ${mediumDesktopExactWidth}) {
      height: 32px;
    }
`;

const ScoreBlock = ({ score, maxScore, showScore, customStyle }) => {
  const scoreType = score === 0 ? "incorrect" : score === maxScore ? "allCorrect" : "partiallyCorrect";
  return showScore ? (
    <Wrapper customStyle={customStyle} scoreType={scoreType} data-cy="scoreBlock">
      <div>{score !== 0 ? <IconCheck /> : <IconClose />}</div>
      <div data-cy="score">{score === 0 ? "Incorrect" : score === maxScore ? "Correct" : "Partially Correct"}</div>
    </Wrapper>
  ) : null;
};

ScoreBlock.propTypes = {
  score: PropTypes.number.isRequired,
  maxScore: PropTypes.number.isRequired,
  showScore: PropTypes.bool.isRequired,
  customStyle: PropTypes.object
};

ScoreBlock.defaultProps = {
  customStyle: {}
};

const mapStateToProps = state => ({
  score: state?.itemScore?.score,
  maxScore: state?.itemScore?.maxScore,
  showScore: state?.itemScore?.showScore || false
});

export default connect(mapStateToProps)(ScoreBlock);
