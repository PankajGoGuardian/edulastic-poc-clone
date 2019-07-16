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
import { AnswerContext } from "@edulastic/common";

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
    const { testActivityId, studentId, _id, weight, testItemId } = record;
    if (testActivityId) {
      loadStudentQuestionResponses(assignmentId, classId, _id, studentId, weight > 1 ? testItemId : undefined);
    }
  }

  render() {
    const { record, studentQuestion, testItems = [], qIndex, student, isPresentationMode } = this.props;

    const selectedItems = testItems.filter(
      ({ data: { questions = [] } = {} }) => questions.filter(({ id }) => id === record._id).length > 0
    );

    if (isEmpty(studentQuestion)) {
      return null;
    }

    let studentQuestions = [];
    if (studentQuestion) {
      if (Array.isArray(studentQuestion)) {
        studentQuestions = studentQuestion;
      } else {
        studentQuestions = [studentQuestion];
      }
    }

    return (
      <AnswerContext.Provider value={{ isAnswerModifiable: this.props.editResponse }}>
        <ClassQuestions
          currentStudent={student}
          questionActivities={studentQuestions}
          classResponse={{ testItems: selectedItems }}
          qIndex={qIndex}
          isPresentationMode={isPresentationMode}
        />
      </AnswerContext.Provider>
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
  studentQuestion: PropTypes.object,
  qIndex: PropTypes.number,
  student: PropTypes.object.isRequired,
  isPresentationMode: PropTypes.bool
};

Question.defaultProps = {
  isPresentationMode: false
};

export default enhance(Question);
