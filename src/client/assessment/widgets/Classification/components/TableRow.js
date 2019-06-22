import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";

import { CenteredText } from "@edulastic/common";

import DropContainer from "../../../components/DropContainer";

import DragItem from "./DragItem";
import { Column } from "../styled/Column";
import { RowTitleCol } from "../styled/RowTitleCol";

const TableRow = ({
  startIndex,
  colCount,
  arrayOfRows,
  rowTitles,
  drop,
  answers,
  preview,
  possible_responses,
  onDrop,
  validArray,
  dragHandle,
  isTransparent,
  isBackgroundImageTransparent,
  theme,
  width,
  height,
  disableResponse
}) => {
  const styles = {
    columnContainerStyle: {
      display: "flex",
      flexWrap: "wrap",
      width,
      minHeight: height,
      borderRadius: 4,
      backgroundColor: isBackgroundImageTransparent ? "transparent" : theme.widgets.classification.dropContainerBgColor
    }
  };

  const cols = [];

  let validIndex = -1;

  for (let index = startIndex; index < startIndex + colCount; index++) {
    if (arrayOfRows.has(index) && rowTitles.length > 0) {
      cols.push(
        <RowTitleCol key={index + startIndex + colCount} colCount={colCount}>
          <CenteredText
            style={{ wordWrap: "break-word", textAlign: "left" }}
            dangerouslySetInnerHTML={{ __html: rowTitles[index / colCount] || "" }}
          />
        </RowTitleCol>
      );
    }
    cols.push(
      <Column
        data-cy={`drag-drop-board-${index}`}
        id={`drag-drop-board-${index}`}
        key={index}
        rowTitles={rowTitles}
        colCount={colCount}
      >
        <DropContainer
          style={{
            ...styles.columnContainerStyle,
            justifyContent: "center"
          }}
          noTopBorder={index / colCount >= 1}
          drop={drop}
          index={index}
          flag="column"
        >
          {Array.isArray(answers) &&
            Array.isArray(answers[index]) &&
            answers[index].length > 0 &&
            // eslint-disable-next-line no-loop-func
            answers[index].map((answerValue, answerIndex) => {
              validIndex++;

              return (
                <DragItem
                  isTransparent={isTransparent}
                  dragHandle={dragHandle}
                  valid={validArray && validArray[validIndex]}
                  preview={preview}
                  key={answerIndex}
                  renderIndex={possible_responses.indexOf(answerValue)}
                  onDrop={onDrop}
                  item={answerValue}
                  disableResponse={disableResponse}
                />
              );
            })}
        </DropContainer>
      </Column>
    );
  }

  return <tr>{cols}</tr>;
};

TableRow.propTypes = {
  width: PropTypes.any.isRequired,
  height: PropTypes.any.isRequired,
  startIndex: PropTypes.number.isRequired,
  colCount: PropTypes.number.isRequired,
  dragHandle: PropTypes.any.isRequired,
  arrayOfRows: PropTypes.object.isRequired,
  rowTitles: PropTypes.array.isRequired,
  isTransparent: PropTypes.any.isRequired,
  isBackgroundImageTransparent: PropTypes.any.isRequired,
  drop: PropTypes.func.isRequired,
  answers: PropTypes.array.isRequired,
  preview: PropTypes.bool.isRequired,
  possible_responses: PropTypes.array.isRequired,
  onDrop: PropTypes.func.isRequired,
  validArray: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(TableRow);
