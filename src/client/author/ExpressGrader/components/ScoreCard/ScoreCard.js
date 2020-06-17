import React, { Component } from "react";
import PropTypes from "prop-types";
import { greenThird } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
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

class ScoreCard extends Component {
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
    const { testActivity, t } = this.props;
    const questions = testActivity && testActivity.length !== 0 ? testActivity[0].questionActivities : [];

    return (
      <React.Fragment>
        <StyledFlexContainer>
          <TableTitle>Question & Standard</TableTitle>
        </StyledFlexContainer>
        <StyledFlexContainer justify="space-between" flexWrap>
          {questions.map((question, i) => (
            <StyledCard key={i}>
              <StyledDivMid>
                {`Q${i}`}
                <img src={InfoIcon} alt="help" />
              </StyledDivMid>
              <StyledDivMid>
                <StyledText color={greenThird}>
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
                  <StyledText>{student.studentName || t("common.anonymous")}</StyledText>
                </StyledDivMid>
                <StyledDivMid>
                  <ScoreTitle>score</ScoreTitle>
                  <StyledDivColor color={greenThird}>
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

export default withNamespaces("student")(ScoreCard);