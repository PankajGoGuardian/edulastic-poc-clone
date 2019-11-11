import React from "react";
import Table from "../styled/Table";
import { CenteredText } from "@edulastic/common";
import { withTheme } from "styled-components";
import { get } from "lodash";

import DropContainer from "../../../components/DropContainer";
import DragItem from "./DragItem";

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
  validArray,
  preview,
  onDrop,
  minWidth,
  disableResponse,
  rowHeader = ""
}) => {
  let validIndex = -1;
  const styles = {
    columnContainerStyle: {
      display: "flex",
      flexWrap: "wrap",
      minHeight: height,
      minWidth,
      width: "100%",
      height: "100%",
      borderRadius: 4,
      backgroundColor: isBackgroundImageTransparent ? "transparent" : theme.widgets.classification.dropContainerBgColor
    }
  };
  const responses = item.groupPossibleResponses
    ? item.possibleResponseGroups.flatMap(group => group.responses)
    : item.possibleResponses;
  const columnTitles = [];
  for (let index = 0; index < colCount; index++) {
    columnTitles.push(
      <th colSpan={2}>
        <CenteredText style={{ wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: colTitles[index] }} />
      </th>
    );
  }
  const rows = [];
  for (let index = 0; index < rowCount; index++) {
    const arr = [];
    arr.push(
      <td>
        <CenteredText style={{ wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: rowTitles[index] }} />
      </td>
    );
    for (let innnerIndex = 0; innnerIndex < colCount; innnerIndex++) {
      validIndex++;
      arr.push(
        <td colSpan={2}>
          <DropContainer
            style={{
              ...styles.columnContainerStyle,
              justifyContent: "center"
            }}
            drop={drop}
            index={validIndex}
            flag="column"
          >
            {Array.isArray(answers) &&
              Array.isArray(answers[validIndex]) &&
              answers[validIndex].map((ansId, answerIndex) => {
                const resp = responses.find(resp => resp.id === ansId);
                const valid = get(validArray, [validIndex, resp.id], undefined);
                return (
                  <DragItem
                    isTransparent={isTransparent}
                    dragHandle={dragHandle}
                    valid={isReviewTab ? true : valid}
                    preview={preview}
                    key={answerIndex}
                    renderIndex={responses.findIndex(resp => resp.id === ansId)}
                    onDrop={onDrop}
                    item={(resp && resp.value) || ""}
                    disableResponse={disableResponse}
                    isResetOffset
                  />
                );
              })}
          </DropContainer>
        </td>
      );
    }
    rows.push(<tr>{arr}</tr>);
  }
  return (
    <Table>
      <tr>
        <th>
          <CenteredText style={{ wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: rowHeader }} />
        </th>
        {columnTitles}
      </tr>
      {rows}
    </Table>
  );
};

export default withTheme(TableLayout);
