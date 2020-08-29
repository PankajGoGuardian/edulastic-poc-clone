/* eslint-disable react/require-default-props */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import { isEqual } from "lodash";
import { AnswerContext } from "@edulastic/common";
import { receiveStudentQuestionAction } from "../../../src/actions/classBoard";
import {
  getAssignmentClassIdSelector,
  getStudentQuestionSelector,
  getTestItemsDataSelector
} from "../../../ClassBoard/ducks";
import ClassQuestions from "../../../ClassResponses/components/Container/ClassQuestions";
import { getTeacherEditedScoreSelector } from "../../ducks";

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

  componentDidUpdate(prevProps) {
    const {studentQuestionResponseTestActivityId,record,studentResponseLoading} = this.props;
    const {prevStudentQuestionResponseTestActivityId,prevRecord} = prevProps;
    // inidcating inconsitent state , due to rapid switching of students. 
    // in that case , need to load the correct student response
    const forceLoad =  prevStudentQuestionResponseTestActivityId && (prevRecord?.testActivityId == prevStudentQuestionResponseTestActivityId && studentQuestionResponseTestActivityId != record?.testActivityId );
    
    if (((!isEqual(prevProps.teacherEditedScore, this.props.teacherEditedScore))||forceLoad) && (!studentResponseLoading)) {
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
  }

  render() {
    const { record, studentQuestion, testItems = [], qIndex, student, isPresentationMode } = this.props;

    let selectedItems = testItems.filter(
      ({ data: { questions = [] } = {} }) => questions.filter(({ id }) => id === record._id).length > 0
    );

    selectedItems = produce(selectedItems, draft => {
      draft?.forEach(item => {
        if (item.itemLevelScoring) return;
        item.data.questions = item.data.questions.filter(({ id }) => id === record._id);
        item.rows = item.rows.map(row => ({
          ...row,
          widgets: row.widgets.filter(
            ({ reference, widgetType }) => reference === record._id || widgetType === "resource"
          )
        }));
      });
      return draft;
    });
    let studentQuestions = [];
    if (studentQuestion) {
      if (Array.isArray(studentQuestion)) {
        studentQuestions = studentQuestion;
      } else {
        studentQuestions = [studentQuestion];
      }
      /**
       * when studentQuestions is empty, meaning,
       * question activities not created,
       * then use the computed questionActivities
       */
      if (studentQuestions.length === 0) {
        studentQuestions = [record];
      }
    }

    return (
      <AnswerContext.Provider
        value={{
          isAnswerModifiable: this.props.editResponse,
          expressGrader: true,
          studentResponseLoading: this.props.studentResponseLoading
        }}
      >
        <ClassQuestions
          currentStudent={student}
          questionActivities={studentQuestions}
          classResponse={{ testItems: selectedItems }}
          qIndex={qIndex}
          isPresentationMode={isPresentationMode}
          testActivityId={record.testActivityId}
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
      studentQuestion: getStudentQuestionSelector(state),
      teacherEditedScore: getTeacherEditedScoreSelector(state),
      studentResponseLoading: state.studentQuestionResponse?.loading,
      studentQuestionResponseTestActivityId: state.studentQuestionResponse?.data?.testActivityId
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
