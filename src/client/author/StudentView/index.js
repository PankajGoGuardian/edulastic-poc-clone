import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { findIndex, isUndefined, get, keyBy } from "lodash";
import produce, { setAutoFreeze } from "immer";
import memoizeOne from "memoize-one";

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
  getStudentResponseSelector,
  getDynamicVariablesSetIdForViewResponse,
  getTestItemsOrderSelector
} from "../ClassBoard/ducks";

setAutoFreeze(false);
/**
 *
 * @param {Object[]} testItems
 * @param {Object} variablesSetIds
 */
const transformTestItemsForAlgoVariables = (classResponse, variablesSetIds) =>
  produce(classResponse, draft => {
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
class StudentViewContainer extends Component {
  state = { filter: null };

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
    const {
      classResponse,
      studentItems,
      studentResponse,
      selectedStudent,
      variableSetIds,
      testActivity,
      isPresentationMode
    } = this.props;

    const { loading, filter } = this.state;
    const classResponseProcessed = transformTestItemsForAlgoVariables(classResponse, variableSetIds);
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
          <GiveOverallFeedBackButton active>GIVE OVERALL FEEDBACK</GiveOverallFeedBackButton>
        </StyledFlexContainer>
        {!loading && (
          <ClassQuestions
            currentStudent={currentStudent || {}}
            questionActivities={studentResponse.questionActivities}
            classResponse={classResponseProcessed}
            testItemsOrder={this.props.testItemsOrder}
            studentViewFilter={filter}
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
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false)
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
  selectedStudent: PropTypes.string,
  isPresentationMode: PropTypes.bool
};
StudentViewContainer.defaultProps = {
  selectedStudent: "",
  isPresentationMode: false
};
