/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export default class DisneyCard extends Component {

  render() {
    let {testActivity, assignmentId, classId} = this.props;
    let styledCard = [];
    if(testActivity.length > 0){
      console.log("TestActivity",this.props.testActivity)
      testActivity.map(student => {
        const studentData = (
          <StyledCard bordered={false}>
            <PaginationInfoF>
              <div>
                <CircularDiv>DI</CircularDiv>
                <Space />
                <SpaceDiv />
                <StyledDiv>
                  <StyledParaF>{student.studentId}</StyledParaF>
                  {student.present ? <StyledParaS>GRADED</StyledParaS> : <StyledColorParaS>ABSENT</StyledColorParaS>}
                </StyledDiv>
              </div>
              <SquareDiv/>
            </PaginationInfoF>
            <PaginationInfoS>
              <StyledDiv>
                <StyledParaFF>Performance</StyledParaFF>
              </StyledDiv>
              <PerfomanceSection>
                <StyledParaSS><ColorSpan>{student.score}</ColorSpan> / {student.maxScore}</StyledParaSS>
                <StyledParaSSS>100%</StyledParaSSS>
              </PerfomanceSection>
            </PaginationInfoS>
            <PaginationInfoT>
              <StyledDiv>
                <StyledParaFF>Question Responses</StyledParaFF>
                {student.testItems.map(testItem => {
                  if(testItem.correct){
                    return (<SquareColorDivGreen/> );
                  }else if(testItem.skipped){
                    return (<SquareColorDivGray/>);
                  }else if(testItem.partialCorrect){
                    return (<SquareColorDivYellow/>);
                  }else if(!testItem.correct){
                    return (<SquareColorDivPink/>);
                  }
                })
                }
              </StyledDiv>
            </PaginationInfoT>
            <StyledDivLine />
            <PagInfo>
              <Link to={`/author/classresponses/${assignmentId}/${classId}`}>VIEW RESPONSES <GSpan>&gt;&gt;</GSpan></Link>
            </PagInfo>
          </StyledCard>
        );
        styledCard.push(studentData);
      });
    }

    return (
      <MainDiv>
        {styledCard}
      </MainDiv>
    );
  }
}

const MainDiv = styled.div`
  margin-left:10px;

`;
const PerfomanceSection = styled.div`
display: flex;
justify-content: space-between;
max-width: 185px;

`;
const StyledCard = styled(Card)`
  margin:auto;
  width:22%;
  border-radius:10px;
  box-shadow:3px 2px 7px lightgray;
  display:inline-block;
  margin:0px 0px 32px 32px;
`;
const Space = styled.div`
  display:inline-block;
  height:30px;
`;
const PagInfo = styled.span`
  font-weight: bold;
  font-size: 10px;
  display:block;
  color:#1890ffd9;
  text-align:center;
  padding-top:20px;
`;
const GSpan = styled.span`
  font-size: 10px;
`;
const PaginationInfoF = styled.span`
  display:inline-block;
  margin-left:-5px;
  width:105%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
//   background:red;
`;
const PaginationInfoS = styled.span`
  display:inline-block;
  margin-left:-5px;
  margin-top:25px;
  width:100%;
//   background:red;
  `;
const PaginationInfoT = styled.span`
  display:inline-block;
  margin-left:-5px;
  margin-top:25px;
  width:100%;
//   background:red;
  `;

const CircularDiv = styled.div`
  width: 47px;
  height: 47px;
  border: 2px solid #5cb497;
  display: inline-block;
  border-radius: 128px;
  text-align: center;
  padding-top: 14px;
  color: #5cb497;
  padding-bottom: 28px;
  font-weight: bold;
`;
const StyledDiv = styled.div`
  display:inline-block;
`;

const SquareDiv = styled.div`
  display:inline-block;
  width:20px;
  height:20px;
  border-radius:3px;
  border:1px solid lightgray;
`;
const SquareColorDivGreen = styled.div`
  display:inline-block;
  width:23px;
  height:23px;
  border-radius:3px;
  background-color:#1fe3a0;
  margin:10px 8px 0px 0px;
`;
const SquareColorDivGray = styled.div`
  display:inline-block;
  width:23px;
  height:23px;
  border-radius:3px;
  background-color:#e5e5e5;
  margin:10px 8px 0px 0px;
`;

const SquareColorDivPink = styled.div`
  display:inline-block;
  width:23px;
  height:23px;
  border-radius:3px;
  background-color:#ee1b82;
  margin:10px 8px 0px 0px;
`;
const SquareColorDivYellow = styled.div`
  display:inline-block;
  width:23px;
  height:23px;
  border-radius:3px;
  background-color: #fdcc3a;
  margin:10px 8px 0px 0px;

`;
const StyledParaF = styled.p`
font-size:1.1em;
font-weight:bold;
`;

const StyledParaS = styled.p`
font-size:0.6em;
font-weight:bold;
color:#5cb497;
`;
const StyledColorParaS = styled.p`
font-size:0.6em;
font-weight:bold;
color:#e1703e;
`;
const StyledParaFF = styled.p`
font-size:0.9em;
font-weight:bold;

`;
const ColorSpan = styled.span`
color:#5cb497;
`;

const StyledParaSS = styled.p`
font-size:1.12em;
font-weight:bold;
margin-top:5px;

`;
const StyledParaSSS = styled.p`
font-size:1.12em;
font-weight:bold;
margin-top:5px;
color:#5cb497;
    display:inline-block

`;
const SpaceDiv = styled.div`
    display:inline-block
    width:20px;
`;

const StyledDivLine = styled.div`
    width:101%;
    height:1px;
    border:1px solid lightgray;
    margin-top:20px;

`;
