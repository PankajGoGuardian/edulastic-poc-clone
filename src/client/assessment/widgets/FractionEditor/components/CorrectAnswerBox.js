import React from "react";

import { FlexContainer } from "@edulastic/common";

import { StyledCorrectAnswerbox } from "../../../components/CorrectAnswerBoxLayout/styled/StyledCorrectAnswerbox";
import { CorrectAnswerTitle } from "../../../components/CorrectAnswerBoxLayout/styled/CorrectAnswerTitle";
import Rectangles from "./Rectangles";
import Circles from "./Circles";

const CorrectAnswerBox = ({ fractionProperties, selected }) => {
  const { count, rows, columns, sectors, fractionType } = fractionProperties;
  /**
   * creating an object with keys as selected fractions and value to true
   * for example if
   * selected = [1, 2]
   * evaluation = {1: true, 2: true}
   */
  const evaluation = selected.reduce((obj, elem) => {
    obj[elem] = true;
    return obj;
  }, {});
  return (
    <StyledCorrectAnswerbox width="max-content">
      <CorrectAnswerTitle>Correct Answer</CorrectAnswerTitle>
      <FlexContainer justifyContent="flex-start" flexWrap="wrap">
        {Array(count)
          .fill()
          .map((_, index) =>
            fractionType === "circles" ? (
              <Circles
                fractionNumber={index}
                sectors={sectors}
                selected={selected}
                sectorClick={() => {}}
                previewTab="show"
                isExpressGrader={false}
                isAnswerModifiable={false}
                evaluation={evaluation}
                isReviewTab={false}
              />
            ) : (
              <Rectangles
                fractionNumber={index}
                rows={rows}
                columns={columns}
                selected={selected}
                onSelect={() => {}}
                previewTab="show"
                isExpressGrader={false}
                isAnswerModifiable={false}
                evaluation={evaluation}
                isReviewTab={false}
              />
            )
          )}
      </FlexContainer>
    </StyledCorrectAnswerbox>
  );
};

export default CorrectAnswerBox;
