import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { findIndex, isUndefined, get, keyBy } from "lodash";
import produce, { setAutoFreeze } from "immer";
import memoizeOne from "memoize-one";
import { Modal, Button, Input, message } from "antd";

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
import {
  receiveStudentResponseAction,
  saveOverallFeedbackAction,
  updateOverallFeedbackAction
} from "../src/actions/classBoard";
// selectors
import {
  getAssignmentClassIdSelector,
  getClassQuestionSelector,
  getStudentResponseSelector,
  getDynamicVariablesSetIdForViewResponse,
  getTestItemsOrderSelector
} from "../ClassBoard/ducks";

import { getQuestionLabels } from "../ClassBoard/Transformer";
const _getquestionLabels = memoizeOne(getQuestionLabels);

setAutoFreeze(false);
/**
 *
 * @param {Object[]} testItems
 * @param {Object} variablesSetIds
 */
const transformTestItemsForAlgoVariables = (classResponse, variablesSetIds) => {
  return produce(classResponse, draft => {
    if (!draft.testItems) {
      return;
    }
    const qidSetIds = keyBy(variablesSetIds, "qid");
    for (let [idxItem, item] of draft.testItems.entries()) {
      if (!item.algoVariablesEnabled) {
        continue;
      }
      const questions = get(item, "data.questions", []);
      for (let [idxQuestion, question] of questions.entries()) {
        const qid = question.id;
        const setIds = qidSetIds[qid];
        if (!setIds) {
          continue;
        }
        const setKeyId = setIds.setId;
        const examples = get(question, "variable.examples", []);
        const variables = get(question, "variable.variables", {});
        const example = examples.find(x => x.key === setKeyId);
        if (!example) {
          continue;
        }
        for (let variable of Object.keys(variables)) {
          draft.testItems[idxItem].data.questions[idxQuestion].variable.variables[variable].exampleValue =
            example[variable];
        }
      }
    }
  });
};
class StudentViewContainer extends Component {
  state = { filter: null, showFeedbackPopup: false };
  feedbackRef = React.createRef();
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
  handleShowFeedbackPopup = value => {
    this.setState({ showFeedbackPopup: value });
  };

  handleApply = () => {
    const { saveOverallFeedback, assignmentIdClassId, studentResponse, updateOverallFeedback } = this.props;
    const studentTestActivity = studentResponse && studentResponse.testActivity;
    const testActivityId = studentTestActivity && studentTestActivity._id;
    const feedback = this.feedbackRef.current.textAreaRef.value;
    if (!feedback) return message.error("Please add your feedback before saving");
    saveOverallFeedback(testActivityId, assignmentIdClassId.classId, { text: feedback });
    updateOverallFeedback({ text: feedback });
    this.setState({ showFeedbackPopup: false });
  };

  render() {
    const {
      classResponse,
      studentItems,
      studentResponse,
      selectedStudent,
      variableSetIds,
      testActivity,
      isPresentationMode
    } = this.props;

    const { loading, filter, showFeedbackPopup } = this.state;
    const classResponseProcessed = transformTestItemsForAlgoVariables(classResponse, variableSetIds);
    const userId = studentResponse.testActivity ? studentResponse.testActivity.userId : "";
    const currentStudent = studentItems.find(({ studentId }) => {
      if (selectedStudent) {
        return studentId === selectedStudent;
      }
      return studentId === userId;
    });
    const studentTestActivity = studentResponse && studentResponse.testActivity;
    const initFeedbackValue =
      (studentTestActivity && studentTestActivity.feedback && studentTestActivity.feedback.text) || "";
    return (
      <React.Fragment>
        {showFeedbackPopup && (
          <Modal
            centered
            maskClosable={false}
            visible={showFeedbackPopup}
            title="Give Overall Feedback"
            onCancel={() => this.handleShowFeedbackPopup(false)}
            footer={[
              <Button key="back" onClick={() => this.handleShowFeedbackPopup(false)}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleApply}>
                Apply
              </Button>
            ]}
          >
            <p>Leave a feedback!</p>
            <Input.TextArea rows={6} defaultValue={initFeedbackValue} ref={this.feedbackRef} />
          </Modal>
        )}
        <StyledFlexContainer justifyContent="space-between">
          <StudentButtonDiv>
            <AllButton active={filter === null} onClick={() => this.setState({ filter: null })}>
              ALL
            </AllButton>
            <CorrectButton active={filter === "correct"} onClick={() => this.setState({ filter: "correct" })}>
              CORRECT
            </CorrectButton>
            <WrongButton active={filter === "wrong"} onClick={() => this.setState({ filter: "wrong" })}>
              WRONG
            </WrongButton>
            <PartiallyCorrectButton active={filter === "partial"} onClick={() => this.setState({ filter: "partial" })}>
              PARTIALLY CORRECT
            </PartiallyCorrectButton>
          </StudentButtonDiv>
          <GiveOverallFeedBackButton onClick={() => this.handleShowFeedbackPopup(true)} active>
            GIVE OVERALL FEEDBACK
          </GiveOverallFeedBackButton>
        </StyledFlexContainer>
        {!loading && (
          <ClassQuestions
            currentStudent={currentStudent || {}}
            questionActivities={studentResponse.questionActivities}
            classResponse={classResponseProcessed}
            testItemsOrder={this.props.testItemsOrder}
            studentViewFilter={filter}
            labels={_getquestionLabels(classResponse.testItems, this.props.testItemIds)}
            isPresentationMode={isPresentationMode}
          />
        )}
      </React.Fragment>
    );
  }
}

const enhance = compose(
  connect(
    (state, ownProps) => ({
      classQuestion: getClassQuestionSelector(state),
      studentResponse: getStudentResponseSelector(state),
      assignmentIdClassId: getAssignmentClassIdSelector(state),
      testItemsOrder: getTestItemsOrderSelector(state),
      variableSetIds: getDynamicVariablesSetIdForViewResponse(state, ownProps.selectedStudent),
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false),
      testItemIds: get(state, "author_classboard_testActivity.data.test.testItems", [])
    }),
    {
      loadStudentResponses: receiveStudentResponseAction,
      saveOverallFeedback: saveOverallFeedbackAction,
      updateOverallFeedback: updateOverallFeedbackAction
    }
  )
);
export default enhance(StudentViewContainer);

StudentViewContainer.propTypes = {
  classResponse: PropTypes.object.isRequired,
  studentItems: PropTypes.array.isRequired,
  studentResponse: PropTypes.object.isRequired,
  selectedStudent: PropTypes.string,
  isPresentationMode: PropTypes.bool
};
StudentViewContainer.defaultProps = {
  selectedStudent: "",
  isPresentationMode: false
};
