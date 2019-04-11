/* eslint-disable react/require-default-props */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { receiveStudentQuestionAction } from "../../../src/actions/classBoard";
import {
  getAssignmentClassIdSelector,
  getStudentQuestionSelector,
  getTestItemsDataSelector
} from "../../../ClassBoard/ducks";
import ClassQuestions from "../../../ClassResponses/components/Container/ClassQuestions";

class Question extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const {
      record,
      loadStudentQuestionResponses,
      assignmentClassId: { assignmentId, classId }
    } = this.props;
    const { testActivityId, studentId, _id } = record;
    if (testActivityId) {
      loadStudentQuestionResponses(assignmentId, classId, _id, studentId);
    }
  }

  render() {
    const { record, studentQuestion, testItems = [] } = this.props;
    const currentStudent = {
      studentName: ""
    };
    const selectedItems = testItems.filter(
      ({ data: { questions = [] } = {} }) => questions.filter(({ id }) => id === record._id).length > 0
    );

    if (isEmpty(studentQuestion)) {
      return null;
    }

    return (
      <ClassQuestions
        currentStudent={currentStudent}
        questionActivities={studentQuestion ? [studentQuestion] : []}
        classResponse={{ testItems: selectedItems }}
      />
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      testItems: getTestItemsDataSelector(state),
      assignmentClassId: getAssignmentClassIdSelector(state),
      studentQuestion: getStudentQuestionSelector(state)
    }),
    {
      loadStudentQuestionResponses: receiveStudentQuestionAction
    }
  )
);

Question.propTypes = {
  record: PropTypes.object.isRequired,
  testItems: PropTypes.array.isRequired,
  loadStudentQuestionResponses: PropTypes.func.isRequired,
  assignmentClassId: PropTypes.object,
  studentQuestion: PropTypes.object
};

export default enhance(Question);
