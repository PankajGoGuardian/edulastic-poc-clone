import React, { useLayoutEffect, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { get, maxBy } from "lodash";
import { CenteredText } from "@edulastic/common";

import produce from "immer";
import DropContainer from "../../../components/DropContainer";
import { getStemNumeration } from "../../../utils/helpers";
import DragItem from "./DragItem";
import { ColumnLabel } from "../styled/Column";
import { Rnd } from "../styled/RndWrapper";
import { RowTitleCol } from "../styled/RowTitleCol";
import ResponseRnd from "../ResponseRnd";
import { EDIT } from "../../../constants/constantsForQuestions";

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
  dragItemSize
}) => {
  const wrapperRef = useRef();
  const observeRef = useRef(null);
  const imageOptions = get(item, "imageOptions", {});
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

  const getChangedContainerHeight = h => Math.max(h, imageOptions.height + imageOptions.y);
  const getChangedContainerWidth = w => Math.max(w, imageOptions.width + imageOptions.x);

  const changeWrapperStyle = dropContainerDimensionsList => {
    const { height: maxHeight } = maxBy(dropContainerDimensionsList, dropContainer => dropContainer.height) || {};
    const { width: maxWidth } = maxBy(dropContainerDimensionsList, dropContainer => dropContainer.width) || {};
    /**
     * +40 is padding of element
     */
    const h = (getChangedContainerHeight(maxHeight) || maxHeight) + 40;
    const w = (getChangedContainerWidth(maxWidth) || maxWidth) + 40;
    if (wrapperRef.current) {
      wrapperRef.current.style.height = `${h}px`;
      wrapperRef.current.style.width = `${w}px`;
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
              <CenteredText
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  wordWrap: "break-word",
                  width: get(item, "uiStyle.row_titles_width", "max-content"),
                  height: get(item, "uiStyle.row_min_height", "50px")
                }}
                dangerouslySetInnerHTML={{ __html: rowTitles[index / colCount] }}
              />
            ) : null}
          </RowTitleCol>
        </Rnd>
      );
    }
    cols.push(
      <ResponseRnd hasRowTitle={hasRowTitle} question={item} index={index} isResizable={isResizable} {...dragItemSize}>
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
              const resp = (responses.length && responses.find(_resp => _resp.id === answerValue)) || {};
              const valid = get(validArray, [index, answerIndex], undefined);
              return (
                <DragItem
                  isTransparent={isTransparent}
                  dragHandle={dragHandle}
                  valid={isReviewTab ? true : valid}
                  preview={preview}
                  key={answerIndex}
                  renderIndex={getStemNumeration(
                    uiStyle.validationStemNumeration,
                    responses.findIndex(_resp => _resp.id === answerValue)
                  )}
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
        </DropContainer>
      </ResponseRnd>
    );
  }

  useLayoutEffect(() => {
    if (window.$ && !observeRef.current) {
      const jQuery = window.$;
      const dropContainerDimensionsList = [];

      // eslint-disable-next-line
      jQuery(".answer-draggable-wrapper").each(function(index) {
        const wraperElem = this;
        /**
         * need to put clientHeight for empty columns
         * this will be called only once on mounting this component
         */

        const position = jQuery(wraperElem).position();
        dropContainerDimensionsList[index] = {
          width: wraperElem.clientWidth + position.left + 2,
          height: wraperElem.clientHeight + position.top + 2
        };
        changeWrapperStyle(dropContainerDimensionsList);
      });
    }
  }, [item.responseOptions, item.imageOptions]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", minHeight: 140 }}>
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
  dragItemSize: PropTypes.object.isRequired
};

TableRow.defaultProps = {
  rowHeader: null
};

export default withTheme(TableRow);
