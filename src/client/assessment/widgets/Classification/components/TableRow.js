/* eslint-disable */
import React, { useLayoutEffect, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { Rnd } from "react-rnd";

import { get } from "lodash";
import { CenteredText } from "@edulastic/common";

import produce from "immer";
import DropContainer from "../../../components/DropContainer";

import DragItem from "./DragItem";
import { ColumnLabel } from "../styled/Column";
import { RowTitleCol } from "../styled/RowTitleCol";
import ResponseRnd from "../ResponseRnd";
import { EDIT } from "../../../constants/constantsForQuestions";

const dropContainerHeightList = [];

const TableRow = ({
  startIndex,
  colCount,
  arrayOfRows,
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
  rowHeader
}) => {
  const wrapperRef = useRef();

  const handleRowTitleDragStop = (event, data) => {
    if (setQuestionData) {
      setQuestionData(
        produce(item, draft => {
          draft.rowTitle = { x: data.x, y: data.y };
        })
      );
    }
  };

  const handleRowHeaderDragStop = (e, d) => {
    if (setQuestionData) {
      setQuestionData(
        produce(item, draft => {
          draft.rowHeaderPos = { x: d.x, y: d.y };
        })
      );
    }
  };

  const getChangedContainerHeight = h =>
    Math.max(h,item?.imageOptions?.height + item?.imageOptions?.y);

  const changeWrapperH = () => {
    const { responseOptions = [] } = item;
    let maxH = 0;
    for (let i = 0; i < dropContainerHeightList.length; i += 1) {
      const { y = 0, height: _h = 0 } = responseOptions[i] || {};
      const _containerH = y + (_h || dropContainerHeightList[i]);
      if (maxH < _containerH) {
        maxH = _containerH;
      }
    }
    const h = getChangedContainerHeight(maxH) + 40 || maxH + 40; // +40 to remove scrollbar on drag
    wrapperRef.current.style.height = `${h}px`;
  };

  const styles = {
    columnContainerStyle: {
      display: "flex",
      flexWrap: "wrap",
      minHeight: height,
      width: "100%",
      height: "100%",
      borderRadius: 4,
      backgroundColor: isBackgroundImageTransparent ? "transparent" : theme.widgets.classification.dropContainerBgColor,
      flex: 1
    }
  };

  const cols = [];
  // eslint-disable-next-line no-unused-vars
  let validIndex = -1;
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
        default={{ x: rowHeaderX, y: rowHeaderY }}
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
    if (hasRowTitle) {
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
                  height: "85px"
                }}
                dangerouslySetInnerHTML={{ __html: rowTitles[index / colCount] }}
              />
            ) : null}
          </RowTitleCol>
        </Rnd>
      );
    }
    cols.push(
      <ResponseRnd hasRowTitle={hasRowTitle} question={item} index={index} isResizable={isResizable}>
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
              validIndex += 1;
              const resp = (responses.length && responses.find(_resp => _resp.id === answerValue)) || {};
              const valid = get(validArray, [index, resp.id], undefined);
              return (
                <DragItem
                  isTransparent={isTransparent}
                  dragHandle={dragHandle}
                  valid={isReviewTab ? true : valid}
                  preview={preview}
                  key={answerIndex}
                  renderIndex={responses.findIndex(_resp => _resp.id === answerValue)}
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

  useLayoutEffect(() => {
    if (window.$ && wrapperRef.current) {
      $(".answer-draggable-wrapper").each(function(index) {
        const wraperElem = this;
        const observer = new MutationObserver(function() {
          setTimeout(() => {
            dropContainerHeightList[index] = wraperElem.clientHeight;
            changeWrapperH();
          });
        });
        const config = { childList: true, subtree: true };
        observer.observe(this, config);
      });
    }
  });

  useEffect(() => {
    changeWrapperH();
  }, [item.responseOptions, item.imageOptions]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", padding: "20px" }}>
      {cols}
    </div>
  );
};

TableRow.propTypes = {
  height: PropTypes.any.isRequired,
  startIndex: PropTypes.number.isRequired,
  colCount: PropTypes.number.isRequired,
  dragHandle: PropTypes.any.isRequired,
  arrayOfRows: PropTypes.object.isRequired,
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
  rowHeader: PropTypes.string
};

TableRow.defaultProps = {
  rowHeader: null
};

export default withTheme(TableRow);
