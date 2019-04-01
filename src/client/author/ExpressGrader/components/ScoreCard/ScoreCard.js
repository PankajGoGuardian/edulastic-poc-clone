import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyledFlexContainer,
  StyledCard,
  StyledDivMid,
  StyledText,
  TableTitle,
  StudentsCard,
  StudentsCardRow,
  StudentsTitle,
  ScoreTitle,
  StyledDivColor
} from "./styled";
import Questions from "./Questions";
import InfoIcon from "../../Assets/info.svg";

export default class ScoreCard extends Component {
  static propTypes = {
    testActivity: PropTypes.object
  };

  static defaultProps = {
    testActivity: {}
  };

  getCorrectAnswers = question => {
    let correctAnswers = 0;
    const { testActivity: students } = this.props;

    students.forEach(student => {
      const isCorrect = student.questionActivities.find(qa => qa._id === question._id).correct;
      if (isCorrect) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  render() {
    const { testActivity } = this.props;
    const questions = testActivity && testActivity.length !== 0 ? testActivity[0].questionActivities : [];

    return (
      <React.Fragment>
        <StyledFlexContainer>
          <TableTitle>Questions & Standards</TableTitle>
        </StyledFlexContainer>
        <StyledFlexContainer flexWrap>
          {questions.map((question, i) => (
            <StyledCard key={i}>
              <StyledDivMid>
                {`Q${i}`}
                <img src={InfoIcon} alt="help" />
              </StyledDivMid>
              <StyledDivMid>
                <StyledText color="#5EB500">
                  {`${Math.round((this.getCorrectAnswers(question) / questions.length) * 100)}%`}
                </StyledText>
                <StyledText>
                  ({this.getCorrectAnswers(question)} / {questions.length})
                </StyledText>
              </StyledDivMid>
            </StyledCard>
          ))}
        </StyledFlexContainer>
        <StyledFlexContainer>
          {testActivity.map((student, index) => (
            <StudentsCard key={index}>
              <StudentsCardRow>
                <StyledDivMid>
                  <StudentsTitle>students</StudentsTitle>
                  <StyledText>{student.studentName}</StyledText>
                </StyledDivMid>
                <StyledDivMid>
                  <ScoreTitle>score</ScoreTitle>
                  <StyledDivColor color="#5EB500">
                    {student.maxScore === 0 ? "-" : `${((100 * student.score) / student.maxScore).toFixed(0)}%`}
                  </StyledDivColor>
                  <StyledDivColor>
                    ({student.score} / {student.maxScore})
                  </StyledDivColor>
                </StyledDivMid>
              </StudentsCardRow>
              <Questions student={student} />
            </StudentsCard>
          ))}
        </StyledFlexContainer>
      </React.Fragment>
    );
  }
}
