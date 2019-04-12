import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { findIndex, isUndefined } from "lodash";

import {
  StyledFlexContainer,
  AllButton,
  CorrectButton,
  WrongButton,
  PartiallyCorrectButton,
  GiveOverallFeedBackButton,
  StudentButtonDiv
} from "./styled";

import ClassQuestions from "../ClassResponses/components/Container/ClassQuestions";

// actions
import { receiveStudentResponseAction } from "../src/actions/classBoard";
// selectors
import {
  getAssignmentClassIdSelector,
  getClassQuestionSelector,
  getStudentResponseSelector
} from "../ClassBoard/ducks";

class StudentViewContainer extends Component {
  static getDerivedStateFromProps(nextProps, preState) {
    const { selectedStudent, loadStudentResponses, studentItems, assignmentIdClassId: { classId } = {} } = nextProps;
    const { selectedStudent: _selectedStudent } = preState || {};

    if (selectedStudent !== _selectedStudent) {
      let index = 0;
      if (selectedStudent) {
        index = findIndex(studentItems, student => student.studentId === selectedStudent);
      }
      const { testActivityId } = studentItems[index];
      if (!isUndefined(testActivityId) && !isUndefined(classId)) {
        loadStudentResponses({ testActivityId, groupId: classId });
      }
    }
    return {
      selectedStudent,
      loading: selectedStudent !== _selectedStudent
    };
  }

  render() {
    const { classResponse, studentItems, studentResponse, selectedStudent } = this.props;
    const { loading } = this.state;

    const userId = studentResponse.testActivity ? studentResponse.testActivity.userId : "";
    const currentStudent = studentItems.find(({ studentId }) => {
      if (selectedStudent) {
        return studentId === selectedStudent;
      }
      return studentId === userId;
    });
    return (
      <React.Fragment>
        <StyledFlexContainer justifyContent="space-between">
          <StudentButtonDiv>
            <AllButton active>ALL</AllButton>
            <CorrectButton>CORRECT</CorrectButton>
            <WrongButton>WRONG</WrongButton>
            <PartiallyCorrectButton>PARTIALLY CORRECT</PartiallyCorrectButton>
          </StudentButtonDiv>
          <GiveOverallFeedBackButton active>GIVE OVERALL FEEDBACK</GiveOverallFeedBackButton>
        </StyledFlexContainer>
        {!loading && (
          <ClassQuestions
            currentStudent={currentStudent || {}}
            questionActivities={studentResponse.questionActivities}
            classResponse={classResponse}
          />
        )}
      </React.Fragment>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      classQuestion: getClassQuestionSelector(state),
      studentResponse: getStudentResponseSelector(state),
      assignmentIdClassId: getAssignmentClassIdSelector(state)
    }),
    {
      loadStudentResponses: receiveStudentResponseAction
    }
  )
);
export default enhance(StudentViewContainer);

StudentViewContainer.propTypes = {
  classResponse: PropTypes.object.isRequired,
  studentItems: PropTypes.array.isRequired,
  studentResponse: PropTypes.object.isRequired,
  selectedStudent: PropTypes.string
};
StudentViewContainer.defaultProps = {
  selectedStudent: ""
};
