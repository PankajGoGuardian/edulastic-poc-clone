/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { Card, Button } from 'antd';
import styled from 'styled-components';
import Clock from '../../assets/assignments/clock-circular-outline.svg';
import Eye from '../../assets/assignments/view.svg';


export default class AnswerCard extends Component {
  render() {
    return (
      <MainDiv>
        <StyledCardOne bordered={false}>
          <StyledDiv>
            <StyledDivOne>
              <img src={Clock} />
              <StyledPara> 9 Seconds</StyledPara>
            </StyledDivOne>
            <StyledDivTwo>
              <StyledButton><StyledImg src={Eye} /> SHOW STUDENT ANSWER</StyledButton>
            </StyledDivTwo>
          </StyledDiv>
          <StyledTextDiv>
            <StyledQue>
              <b>Q1</b> Lorem ipsum dolor sit amet?
            </StyledQue>
            <StyledAnswerOne>
              <CircularDiv>A</CircularDiv>
              Lorem ipsum
            </StyledAnswerOne>
            <StyledAnswerOne>
              <CircularDiv>B</CircularDiv>
              Lorem ipsum
            </StyledAnswerOne>
            <StyledAnswerOne>
              <CircularDiv>C</CircularDiv>
              Lorem ipsum
            </StyledAnswerOne>
            <StyledAnswerOneA>
              <CircularDiv>D</CircularDiv>
              Lorem ipsum
            </StyledAnswerOneA>
          </StyledTextDiv>
        </StyledCardOne>

        <StyledCardTwo bordered={false}>
          <StyledDivSec>
            <StyledBlankDiv /><TextPara> / 1</TextPara>
          </StyledDivSec>
          <LeaveDiv>
            Leave a Feedback!
          </LeaveDiv>
          <StyledBlankDivsec />
          <StyledButtonA>VIEW SOLUTION</StyledButtonA>
        </StyledCardTwo>
      </MainDiv>
    );
  }
}

const MainDiv = styled.div`
  margin:0px;
  display:flex;
  width:97.5%;
`;
const LeaveDiv = styled.div`
  margin:30px 0px 20px 0px;
  font-weight:bold;
  color:#545b6b;
  font-size:0.9em;
`;
const StyledButtonA = styled(Button)`
  font-size:1em;
  margin:10px 0px;
  width:100%;
  padding:13px 5px 20px;
  color:white;
  height:45px;
  background-color:#00b0ff;
  font-weight:bold;
`;
const StyledBlankDiv = styled.div`
  width:130px;
  height:40px;
  border:1px solid #eaeaea;
  border-radius:5px;
  display:inline-block;
`;
const StyledBlankDivsec = styled.div`
  width:100%;
  height:320px;
  border:1px solid #eaeaea;
  border-radius:5px;
  display:inline-block;
`;
const TextPara = styled.p`
  font-size:1.8em;
  font-weight:bold;
  margin-left:10px;
  display:inline-block;
`;
const StyledDivSec = styled.div`
  
  height:50px;
  border-bottom:1.4px solid #f7f7f7;
  margin:auto;
  display: flex;
  justify-content: center;
  `;
const StyledTextDiv = styled.div`
  width:46%;
  padding-left:20px;  
  height:350px;
`;

const CircularDiv = styled.div`
  width: 37px;
  height: 37px;
  border: 2px solid #1fe3a0;
  display: inline-block;
  border-radius: 228px;
  text-align: center;
  margin-right:20px;
  font-weight: bold;
  font-size:1.2em;
`;
const StyledQue = styled.p`
  font-size:1.2em;
  padding:40px 20px 20px 20px;
`;
const StyledAnswerOne = styled.p`
  font-size:1.2em;
  padding:20px 20px;
  font-weight:600;

`;
const StyledAnswerOneA = styled.p`
  font-size:1.2em;
  padding:20px 20px;  
  font-weight:600;
  background:#e1fbf2;
  border-left:3px solid #1fe3a0;
  height:65px;
`;


const StyledCardOne = styled(Card)`
  margin:auto;
  border-radius:10px;
  box-shadow:3px 2px 7px lightgray;
  display:inline-block;
  margin:0px 0px 32px 32px;
  width:73%;
  padding-bottom:100px;
`;
const StyledCardTwo = styled(Card)`
  margin:auto;
  width:22%;
  border-radius:10px;
  box-shadow:3px 2px 7px lightgray;
  display:inline-block;
  margin:0px 0px 32px 32px;
  width:27%;

`;
const StyledDiv = styled.div`
  width:100%;
  display:flex;
  height:50px;
  justify-Content:space-between;
  border-bottom:1.4px solid #f7f7f7;
  `;
const StyledDivOne = styled.div`
  display:inline-block;
`;
const StyledDivTwo = styled.div`
  display:inline-block;
 
`;
const StyledImg = styled.img`
  margin-right:15px;
`;
const StyledPara = styled.p`
  display:inline-block;
  color:#a19c9c;
  font-weight:bold;
  margin-left:15px;
`;
const StyledButton = styled(Button)`
  font-size:0.64em;
  background-color:transparent;
  margin:0px 23px 0px -5px;
  width:170px;
  padding:2px 10px;
  height:25px;
  color:#00b0ff;
  border:1px solid #00b0ff;
  font-weight:bold;
`;
