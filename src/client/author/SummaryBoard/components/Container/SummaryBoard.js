import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { IconCircleCheck, IconArrowCircleUp } from "@edulastic/icons";
// ducks
import {
  getTestActivitySelector,
  getAdditionalDataSelector,
  getTestQuestionActivitiesSelector
} from "../../../ClassBoard/ducks";

// actions
import { receiveTestActivitydAction } from "../../../src/actions/classBoard";
// components
import ClassHeader from "../../../Shared/Components/ClassHeader/ClassHeader";
import HooksContainer from "../HooksContainer/HooksContainer";
// icon images
import NightIcon from "../../assets/night.svg";
import MistakesMarkIcon from "../../assets/mistakes-mark.svg";
import ArrowDownIcon from "../../assets/arrow-down.svg";
import GraduateStudentIcon from "../../assets/graduate-student-avatar.svg";
// styled wrappers
import {
  Anchor,
  AnchorLink,
  StyledCard,
  PaginationInfo,
  StyledFlexContainer,
  SummaryInfoWrapper,
  InfoRow,
  SubInfoRow,
  InfoLabel,
  InfoValue,
  ValueTitle,
  LowestPerformersWrapper,
  StyledSummaryCard,
  ActionContainer,
  ActionDescriptionWrapper,
  ActionTitle,
  ActionDescription,
  ViewRecommendationsBtn,
  ListContainer,
  ListItem,
  ListItemTitle,
  ListItemValue,
  MistakesListItem,
  MistakesTitle,
  MistakesValue
} from "./styled";

class SummaryBoard extends Component {
  componentDidMount() {
    const { loadTestActivity, match } = this.props;
    const { assignmentId, classId } = match.params;
    loadTestActivity(assignmentId, classId);
  }

  getTestActivity = data => {
    let id = null;
    data.forEach(item => {
      if (item.testActivityId) {
        id = item.testActivityId;
      }
    });
    return id;
  };

  getAverageScore = students => {
    if (!students.length) {
      return 0;
    }
    const totalScore = students.reduce((_totalScore, student) => _totalScore + student.scorePercent, 0);
    const avgScore = totalScore / students.length;
    return Math.round(avgScore * 100) / 100;
  };

  getAverageTimeSpent = () => {
    const { testActivity } = this.props;
    if (!testActivity.length) {
      return 0;
    }
    const totalSpentTime = testActivity.reduce((_totalSpent, student) => {
      const { questionActivities } = student;
      if (!questionActivities.length) {
        return _totalSpent;
      }
      const spentTime = questionActivities.reduce((spent, question) => spent + parseFloat(question.timespent) || 0, 0);
      return _totalSpent + spentTime;
    }, 0);
    return totalSpentTime / testActivity.length;
  };

  getMostCommonMistakes = () => {
    const { testQuestionActivities } = this.props;

    const uniqueTestQuestionActivities = [
      ...new Set(testQuestionActivities.map(testQuestionActivity => testQuestionActivity.qid))
    ];

    const hasWrongAnswersItems = uniqueTestQuestionActivities.map(qid => {
      const testActivities = testQuestionActivities.filter(
        testQuestionActivity => testQuestionActivity.qid === qid && !testQuestionActivity.skipped
      );

      const wrongAnswers = testActivities.filter(testQuestionActivity => !testQuestionActivity.correct);

      return {
        qid,
        wrong: wrongAnswers.length,
        attempted: testActivities.length
      };
    });

    hasWrongAnswersItems.sort((a, b) => b.wrong - a.wrong);
    return hasWrongAnswersItems.slice(0, 2);
  };

  getLowestPerformers = () => {
    const { testActivity: studentItems } = this.props;
    const submittedStudents = studentItems.filter(student => student.status === "submitted");

    submittedStudents.map(student => {
      const { questionActivities } = student;
      let totalScore = 0;
      questionActivities.forEach(question => {
        const score = parseFloat(question.score) || 0;
        totalScore += score;
      });

      let totalMaxScore = 0;
      questionActivities.forEach(question => {
        const maxScore = parseFloat(question.maxScore) || 0;
        totalMaxScore += maxScore;
      });
      student.scorePercent = (totalScore / totalMaxScore) * 100;

      return student;
    });

    submittedStudents.sort((a, b) => a.score - b.score);
    return submittedStudents;
  };

  getSubmmitedStudents = () => {
    const { testActivity: student } = this.props;
    const submitted = student.filter(st => st.status === "submitted");
    return `${submitted.length} / ${student.length}`;
  };

