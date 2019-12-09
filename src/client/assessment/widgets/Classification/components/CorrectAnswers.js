import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Subtitle, MathFormulaDisplay } from "@edulastic/common";
import DragItem from "./DragItem";
import { getStemNumeration } from "../../../utils/helpers";

const CorrectAnswers = ({
  answersArr,
  columnTitles,
  stemNumeration,
  dragItemProps,
  colCount,
  possibleResponse,
  title
}) => {
  const transformArray = Arr => {
    const len = colCount || 2;
    const res = Array(...Array(len)).map(() => []);
    Arr.forEach((arr, i) => {
      res[i % len] = res[i % len].concat(arr.map(id => possibleResponse.find(_resp => _resp.id === id)));
    });
    return res.filter(r => r.length > 0);
  };

  const arrayOfCols = transformArray(answersArr);

  return (
    <>
      <Subtitle style={{ marginBottom: 20, marginTop: 20 }}>{title}</Subtitle>
      {arrayOfCols.map((answers, i) => (
        <CorrectAnswerContainer>
          <Subtitle>
            <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: columnTitles[i] }} />
          </Subtitle>
          {answers.map((res, index) => (
            <DragItem
              {...dragItemProps}
              dragHandle={false}
              disableDrag
              item={(res && res.value) || ""}
              key={`answer-${index}`}
              renderIndex={getStemNumeration(stemNumeration, index)}
            />
          ))}
        </CorrectAnswerContainer>
      ))}
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
  colCount: PropTypes.number
};

CorrectAnswers.defaultProps = {
  colCount: 2
};

export default CorrectAnswers;

const CorrectAnswerContainer = styled.div`
  display: inline-flex;
  margin-bottom: 40;
  flex-direction: column;
  align-items: stretch;
`;
