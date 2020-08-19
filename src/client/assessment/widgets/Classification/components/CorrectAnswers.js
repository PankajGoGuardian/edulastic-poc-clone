import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import produce from "immer";

import { Subtitle } from "@edulastic/common";

import DragItem from "./DragItem";
import { getStemNumeration } from "../../../utils/helpers";
import { IndexBox } from "./DragItem/styled/IndexBox";
import { ColumnHeader, ColumnLabel } from "../styled/Column";

const CorrectAnswers = ({
  answersArr,
  columnTitles,
  stemNumeration,
  dragItemProps,
  possibleResponse,
  multiRow,
  title,
  classifications = []
}) => {
  const replaceIdWithValue = answers => {
    const res = produce(answers, draft => {
      Object.keys(draft).forEach(key => {
        const responseIds = draft[key];
        const responses = responseIds?.map(id => {
          const option = possibleResponse.find(resp => resp.id === id);
          if (option) {
            return option.value;
          }
          return "";
        });
        draft[key] = responses;
      });
    });
    return res;
  };

  const containers = replaceIdWithValue(answersArr);

  const boxWidth = dragItemProps.width;
  return (
    <>
      <Subtitle style={{ marginBottom: 20, marginTop: 20 }}>{title}</Subtitle>
      <ColWrapper multiRow={multiRow}>
        {classifications.map((classification, index) => {
          const answers = containers[classification.id] || [];
          const indexValue = getStemNumeration(stemNumeration, index);
          return (
            <CorrectAnswerContainer multiRow={multiRow} minWidth={boxWidth}>
              {multiRow && <IndexBox style={{ margin: 5 }}>{indexValue}</IndexBox>}
              {!multiRow && (
                <ColumnHeader>
                  <IndexBox>{indexValue}</IndexBox>
                  <ColumnLabel dangerouslySetInnerHTML={{ __html: columnTitles[index] }} />
                </ColumnHeader>
              )}
              <AnswersContainer>
                {answers.map((res, i) => (
                  <DragItem {...dragItemProps} dragHandle={false} disableDrag item={res || ""} key={`answer-${i}`} />
                ))}
              </AnswersContainer>
            </CorrectAnswerContainer>
          );
        })}
      </ColWrapper>
    </>
  );
};

CorrectAnswers.propTypes = {
  answersArr: PropTypes.array.isRequired,
  columnTitles: PropTypes.array.isRequired,
  stemNumeration: PropTypes.string.isRequired,
  dragItemProps: PropTypes.object.isRequired,
  possibleResponse: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  multiRow: PropTypes.bool.isRequired,
  colCount: PropTypes.number
};

CorrectAnswers.defaultProps = {
  colCount: 2
};

export default CorrectAnswers;

const CorrectAnswerContainer = styled.div`
  display: inline-flex;
  align-items: stretch;
  border: 1px dashed;
  margin-right: 16px;
  flex-direction: ${({ multiRow }) => (multiRow ? "row" : "column")};
  margin-bottom: ${({ multiRow }) => (multiRow ? "16px" : "40px")};
  min-width: ${({ minWidth }) => minWidth}px;
  &:last-child {
    margin-right: 0px;
  }
`;

const ColWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const AnswersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
