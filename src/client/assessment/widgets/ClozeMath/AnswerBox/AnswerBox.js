import React from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";
import styled from "styled-components";
import { white, blue } from "@edulastic/colors";
import AnswerBoxText from "./AnswerBoxText";

const { TabPane } = Tabs;
const AnswerBox = ({ mathAnswers, dropdownAnswers, textInputAnswers }) => (
  <Wrapper>
    <Title>Correct answers</Title>
    <Tabs type="card">
      <TabPane tab="Math Expression" key="1">
        {mathAnswers.map((answer, index) => (
          <Answer key={index}>
            <Label>{index + 1}</Label>
            <AnswerBoxText>{answer}</AnswerBoxText>
          </Answer>
        ))}
      </TabPane>
      <TabPane tab="Text Dropdowns" key="2">
        {dropdownAnswers.map((answer, index) => (
          <Answer key={index}>
            <Label>{index + 1}</Label>
            <AnswerBoxText>{answer}</AnswerBoxText>
          </Answer>
        ))}
      </TabPane>
      <TabPane tab="Text Input" key="3">
        {textInputAnswers.map((answer, index) => (
          <Answer key={index}>
            <Label>{index + 1}</Label>
            <AnswerBoxText>{answer}</AnswerBoxText>
          </Answer>
        ))}
      </TabPane>
    </Tabs>
  </Wrapper>
);

AnswerBox.propTypes = {
  mathAnswers: PropTypes.array.isRequired,
  dropdownAnswers: PropTypes.array.isRequired,
  textInputAnswers: PropTypes.array.isRequired
};

export default AnswerBox;

const Wrapper = styled.div`
  background: #eeeeef;
  border-radius: 10px;
  padding: 24px;
  margin-top: 16px;

  .ant-tabs-bar {
    border-bottom: 1px solid #ccc;
  }
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
