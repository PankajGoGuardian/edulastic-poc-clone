import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { themeColor, mobileWidthMax, lightGreySecondary } from "@edulastic/colors";

import { formatDateAndTime } from "../utils";

const Attempt = ({ data, type, activityReview, releaseScore, showReviewButton, releaseGradeLabels, classId }) => {
  const { correct = 0, wrong = 0, maxScore = 0, score = 0 } = data;
  const total = correct + wrong;
  const percentage = (score / maxScore) * 100 || 0;
  return (
    <AttemptsData>
      <RowData pagetype={type === "reports"}>
        <AnswerAndScore>
          <span data-cy="date">{formatDateAndTime(data.createdAt)}</span>
        </AnswerAndScore>
        {releaseScore !== releaseGradeLabels.DONT_RELEASE && (
          <React.Fragment>
            {releaseScore === releaseGradeLabels.WITH_ANSWERS && (
              <AnswerAndScore>
                <span data-cy="score">
                  {Math.floor(score * 100) / 100}/{Math.floor(maxScore * 100) / 100}
                </span>
              </AnswerAndScore>
            )}
            <AnswerAndScore>
              <span data-cy="percentage">{Math.round(percentage)}%</span>
            </AnswerAndScore>
          </React.Fragment>
        )}

        <SpaceBetween pagetype={type === "reports"} />
        {type === "reports" && activityReview && showReviewButton ? (
          <AnswerAndScoreReview>
            <Link to={`/home/class/${classId}/test/${data.testId}/testActivityReport/${data._id}`}>
              <span data-cy="review">REVIEW</span>
            </Link>
          </AnswerAndScoreReview>
        ) : (
          (showReviewButton || type !== "reports") && <EmptyScoreBox />
        )}
      </RowData>
    </AttemptsData>
  );
};

export default Attempt;

Attempt.propTypes = {
  data: PropTypes.object.isRequired
};

const AttemptsData = styled.div`
  margin-top: 7px;
  @media (max-width: ${mobileWidthMax}) {
    margin: 7px 7px 0px 7px;
  }
`;

const AnswerAndScore = styled.div`
  width: 135px;
  display: flex;
  align-items: center;
  flex-direction: column;
  span {
    font-size: ${props => props.theme.assignment.attemptsReviewRowFontSize};
    font-weight: bold;
    color: #434b5d;
  }
  @media screen and (max-width: ${mobileWidthMax}) {
    flex-basis: 25%;
    &:nth-child(1) {
      flex-basis: 50%;
    }
  }
  ${({ theme }) =>
    theme.zoomedCss`
      width: auto;
    `}
`;

const SpaceBetween = styled.div`
  width: 10px;
  @media screen and (max-width: 1024px) {
    display: ${props => (props.pagetype ? "initial" : "none !important")};
  }
`;

const AnswerAndScoreReview = styled(AnswerAndScore)`
  span {
    color: #00b0ff;
    cursor: pointer;
  }
  @media screen and (min-width: 769px) {
    width: 200px;
  }
  @media screen and (max-width: ${mobileWidthMax}) {
    width: 33%;
  }
`;

const EmptyScoreBox = styled(AnswerAndScoreReview)`
  @media screen and (max-width: 1024px) {
    display: none !important;
  }
`;

const RowData = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 4px;
  height: auto;
  background-color: ${lightGreySecondary};
  padding: 3px;
  @media screen and (max-width: ${mobileWidthMax}) {
    height: auto;
    justify-content: space-between;
  }
  ${({ theme }) =>
    theme.zoomedCss`
      height: auto;
      justify-content: space-between;
    `}
  div {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: ${mobileWidthMax}) {
      justify-content: flex-start;
    }
  }
  span {
    font-weight: 600 !important;
    color: #9ca0a9;
  }
  a {
    span {
      color: ${themeColor};
    }
  }
`;
