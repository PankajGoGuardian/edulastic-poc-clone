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
          let fillColor = lightBlue;
          const _selected = selected.includes(index + 1 + offset);
          if (previewTab === "edit" || previewTab === "clear") {
            // edit mode as well as clear
            fillColor = _selected ? mainBlueColor : lightBlue;
          } else if (_selected) {
            // show answers with highlighting (correct: green, wrong: darkRed)
            fillColor = evaluation ? (evaluation[index + 1 + offset] === true ? green : redDark) : mainBlueColor;
          }
          if (isExpressGrader && isAnswerModifiable && _selected) {
            // in expressGrader and edit response is on
            // override default highlighting with darkBlue color when selected
            fillColor = mainBlueColor;
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
