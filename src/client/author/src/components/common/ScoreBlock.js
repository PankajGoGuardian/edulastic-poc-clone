import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { IconCheck, IconClose } from "@edulastic/icons";
import { mediumDesktopWidth } from "@edulastic/colors";

const Wrapper = styled.div`
  display: flex;
  align-self: stretch;
  align-items: center;
  height: 32px;
  padding: 0px 24px 0px 10px;
 
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

  @media (max-width: ${mediumDesktopWidth}) {
      height: 28px;
    }
`;

const ScoreBlock = ({ score, maxScore, showScore }) => {
  const scoreType = score === 0 ? "incorrect" : score === maxScore ? "allCorrect" : "partiallyCorrect";
  return showScore ? (
    <Wrapper scoreType={scoreType}>
      <div>{score !== 0 ? <IconCheck /> : <IconClose />}</div>
      <div>
        Score {score}/{maxScore}
      </div>
    </Wrapper>
  ) : null;
};

ScoreBlock.propTypes = {
  score: PropTypes.number.isRequired,
  maxScore: PropTypes.number.isRequired,
  showScore: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  score: state?.itemScore?.score,
  maxScore: state?.itemScore?.maxScore,
  showScore: state?.itemScore?.showScore || false
});

export default connect(mapStateToProps)(ScoreBlock);
