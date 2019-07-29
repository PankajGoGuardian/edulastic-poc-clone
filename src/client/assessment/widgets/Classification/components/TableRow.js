import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";

import { CenteredText } from "@edulastic/common";

import DropContainer from "../../../components/DropContainer";

import DragItem from "./DragItem";
import { Column, ColumnLabel } from "../styled/Column";
import { RowTitleCol } from "../styled/RowTitleCol";
import ResponseRnd from "../ResponseRnd";

const TableRow = ({
  startIndex,
  colCount,
  arrayOfRows,
  rowTitles,
  colTitles,
  drop,
  answers,
  preview,
  possible_responses,
  onDrop,
  validArray,
  dragHandle,
  isTransparent,
  isBackgroundImageTransparent,
  width,
  height,
  theme,
  isResizable,
  item,
  disableResponse,
  isReviewTab
}) => {
  const styles = {
    columnContainerStyle: {
      display: "flex",
      flexWrap: "wrap",
      minHeight: height,
      width: "100%",
      height: "100%",
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
          {rowTitles[index / colCount] || rowTitles[index / colCount] === "" ? (
            <CenteredText
              style={{ wordWrap: "break-word", textAlign: "left" }}
              dangerouslySetInnerHTML={{ __html: rowTitles[index / colCount] }}
            />
          ) : null}
        </RowTitleCol>
      );
    }
    cols.push(
      <ResponseRnd question={item} height="auto" index={index} isResizable={isResizable}>
        {colTitles[index % colCount] || colTitles[index % colCount] === "" ? (
          <ColumnLabel dangerouslySetInnerHTML={{ __html: colTitles[index % colCount] }} />
        ) : null}
        <DropContainer
          style={{
            ...styles.columnContainerStyle,
            justifyContent: "center"
          }}
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
              const resp = item.possible_responses.find(resp => resp.id === answerValue);
              return (
                <DragItem
                  isTransparent={isTransparent}
                  dragHandle={dragHandle}
                  valid={isReviewTab ? true : validArray && validArray[validIndex]}
                  preview={preview}
                  key={answerIndex}
                  renderIndex={item.possible_responses.findIndex(resp => resp.id === answerValue)}
                  onDrop={onDrop}
                  item={(resp && resp.value) || ""}
                  disableResponse={disableResponse}
                />
              );
            })}
        </DropContainer>
      </ResponseRnd>
    );
  }

  return <div style={{ position: "relative", width: "100%", height: "100%", overflowX: "auto" }}>{cols}</div>;
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
  theme: PropTypes.object.isRequired,
  isResizable: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired
};

export default withTheme(TableRow);
