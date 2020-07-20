import React from "react";

import { FlexContainer, CorrectAnswersContainer } from "@edulastic/common";
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
    <CorrectAnswersContainer
      title="Correct Answer"
      noBackground
      showBorder
      padding="20px 45px 45px"
      margin="0px"
      titleMargin="0px 0px 20px"
    >
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
    </CorrectAnswersContainer>
  );
};

export default CorrectAnswerBox;
