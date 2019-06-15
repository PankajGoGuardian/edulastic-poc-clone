import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
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
  responseIds
}) => {
  const { inputs, maths, dropDowns } = responseIds;
  let validAnswers = [];

  mathAnswers.map(answer => {
    const { index } = find(maths, d => d.id === answer[0].id) || { index: 0 };
    return validAnswers.push({
      index,
      value: answer[0].value,
      isMath: true
    });
  });

  dropdownAnswers.map(answer => {
    const { index } = find(dropDowns, d => d.id === answer.id) || { index: 0 };
    return validAnswers.push({
      index,
      value: answer.value,
      isMath: false
    });
  });

  textInputAnswers.map(answer => {
    const { index } = find(inputs, d => d.id === answer.id) || { index: 0 };
    return validAnswers.push({
      index,
      value: answer.value,
      isMath: false
    });
  });
  validAnswers = validAnswers.sort((a, b) => a.index - b.index);

  const altAnswers = altMathAnswers.map((alt, altIndex) => {
    const _altAnswers = [];

    alt.map(answer => {
      const { index } = find(maths, d => d.id === answer[0].id) || { index: 0 };
      return _altAnswers.push({
        index,
        value: answer[0].value,
        isMath: true
      });
    });

    altDropDowns[altIndex].map(answer => {
      const { index } = find(dropDowns, d => d.id === answer.id) || { index: 0 };
      return _altAnswers.push({
        index,
        value: answer.value,
        isMath: false
      });
    });

    altInputs[altIndex].map(answer => {
      const { index } = find(inputs, d => d.id === answer.id) || { index: 0 };
      return _altAnswers.push({
        index,
        value: answer.value,
        isMath: false
      });
    });

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
  responseIds: PropTypes.object
};

AnswerBox.defaultProps = {
  responseIds: {
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
