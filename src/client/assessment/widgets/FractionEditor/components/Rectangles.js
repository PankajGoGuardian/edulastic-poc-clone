import React from "react";
import RectangleWrapper from "../styled/RectangleWrapper";
import Rectangle from "../styled/Rectangle";

const Rectangles = ({ rows = 2, columns = 2, onSelect, selected, fractionNumber, fillColor, previewTab }) => {
  const total = rows * columns;
  const offset = fractionNumber * total;
  return (
    <RectangleWrapper rows={rows} columns={columns}>
      {Array(total)
        .fill()
        .map((_, index) => {
          return (
            <Rectangle
              id={index + 1 + offset}
              key={index + 1 + offset}
              onClick={() => onSelect(index + 1 + offset)}
              selected={selected.includes(index + 1 + offset)}
              fillColor={fillColor && fillColor[index + 1 + offset]}
              previewTab={previewTab}
            />
          );
        })}
    </RectangleWrapper>
  );
};

export default Rectangles;
