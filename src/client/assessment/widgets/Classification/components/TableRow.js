import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { Rnd } from "react-rnd";

import { get } from "lodash";
import { CenteredText } from "@edulastic/common";

import DropContainer from "../../../components/DropContainer";

import DragItem from "./DragItem";
import { Column, ColumnLabel } from "../styled/Column";
import { RowTitleCol } from "../styled/RowTitleCol";
import ResponseRnd from "../ResponseRnd";
import { SHOW, CHECK, EDIT, PREVIEW } from "../../../constants/constantsForQuestions";

import produce from "immer";

const TableRow = ({
  startIndex,
  colCount,
  arrayOfRows,
  rowTitles,
  colTitles,
  drop,
  answers,
  preview,
  possibleResponses,
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
  isReviewTab,
  previewTab,
  view,
  setQuestionData
}) => {
  const handleRowTitleDragStop = (event, data) => {
    if (setQuestionData) {
      setQuestionData(
        produce(item, draft => {
          draft.rowTitle = { x: data.x, y: data.y };
        })
      );
    }
  };
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
  const rowHasHeader = item.uiStyle && item.uiStyle.row_header;
  const cols = [];
  let validIndex = -1;
  const rndX = get(item, `rowTitle.x`, 0);
  const rndY = get(item, `rowTitle.y`, 0);
  const responses = item.groupPossibleResponses
    ? item.possibleResponseGroups.flatMap(group => group.responses)
    : item.possibleResponses;
  for (let index = startIndex; index < startIndex + colCount; index++) {
    if (arrayOfRows.has(index) && rowTitles.length > 0) {
      cols.push(
        <Rnd
          enableResizing={{
            bottom: false,
            bottomLeft: false,
            bottomRight: false,
            left: false,
            right: false,
            top: false,
            topLeft: false,
            topRight: false
          }}
          default={{ x: rndX, y: rndY }}
          disableDragging={view !== EDIT}
          onDragStop={handleRowTitleDragStop}
        >
          {rowHasHeader && <ColumnLabel dangerouslySetInnerHTML={{ __html: rowHasHeader }} />}

          <RowTitleCol
            key={index + startIndex + colCount}
            colCount={colCount}
            justifyContent="center"
            width="100%"
            padding="0"
            marginTop="0"
          >
            {rowTitles[index / colCount] || rowTitles[index / colCount] === "" ? (
              <CenteredText
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  wordWrap: "break-word",
                  width: `200px`,
                  height: "85px",
                  border: rowHasHeader ? `2px dashed ${theme.dropContainer.isNotOverBorderColor}` : "none"
                }}
                dangerouslySetInnerHTML={{ __html: rowTitles[index / colCount] }}
              />
            ) : null}
          </RowTitleCol>
        </Rnd>
      );
    }
    cols.push(
      <ResponseRnd
        rowHasTitle={rowTitles.length > 0}
        question={item}
        height="auto"
        index={index}
        isResizable={isResizable}
        rowHasHeader={rowHasHeader}
      >
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
              const resp = (responses.length && responses.find(resp => resp.id === answerValue)) || {};
              const valid = get(validArray, [index, resp.id], undefined);
              return (
                <DragItem
                  isTransparent={isTransparent}
                  dragHandle={dragHandle}
                  valid={isReviewTab ? true : valid}
                  preview={preview}
                  key={answerIndex}
                  renderIndex={responses.findIndex(resp => resp.id === answerValue)}
                  onDrop={onDrop}
                  item={(resp && resp.value) || ""}
                  disableResponse={disableResponse}
                  isResetOffset
                  noPadding
                  from="column"
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
  possibleResponses: PropTypes.array.isRequired,
  onDrop: PropTypes.func.isRequired,
  validArray: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  isResizable: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  previewTab: PropTypes.string.isRequired
};

export default withTheme(TableRow);
