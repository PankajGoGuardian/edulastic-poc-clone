import React from "react";
import RectangleWrapper from "../styled/RectangleWrapper";
import Rectangle from "../styled/Rectangle";
import { green, redDark, lightBlue, mainBlueColor } from "@edulastic/colors/index";

const Rectangles = ({
  rows = 2,
  columns = 2,
  onSelect,
  selected,
  fractionNumber,
  previewTab,
  evaluation,
  isExpressGrader,
  isAnswerModifiable
}) => {
  const total = rows * columns;
  const offset = fractionNumber * total;
  return (
    <RectangleWrapper rows={rows} columns={columns}>
      {Array(total)
        .fill()
        .map((_, index) => {
          let fillColor;
          const _selected = selected.includes(index + 1 + offset);
          if (previewTab === "show") {
            if (isAnswerModifiable && isExpressGrader === undefined) {
              //showAnswer tab and test review page (show userAnswers with green or redDark)
              fillColor = _selected ? green : lightBlue;
            } else if (!isAnswerModifiable && !isExpressGrader) {
              // in LCB (show userAttempted answers as redDark or green)
              if (_selected) {
                fillColor = evaluation ? (evaluation[index + 1 + offset] ? green : redDark) : mainBlueColor;
              } else {
                fillColor = lightBlue;
              }
            } else if (isExpressGrader) {
              if (!isAnswerModifiable) {
                //inExprssGrader and editResponse if false (show userAnswers in greed or redDark)
                if (_selected) {
                  fillColor = evaluation ? (evaluation[index + 1 + offset] ? green : redDark) : mainBlueColor;
                } else {
                  fillColor = lightBlue;
                }
              } else {
                //inExprssGrader and editResponse if true
                fillColor = _selected ? mainBlueColor : lightBlue;
              }
            }
          } else if (previewTab === "check") {
            //checkAnswer tab (show userAttempted answers as redDark or green)
            if (_selected) {
              fillColor = evaluation ? (evaluation[index + 1 + offset] ? green : redDark) : mainBlueColor;
            } else {
              fillColor = lightBlue;
            }
          } else {
            //edit mode as well as clear
            fillColor = _selected ? mainBlueColor : lightBlue;
          }
          return (
            <Rectangle
              id={index + 1 + offset}
              key={index + 1 + offset}
              onClick={() => onSelect(index + 1 + offset)}
              selected={selected.includes(index + 1 + offset)}
              fillColor={fillColor}
              previewTab={previewTab}
            />
          );
        })}
    </RectangleWrapper>
  );
};

export default Rectangles;
