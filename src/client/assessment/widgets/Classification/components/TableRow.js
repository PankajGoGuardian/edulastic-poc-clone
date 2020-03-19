import React, { useRef } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { get } from "lodash";
import { CenteredText } from "@edulastic/common";

import produce from "immer";
import DropContainer from "../../../components/DropContainer";
import { getStemNumeration } from "../../../utils/helpers";
import DragItem from "./DragItem";
import { ColumnHeader, ColumnLabel } from "../styled/Column";
import { Rnd } from "../styled/RndWrapper";
import { RowTitleCol } from "../styled/RowTitleCol";
import ResponseRnd from "../ResponseRnd";
import { EDIT } from "../../../constants/constantsForQuestions";
import { IndexBox } from "./DragItem/styled/IndexBox";

import TriggerStyle from "./TriggerStyle";

const TableRow = ({
  startIndex,
  colCount,
  rowTitles,
  colTitles,
  drop,
  answers,
  preview,
  onDrop,
  validArray,
  dragHandle,
  isTransparent,
  isBackgroundImageTransparent,
  height,
  theme,
  isResizable,
  item,
  disableResponse,
  isReviewTab,
  view,
  setQuestionData,
  rowHeader,
  dragItemSize,
  showIndex
}) => {
  const wrapperRef = useRef();
  const uiStyle = get(item, "uiStyle", {});

  const handleRowTitleDragStop = (event, data) => {
    if (setQuestionData) {
      setQuestionData(
        produce(item, draft => {
          draft.rowTitle = { x: data.x < 0 ? 0 : data.x, y: data.y < 0 ? 0 : data.y };
        })
      );
    }
  };

  const handleRowHeaderDragStop = (e, d) => {
    if (setQuestionData) {
      setQuestionData(
        produce(item, draft => {
          draft.rowHeaderPos = { x: d.x < 0 ? 0 : d.x, y: d.y < 0 ? 0 : d.y };
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
      overflow: "auto",
      borderRadius: 4,
      backgroundColor: isBackgroundImageTransparent ? "transparent" : theme.widgets.classification.dropContainerBgColor,
      flex: 1
    }
  };

  const cols = [];
  const rndX = get(item, `rowTitle.x`, 0);
  const rndY = get(item, `rowTitle.y`, rowHeader ? 40 : 0);

  const rowHeaderX = get(item, `rowHeaderPos.x`, 0);
  const rowHeaderY = get(item, `rowHeaderPos.y`, 0);

  const responses = item.groupPossibleResponses
    ? item.possibleResponseGroups.flatMap(group => group.responses)
    : item.possibleResponses;

  if (rowHeader) {
    cols.push(
      <Rnd
        position={{ x: rowHeaderX, y: rowHeaderY }}
        disableDragging={view !== EDIT}
        onDragStop={handleRowHeaderDragStop}
      >
        <RowTitleCol colCount={colCount} justifyContent="center" width="100%" padding="0" marginTop="0">
          <CenteredText
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              wordWrap: "break-word",
              width: 200,
              minHeight: 39
            }}
            dangerouslySetInnerHTML={{ __html: rowHeader }}
          />
        </RowTitleCol>
      </Rnd>
    );
  }

  for (let index = startIndex; index < startIndex + colCount; index++) {
    const hasRowTitle = rowTitles.length > 0;
    if (hasRowTitle && rowTitles[index / colCount]) {
      cols.push(
        <Rnd position={{ x: rndX, y: rndY }} disableDragging={view !== EDIT} onDragStop={handleRowTitleDragStop}>
          <RowTitleCol
            key={index + startIndex + colCount}
            colCount={colCount}
            justifyContent="center"
            width="100%"
            padding="0"
            marginTop="0"
          >
            {rowTitles[index / colCount] || rowTitles[index / colCount] === "" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  wordWrap: "break-word",
                  width: get(item, "uiStyle.row_titles_width", "max-content"),
                  height: get(item, "uiStyle.row_min_height", "auto")
                }}
                dangerouslySetInnerHTML={{ __html: rowTitles[index / colCount] }}
              />
            ) : null}
          </RowTitleCol>
        </Rnd>
      );
    }
    const renderIndex = getStemNumeration(uiStyle.validationStemNumeration, index);
    const hasAnswer = Array.isArray(answers) && Array.isArray(answers[index]) && answers[index].length > 0;

    cols.push(
      <ResponseRnd
        hasRowTitle={hasRowTitle}
        question={item}
        index={index}
        isResizable={isResizable}
        showIndex={showIndex}
        {...dragItemSize}
      >
        {colTitles[index % colCount] || colTitles[index % colCount] === "" ? (
          <ColumnHeader>
            {showIndex && hasAnswer && <IndexBox>{renderIndex}</IndexBox>}
            <ColumnLabel dangerouslySetInnerHTML={{ __html: colTitles[index % colCount] }} />
          </ColumnHeader>
        ) : null}
        <DropContainer
          style={{
            ...styles.columnContainerStyle,
            justifyContent: "center",
            position: "relative"
          }}
          drop={drop}
          index={index}
          flag="column"
        >
          {hasAnswer &&
            answers[index].map((answerValue, answerIndex) => {
              const resp = (responses.length && responses.find(_resp => _resp.id === answerValue)) || {};
              const valid = get(validArray, [index, answerIndex], undefined);
              return (
                <DragItem
                  isTransparent={isTransparent}
                  dragHandle={dragHandle}
                  valid={isReviewTab ? true : valid}
                  preview={preview}
                  key={answerIndex}
                  onDrop={onDrop}
                  item={(resp && resp.value) || ""}
                  disableResponse={disableResponse}
                  isResetOffset
                  noPadding
                  from="column"
                  {...dragItemSize}
                />
              );
            })}
          <TriggerStyle />
        </DropContainer>
      </ResponseRnd>
    );
  }

  return (
    <div
      ref={wrapperRef}
      id="classification-cols-container"
      style={{ position: "relative", minHeight: 140, overflow: "hidden" }}
    >
      {cols}
    </div>
  );
};

TableRow.propTypes = {
  height: PropTypes.any.isRequired,
  startIndex: PropTypes.number.isRequired,
  colCount: PropTypes.number.isRequired,
  dragHandle: PropTypes.any.isRequired,
  colTitles: PropTypes.array.isRequired,
  rowTitles: PropTypes.array.isRequired,
  isTransparent: PropTypes.any.isRequired,
  isBackgroundImageTransparent: PropTypes.any.isRequired,
  drop: PropTypes.func.isRequired,
  answers: PropTypes.array.isRequired,
  preview: PropTypes.bool.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  validArray: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  isReviewTab: PropTypes.bool.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  isResizable: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  rowHeader: PropTypes.string,
  dragItemSize: PropTypes.object.isRequired,
  showIndex: PropTypes.bool.isRequired
};

TableRow.defaultProps = {
  rowHeader: null
};

export default withTheme(TableRow);
