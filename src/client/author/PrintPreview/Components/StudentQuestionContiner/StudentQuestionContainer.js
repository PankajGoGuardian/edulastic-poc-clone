import React, { Component } from "react";
import PropTypes from "prop-types";
// actions

// components
import StudentQuestions from "../StudentQuestions/StudentQuestions";
// styled wrappers
import {
  StyledStudentQuestion,
  StudentQuestionHeader,
  StudentInformation,
  InfoItem,
  TimeContainer,
  Color,
  TimeItem,
  ScoreContainer,
  ScoreLabel,
  TotalScore,
  FractionLine
} from "./styled";
import { UTAConstantsToLabels, gradingLabels, UTAStatusToConstants } from "../../utils/constants";
import * as moment from "moment";

class StudentQuestionContainer extends Component {
  render() {
    const { testActivity: studentItems } = this.props;
    const { classResponse, additionalData, studentResponse } = this.props;
    const testActivity = studentResponse ? studentResponse.testActivity : null;
    const questionActivities = studentResponse ? studentResponse.questionActivities : null;

    let score = 0,
      maxScore = 0;
    if (testActivity) {
      score = testActivity.score;
      maxScore = testActivity.maxScore;
    }

    let assignmentId = testActivity ? testActivity.assignmentId : "";
    let groupId = testActivity ? testActivity.groupId : "";
    const userId = testActivity ? testActivity.userId : "";
    const classname = additionalData ? additionalData.className : "";
    const testName = additionalData ? additionalData.testName : "";
    const assignedBy = additionalData ? additionalData?.assignedBy?.name : "";
    const currentStudent = studentItems.find(({ studentId }) => studentId === userId);
    const studentName = currentStudent ? currentStudent.studentName : "";
    const { assignmentIdClassId } = this.props;
    assignmentId = assignmentId || assignmentIdClassId.assignmentId;
    groupId = groupId || assignmentIdClassId.classId;

    return (
      <StyledStudentQuestion>
        <StudentQuestionHeader>
          <StudentInformation>
            <InfoItem>
              <Color>Test Name: </Color>
              {testName}
            </InfoItem>
            <InfoItem>
              <Color>Created By: </Color>
              {assignedBy}
            </InfoItem>
            <InfoItem>
              <Color>Student Name: </Color>
              {studentName}
            </InfoItem>
            <InfoItem>
              <Color>Class Name: </Color>
              {classname}
            </InfoItem>
          </StudentInformation>
          <TimeContainer>
            {testActivity.status !== UTAStatusToConstants.ABSENT && additionalData.endDate ? (
              <TimeItem>
                <Color>Due:</Color> {moment(additionalData.endDate).format("MMMM DD, YYYY | hh:mm A")}
              </TimeItem>
            ) : null}
            <TimeItem>
              <Color>Status:</Color>{" "}
              {testActivity.status === UTAStatusToConstants.ABSENT
                ? UTAConstantsToLabels[testActivity.status]
                : gradingLabels[testActivity.graded]}
            </TimeItem>
            {testActivity.status !== UTAStatusToConstants.ABSENT && testActivity.endDate ? (
              <TimeItem>
                <Color>Submitted on:</Color> {moment(testActivity.endDate).format("MMMM DD, YYYY | hh:mm A")}
              </TimeItem>
            ) : null}
          </TimeContainer>
          {testActivity.status !== UTAStatusToConstants.ABSENT ? (
            <ScoreContainer>
              <ScoreLabel>TOTAL SCORE</ScoreLabel>
              <TotalScore>{score}</TotalScore>
              <FractionLine />
              <TotalScore>{maxScore}</TotalScore>
            </ScoreContainer>
          ) : null}
        </StudentQuestionHeader>

        {!!studentResponse && testActivity.status !== UTAStatusToConstants.ABSENT && (
          <StudentQuestions
            currentStudent={currentStudent || []}
            questionActivities={studentResponse.questionActivities}
            classResponse={classResponse}
          />
        )}
      </StyledStudentQuestion>
    );
  }
}

export default StudentQuestionContainer;

/* eslint-disable react/require-default-props */
StudentQuestionContainer.propTypes = {
  classResponse: PropTypes.object,
  studentResponse: PropTypes.object,
  testActivity: PropTypes.array,
  additionalData: PropTypes.object,
  assignmentIdClassId: PropTypes.object
};