  render() {
    const { testActivity, creating, match, additionalData = { classes: [] } } = this.props;
    const { assignmentId, classId } = match.params;
    const testActivityId = this.getTestActivity(testActivity);
    const commonMistakes = this.getMostCommonMistakes();
    const lowestPerformers = this.getLowestPerformers();

    return (
      <div>
        <HooksContainer classId={classId} assignmentId={assignmentId} />

        <ClassHeader
          classId={classId}
          active="summary"
          creating={creating}
          onCreate={this.handleCreate}
          assignmentId={assignmentId}
          additionalData={additionalData}
          testActivityId={testActivityId}
        />

        <StyledFlexContainer justifyContent="space-between">
          <PaginationInfo>
            &lt; <AnchorLink to="/author/assignments">RECENTS ASSIGNMENTS</AnchorLink> /{" "}
            <Anchor>{additionalData.testName}</Anchor> / <Anchor>{additionalData.className}</Anchor>
          </PaginationInfo>
        </StyledFlexContainer>

        <StyledFlexContainer>
          <SummaryInfoWrapper>
            <InfoRow>
              <StyledSummaryCard>
                <SubInfoRow>
                  <InfoLabel>Completed</InfoLabel>
                  <IconCircleCheck />
                </SubInfoRow>
                <SubInfoRow>
                  <ValueTitle>Students</ValueTitle>
                  <InfoValue>{this.getSubmmitedStudents()}</InfoValue>
                </SubInfoRow>
              </StyledSummaryCard>
              <StyledSummaryCard>
                <SubInfoRow>
                  <InfoLabel>Average score</InfoLabel>
                  <IconArrowCircleUp />
                </SubInfoRow>
                <SubInfoRow>
                  <ValueTitle>Percent</ValueTitle>
                  <InfoValue>{this.getAverageScore(lowestPerformers)}</InfoValue>
                </SubInfoRow>
              </StyledSummaryCard>
            </InfoRow>
            <InfoRow>
              <StyledSummaryCard>
                <SubInfoRow>
                  <InfoLabel>Time Spent (Hr:Min)</InfoLabel>
                  <img src={NightIcon} alt="Time Spent" />
                </SubInfoRow>
                <SubInfoRow>
                  <ValueTitle>Average</ValueTitle>
                  <InfoValue>{this.getAverageTimeSpent()}</InfoValue>
                </SubInfoRow>
              </StyledSummaryCard>
              <StyledSummaryCard>
                <SubInfoRow>
                  <InfoLabel>Most Common Mistakes</InfoLabel>
                  <img src={MistakesMarkIcon} alt="Mistakes" />
                </SubInfoRow>
                <ListContainer>
                  {commonMistakes.map((cm, index) => (
                    <MistakesListItem key={index}>
                      <MistakesTitle>{`Q${index + 1} (N-RN.${index + 1})`}</MistakesTitle>
                      <MistakesValue>
                        {cm.wrong}
                        <img src={GraduateStudentIcon} alt="Student" />
                      </MistakesValue>
                    </MistakesListItem>
                  ))}
                </ListContainer>
              </StyledSummaryCard>
            </InfoRow>
          </SummaryInfoWrapper>
          <LowestPerformersWrapper>
            <StyledCard>
              <SubInfoRow>
                <InfoLabel>Lowest Performers</InfoLabel>
                <img src={ArrowDownIcon} alt="Lowest Performers" />
              </SubInfoRow>
              <ListContainer>
                {lowestPerformers.slice(0, 5).map((lp, index) => (
                  <ListItem key={index}>
                    <ListItemTitle>{lp.studentName}</ListItemTitle>
                    <ListItemValue>{Math.round(lp.scorePercent * 100) / 100}%</ListItemValue>
                  </ListItem>
                ))}
              </ListContainer>
            </StyledCard>
          </LowestPerformersWrapper>
        </StyledFlexContainer>

        <StyledFlexContainer>
          <StyledCard>
            <ActionContainer>
              <ActionDescriptionWrapper>
                <ActionTitle>Differentiation</ActionTitle>
                <ActionDescription>
                  {"Recommendations for each student"}
                  {" are based on their performance on this assessment."}
                </ActionDescription>
              </ActionDescriptionWrapper>
              <ViewRecommendationsBtn>VIEW RECOMMENDATIONS</ViewRecommendationsBtn>
            </ActionContainer>
          </StyledCard>
        </StyledFlexContainer>
      </div>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  withNamespaces("summary"),
  connect(
    state => ({
      testActivity: getTestActivitySelector(state),
      additionalData: getAdditionalDataSelector(state),
      testQuestionActivities: getTestQuestionActivitiesSelector(state)
    }),
    {
      loadTestActivity: receiveTestActivitydAction
    }
  )
);

export default enhance(SummaryBoard);

/* eslint-disable react/require-default-props */
SummaryBoard.propTypes = {
  additionalData: PropTypes.object,
  match: PropTypes.object,
  loadTestActivity: PropTypes.func,
  creating: PropTypes.object,
  testActivity: PropTypes.array,
  testQuestionActivities: PropTypes.array
};
