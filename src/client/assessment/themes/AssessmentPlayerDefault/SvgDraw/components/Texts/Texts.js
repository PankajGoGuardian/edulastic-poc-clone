import React from "react";
import styled from "styled-components";
import { drawTools } from "@edulastic/constants";

const Texts = ({ texts, currentPosition, onMouseDown, onMouseUp, onDelete, onEditText }) =>
  texts.length > 0 &&
  texts.map(
    (text, i) =>
      currentPosition.index !== i && (
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        <Text
          key={i}
          x={text.x}
          y={text.y + 25}
          onMouseDown={onMouseDown(drawTools.DRAW_TEXT, i)}
          onTouchStart={onMouseDown(drawTools.DRAW_TEXT, i)}
          onMouseUp={onMouseUp(drawTools.DRAW_TEXT, i)}
          onTouchEnd={onMouseUp(drawTools.DRAW_TEXT, i)}
          onClick={onDelete(drawTools.DRAW_SQUARE, i)}
          onDoubleClick={onEditText(i)}
          fontFamily={text.fontFamily}
          color={text.color}
          fontSize={text.lineWidth * 3}
        >
          {text.value}
        </Text>
      )
  );

export default Texts;

const Text = styled.text`
  cursor: pointer;
  stroke: ${({ color }) => color};
  fill: ${({ color }) => color};
  font-size: ${({ fontSize }) => fontSize}px;
  font-family: ${({ fontFamily }) => fontFamily || ""};
  user-select: none;
`;
