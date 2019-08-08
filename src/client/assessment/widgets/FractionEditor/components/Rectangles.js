import React from "react";
import RectangleWrapper from "../styled/RectangleWrapper";
import Rectangle from "../styled/Rectangle";

const Rectangles = ({ rows = 2, columns = 2, onSelect, selected, fractionNumber }) => {
  const total = rows * columns;
  const offset = fractionNumber * total;
  return (
    <RectangleWrapper rows={rows} columns={columns}>
      {Array(total)
        .fill()
        .map((el, index) => {
          return (
            <Rectangle
              id={index + 1 + offset}
              key={index + 1 + offset}
              onClick={() => onSelect(index + 1 + offset)}
              selected={selected.includes(index + 1 + offset)}
            />
          );
        })}
    </RectangleWrapper>
  );
};

export default Rectangles;
