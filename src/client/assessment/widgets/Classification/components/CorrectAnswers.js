import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Subtitle, MathFormulaDisplay } from "@edulastic/common";
import DragItem from "./DragItem";
import { getStemNumeration } from "../../../utils/helpers";
import { IndexBox } from "./DragItem/styled/IndexBox";

const CorrectAnswers = ({
  answersArr,
  columnTitles,
  stemNumeration,
  dragItemProps,
  colCount,
  possibleResponse,
  multiRow,
  title
}) => {
  const transformArray = Arr => {
    const len = colCount || 2;
    const res = multiRow ? [] : Array(...Array(len)).map(() => []);
    Arr.forEach((arr, i) => {
      if (multiRow) {
        res[i] = arr.map(id => possibleResponse.find(_resp => _resp.id === id));
      } else {
        res[i % len] = res[i % len].concat(arr.map(id => possibleResponse.find(_resp => _resp.id === id)));
      }
    });
    return res;
  };

  const arrayOfCols = transformArray(answersArr);

  const boxWidth = dragItemProps.width;

  return (
    <>
      <Subtitle style={{ marginBottom: 20, marginTop: 20 }}>{title}</Subtitle>
      <ColWrapper multiRow={multiRow}>
        {arrayOfCols.map((answers, i) => (
          <CorrectAnswerContainer multiRow={multiRow} minWidth={boxWidth}>
            {multiRow && <IndexBox style={{ margin: 5 }}>{getStemNumeration(stemNumeration, i)}</IndexBox>}
            {!multiRow && (
              <ColumnTitle>
                <IndexBox style={{ marginRight: 16, marginLeft: 4 }}>{getStemNumeration(stemNumeration, i)}</IndexBox>
                <Subtitle>
                  <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: columnTitles[i] }} />
                </Subtitle>
              </ColumnTitle>
            )}
            <AnswersContainer>
              {answers.map((res, index) => (
                <DragItem
                  {...dragItemProps}
                  dragHandle={false}
                  disableDrag
                  item={(res && res.value) || ""}
                  key={`answer-${index}`}
                />
              ))}
            </AnswersContainer>
          </CorrectAnswerContainer>
        ))}
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
  padding: 4px;
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

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
`;

const AnswersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
