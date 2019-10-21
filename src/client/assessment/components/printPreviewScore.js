import React from "react";
import styled from "styled-components";
import { someGreyColor1, lightBlue } from "@edulastic/colors";

const PrintPreviewScore = props => {
  const { className, maxScore, score } = props;

  return (
    <div className={className}>
      <div className="score-container">
        <div className="score-div">{score}</div>
        <div className="max-score-div">{maxScore}</div>
      </div>
    </div>
  );
};

const StyledPrintPreviewScore = styled(PrintPreviewScore)`
  width: 25%;
  display: flex;
  justify-content: center;
  padding: 10px;
  break-before: avoid;

  .score-container {
    height: 100px;
    width: 100px;
    display: flex;
    flex-direction: column;
    border: solid 1px ${someGreyColor1};
    padding: 10px;
    font-size: 25px;

    .score-div {
      border: solid 1px ${lightBlue};
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .max-score-div {
      border-top: solid 1px black;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
    }
  }
`;

export { StyledPrintPreviewScore as PrintPreviewScore };
