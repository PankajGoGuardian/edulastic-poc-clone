/* eslint-disable react/prop-types */
import React from "react";
import { CenteredText } from "@edulastic/common";
import { withTheme } from "styled-components";
import { get, groupBy } from "lodash";
import { Table, TH, TD, TR } from "../styled/TableLayout";

import DropContainer from "../../../components/DropContainer";
import DragItem from "./DragItem";
import { IndexBox } from "./DragItem/styled/IndexBox";
import { getStemNumeration } from "../../../utils/helpers";

const TableLayout = ({
  rowCount,
  rowTitles,
  colCount,
  colTitles,
  theme,
  dragHandle,
  isBackgroundImageTransparent,
  isTransparent,
  height,
  answers,
  drop,
  item,
  isReviewTab,
  evaluation,
  preview,
  onDrop,
  minWidth,
  disableResponse,
  rowHeader = "",
  dragItemSize = {},
  showIndex
}) => {
  const uiStyle = get(item, "uiStyle", {});
  const classifications = get(item, ["classifications"], []);
  const classificationsGrouped = groupBy(classifications, obj => obj.rowIndex);

  let validIndex = -1;
  const styles = {
    columnContainerStyle: {
      display: "flex",
      flexWrap: "wrap",
      minHeight: height,
      minWidth,
      width: "100%",
      height: "100%",
      backgroundColor: isBackgroundImageTransparent ? "transparent" : theme.widgets.classification.dropContainerBgColor
    }
  };
  const responses = item.groupPossibleResponses
    ? item.possibleResponseGroups.flatMap(group => group.responses)
    : item.possibleResponses;
  const columnTitles = [];

  for (let index = 0; index < colCount; index++) {
    columnTitles.push(
      <TH colSpan={2} style={{ minWidth: showIndex ? minWidth + 40 : minWidth }}>
        <CenteredText style={{ wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: colTitles[index] }} />
      </TH>
    );
  }

  const rows = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const arr = [];
    arr.push(
      <TD center>
        <CenteredText style={{ wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: rowTitles[rowIndex] }} />
      </TD>
    );
    for (let columnIndex = 0; columnIndex < colCount; columnIndex++) {
      validIndex++;
      const renderIndex = getStemNumeration(uiStyle.validationStemNumeration, validIndex);
      const column = classificationsGrouped?.[rowIndex]?.[columnIndex] || {};
      const hasAnswer = Array.isArray(answers[column.id]) && answers[column.id].length > 0;
      arr.push(
        <TD>
          <DropContainer
            drop={drop}
            index={validIndex}
            columnId={column.id}
            flag="column"
            style={{
              display: "flex",
              borderRadius: 4
            }}
          >
            {showIndex && <IndexBox style={{ margin: "5px 0px 5px 5px" }}>{renderIndex}</IndexBox>}
            <div
              style={{
                ...styles.columnContainerStyle,
                justifyContent: "flex-start",
                position: "relative",
                flexDirection: "column"
              }}
            >
              {hasAnswer &&
                // eslint-disable-next-line no-loop-func
                answers[column.id].map((responseId, answerIndex) => {
                  const resp = responses.find(res => res.id === responseId);
                  const valid = get(evaluation, [column.id, responseId], undefined);
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
                      {...dragItemSize}
                      isResetOffset
                      from="column"
                      fromColumnId={column.id}
                    />
                  );
                })}
            </div>
          </DropContainer>
        </TD>
      );
    }
    rows.push(<TR className="table-layout">{arr}</TR>);
  }

  return (
    <Table>
      <TR className="table-layout">
        <TH>
          <CenteredText style={{ wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: rowHeader }} />
        </TH>
        {columnTitles}
      </TR>
      {rows}
    </Table>
  );
};

export default withTheme(TableLayout);
