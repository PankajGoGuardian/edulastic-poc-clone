/* eslint-disable array-callback-return */
import React from "react";
import PropTypes from "prop-types";
import { find, isEmpty } from "lodash";
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

  const maxAltLen = Math.max(altMathAnswers.length, altDropDowns.length, altInputs.length);
  const altAnswers = new Array(maxAltLen).fill(true).map((_, altIndex) => {
    const _altAnswers = [];

    if (altMathAnswers[altIndex]) {
      altMathAnswers[altIndex].map(answer => {
        const { index } = find(maths, d => d.id === answer[0].id) || { index: 0 };
        if (answer[0].value) {
          return _altAnswers.push({
            index,
            value: answer[0].value,
            isMath: true
          });
        }
      });
    }
    if (altDropDowns[altIndex]) {
      altDropDowns[altIndex].map(answer => {
        const { index } = find(dropDowns, d => d.id === answer.id) || { index: 0 };
        if (answer.value) {
          return _altAnswers.push({
            index,
            value: answer.value,
            isMath: false
          });
        }
      });
    }

    if (altInputs[altIndex]) {
      altInputs[altIndex].map(answer => {
        const { index } = find(inputs, d => d.id === answer.id) || { index: 0 };
        if (answer.value) {
          return _altAnswers.push({
            index,
            value: answer.value,
            isMath: false
          });
        }
      });
    }

    return _altAnswers.sort((a, b) => a.index - b.index);
  });
  const alternateAnswers = {};
  altAnswers.forEach(altAnswer => {
    altAnswer.forEach(alt => {
      alternateAnswers[alt.index + 1] = alternateAnswers[alt.index + 1] || [];
      if (alt.value) {
        alternateAnswers[alt.index + 1].push({ value: alt.value, isMath: alt.isMath });
      }
    });
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
      {!isEmpty(alternateAnswers) && (
        <div>
          <Title>Alternate answers</Title>
          {Object.keys(alternateAnswers).map(key => (
            <Answer key={key}>
              <Label>{key}</Label>
              <AnswerBoxText isMath={alternateAnswers[key][0].isMath}>
                {alternateAnswers[key]
                  .reduce((acc, alternateAnswer) => {
                    acc.push(alternateAnswer.value);
                    return acc;
                  }, [])
                  .join()}
              </AnswerBoxText>
            </Answer>
          ))}
        </div>
      )}
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
