import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { white, blue } from "@edulastic/colors";
import AnswerBoxText from "./AnswerBoxText";

const AnswerBox = ({
  mathAnswers,
  dropdownAnswers,
  textInputAnswers,
  altMathAnswers,
  altDropDowns,
  altInputs,
  responseIndexes
}) => {
  const { inputs, maths, dropDowns } = responseIndexes;
  let validAnswers = [];

  mathAnswers.map((answer, targetIndex) =>
    validAnswers.push({
      index: maths[targetIndex].index,
      value: answer,
      isMath: true
    })
  );

  dropdownAnswers.map((answer, targetIndex) =>
    validAnswers.push({
      index: dropDowns[targetIndex].index,
      value: answer,
      isMath: false
    })
  );

  textInputAnswers.map((answer, targetIndex) =>
    validAnswers.push({
      index: inputs[targetIndex].index,
      value: answer,
      isMath: false
    })
  );
  validAnswers = validAnswers.sort((a, b) => a.index - b.index);

  const altAnswers = altMathAnswers.map((alt, altIndex) => {
    const _altAnswers = [];

    alt.map((answer, targetIndex) =>
      _altAnswers.push({
        index: maths[targetIndex].index,
        value: answer,
        isMath: true
      })
    );

    altDropDowns[altIndex].map((answer, targetIndex) =>
      _altAnswers.push({
        index: dropDowns[targetIndex].index,
        value: answer,
        isMath: false
      })
    );

    altInputs[altIndex].map((answer, targetIndex) =>
      _altAnswers.push({
        index: inputs[targetIndex].index,
        value: answer,
        isMath: false
      })
    );

    return _altAnswers.sort((a, b) => a.index - b.index);
  });

  return (
    <Wrapper>
      <Title>Correct answers</Title>
      {validAnswers.map((answer, index) => (
        <Answer key={index}>
          <Label>{answer.index + 1}</Label>
          <AnswerBoxText isMath={answer.isMath}>{answer.value}</AnswerBoxText>
        </Answer>
      ))}

      {altAnswers.map((altAnswer, altIndex) => (
        <div key={altIndex}>
          <Title>{`Alternate answers ${altIndex + 1}`}</Title>
          {altAnswer.map((answer, index) => (
            <Answer key={index}>
              <Label>{answer.index + 1}</Label>
              <AnswerBoxText isMath={answer.isMath}>{answer.value}</AnswerBoxText>
            </Answer>
          ))}
        </div>
      ))}
    </Wrapper>
  );
};

AnswerBox.propTypes = {
  mathAnswers: PropTypes.array.isRequired,
  altMathAnswers: PropTypes.array.isRequired,
  dropdownAnswers: PropTypes.array.isRequired,
  altDropDowns: PropTypes.array.isRequired,
  textInputAnswers: PropTypes.array.isRequired,
  altInputs: PropTypes.array.isRequired,
  responseIndexes: PropTypes.object
};

AnswerBox.defaultProps = {
  responseIndexes: {
    dropDown: [],
    inputs: [],
    math: []
  }
};

export default AnswerBox;

const Wrapper = styled.div`
  background: #eeeeef;
  border-radius: 10px;
  padding: 8px 24px 24px;
  margin-top: 16px;

  .ant-tabs-bar {
    border-bottom: 1px solid #ccc;
  }
`;

const Title = styled.div`
  text-transform: uppercase;
  font-size: 16px;
  margin-bottom: 10px;
  margin-top: 16px;
`;

const Answer = styled.div`
  display: inline-flex;
  margin-right: 15px;
`;

const Label = styled.div`
  width: 40px;
  color: ${white};
  background: ${blue};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  padding: 5px 0;
`;
