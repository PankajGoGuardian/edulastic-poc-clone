import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { white, blue } from "@edulastic/colors";
import AnswerBoxText from "./AnswerBoxText";

const AnswerBox = ({ answers }) => (
  <Wrapper>
    <Title>Correct answer</Title>
    {answers.map((answer, index) => (
      <Answer key={index}>
        <Label>{index + 1}</Label>
        <AnswerBoxText>{answer}</AnswerBoxText>
      </Answer>
    ))}
  </Wrapper>
);

AnswerBox.propTypes = {
  answers: PropTypes.array.isRequired
};

export default AnswerBox;

const Wrapper = styled.div`
  background: #eeeeef;
  border-radius: 10px;
  padding: 25px;
`;

const Title = styled.div`
  text-transform: uppercase;
  font-size: 16px;
  margin-bottom: 10px;
`;

const Answer = styled.div`
  display: inline-flex;
  margin-right: 15px;

  :last-child {
    margin-right: 0;
  }
`;

const Label = styled.div`
  width: 30px;
  color: ${white};
  background: ${blue};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  padding: 10px;
`;
