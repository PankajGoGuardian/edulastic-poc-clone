/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  MainDiv,
  PerfomanceSection,
  StyledCard,
  Space,
  PagInfo,
  GSpan,
  PaginationInfoF,
  PaginationInfoS,
  PaginationInfoT,
  CircularDiv,
  StyledDiv,
  SquareDiv,
  SquareColorDivGreen,
  SquareColorDivGray,
  SquareColorDisabled,
  SquareColorDivPink,
  SquareColorDivYellow,
  StyledParaF,
  StyledParaFF,
  ColorSpan,
  StyledParaS,
  StyledParaSS,
  StyledParaSSS,
  SpaceDiv,
  StyledDivLine
} from './styled'

const roundFraction = (n) => Math.floor(n*100)/100;

export default class DisneyCard extends Component {

  render() {
    let { testActivity, assignmentId, classId } = this.props;
    let styledCard = [];
    if (testActivity.length > 0) {
      console.log("TestActivity", this.props.testActivity)
      testActivity.map((student) => {
        // eslint-disable-next-line radix
        const stu_per = roundFraction((parseInt(student.score) / parseInt(student.maxScore)) * 100);
        //TODO: use constants
        let status = 'NOT STARTED';
        if(student.status === 'notStarted'){

        } else if(student.status === 'inProgress'){
          status = 'IN PROGRESS';
        } else if(student.status === 'submitted'){
          status = 'SUBMITTED';
        }
        const studentData = (
          <StyledCard bordered={false}>
            <PaginationInfoF>
              <div>
                <CircularDiv>DI</CircularDiv>
                <Space />
                <SpaceDiv />
                <StyledDiv>
                  <StyledParaF>{student.studentName?student.studentName:"-"}</StyledParaF>
                  {student.present ? <StyledParaS>{status}</StyledParaS> : <StyledColorParaS>ABSENT</StyledColorParaS>}   
                </StyledDiv>
              </div>
              <SquareDiv />
            </PaginationInfoF>
            <PaginationInfoS>
              <StyledDiv>
                <StyledParaFF>Performance</StyledParaFF>
              </StyledDiv>
              <PerfomanceSection>
                <StyledParaSS><ColorSpan>{(student.score||student.score==0)?student.score:"-"}</ColorSpan> / {student.maxScore?student.maxScore:"-"}</StyledParaSS>
                <StyledParaSSS>{(stu_per||stu_per==0)?stu_per+"%":"-%"}</StyledParaSSS>
              </PerfomanceSection>
            </PaginationInfoS>
            <PaginationInfoT>
              <StyledDiv>
                <StyledParaFF>Question Responses</StyledParaFF>

                {student.questionActivities.map((questionAct) => {
                  if (questionAct.correct) {
                    return (<SquareColorDivGreen />);
                  } else if (questionAct.skipped) {
                    return (<SquareColorDivGray />);
                  }else if (questionAct.partialCorrect) {
                    return (<SquareColorDivYellow />);
                  } else if (questionAct.notStarted){
                    return (<SquareColorDisabled />)
                  } else if (!questionAct.correct) {

                    return (<SquareColorDivPink />);
                  }
                })
                }
              </StyledDiv>
            </PaginationInfoT>
            <StyledDivLine />
            <PagInfo>
            <GSpan>&gt;&gt;</GSpan>
              <Link to={`/author/classresponses/${student.testActivityId}`}>VIEW RESPONSES <GSpan>&gt;&gt;</GSpan></Link>
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
