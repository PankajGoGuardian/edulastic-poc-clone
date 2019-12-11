import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { findIndex, isUndefined, get, keyBy } from "lodash";
import produce, { setAutoFreeze } from "immer";
import memoizeOne from "memoize-one";
import { Modal, Button, Input, Tooltip } from "antd";
import { ThemeProvider } from "styled-components";
import { AnswerContext } from "@edulastic/common";
import { IconFeedback } from "@edulastic/icons";
import { test } from "@edulastic/constants";
import { white } from "@edulastic/colors";
import {
  StyledFlexContainer,
  AllButton,
  CorrectButton,
  WrongButton,
  StyledStudentTabButton,
  PartiallyCorrectButton,
  GiveOverallFeedBackButton,
  StudentButtonWrapper,
  StudentButtonDiv
} from "./styled";

import ClassQuestions from "../ClassResponses/components/Container/ClassQuestions";

// actions
import {
  receiveStudentResponseAction,
  saveOverallFeedbackAction,
  updateOverallFeedbackAction
} from "../src/actions/classBoard";
import { setStudentViewFilterAction } from "../src/reducers/testActivity";
// selectors
import {
  getAssignmentClassIdSelector,
  getClassQuestionSelector,
  getStudentResponseSelector,
  getDynamicVariablesSetIdForViewResponse,
  getTestItemsOrderSelector,
  getCurrentTestActivityIdSelector
} from "../ClassBoard/ducks";

import { getQuestionLabels } from "../ClassBoard/Transformer";

const _getquestionLabels = memoizeOne(getQuestionLabels);

setAutoFreeze(false);

class StudentViewContainer extends Component {
  state = { showFeedbackPopup: false, showTestletPlayer: false, hasStickyHeader: false };

  feedbackRef = React.createRef();
  questionsContainerRef = React.createRef();

  handleScroll = e => {
    const elementTop = this.questionsContainerRef.current?.getBoundingClientRect().top || 0;
    if (elementTop < 100 && !this.state.hasStickyHeader) {
      this.setState({ hasStickyHeader: true });
    } else if (elementTop > 100 && this.state.hasStickyHeader) {
      this.setState({ hasStickyHeader: false });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const {
      selectedStudent,
      loadStudentResponses,
      studentItems,
      assignmentIdClassId: { classId } = {},
      currentTestActivityId = ""
    } = nextProps;
    const { selectedStudent: _selectedStudent } = preState || {};

    if (selectedStudent !== _selectedStudent) {
      let index = 0;
      if (selectedStudent) {
        index = findIndex(studentItems, student => student.studentId === selectedStudent);
      }
      const { testActivityId } = studentItems[index];
      if (!isUndefined(currentTestActivityId || testActivityId) && !isUndefined(classId)) {
        loadStudentResponses({
          testActivityId: currentTestActivityId || testActivityId,
          groupId: classId,
          studentId: selectedStudent
        });
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
    const feedback = this.feedbackRef.current.state.value;
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
      isPresentationMode,
      testItemsOrder,
      filter,
      setFilter
    } = this.props;

    const { loading, showFeedbackPopup, showTestletPlayer, hasStickyHeader } = this.state;
    const userId = studentResponse.testActivity ? studentResponse.testActivity.userId : "";
    const currentStudent = studentItems.find(({ studentId }) => {
      if (selectedStudent) {
        return studentId === selectedStudent;
      }
      return studentId === userId;
    });

    const showStudentWorkButton = test.type.TESTLET === classResponse.testType;

    // show the total count.
    const questionActivities = studentResponse?.questionActivities || [];
    const activeQuestions = questionActivities.filter(x => !(x.disabled || x.scoringDisabled));
    const totalNumber = activeQuestions.length;

    const correctNumber = activeQuestions.filter(x => x.score === x.maxScore && x.score > 0).length;

    const wrongNumber = activeQuestions.filter(x => x.score === 0 && x.maxScore > 0 && x.graded && !x.skipped).length;

    const partiallyCorrectNumber = activeQuestions.filter(x => x.score > 0 && x.score < x.maxScore).length;

    const skippedNumber = activeQuestions.filter(x => x.skipped && x.score === 0).length;

    const notGradedNumber = activeQuestions.filter(x => !x.skipped && x.graded === false).length;

    const studentTestActivity = studentResponse && studentResponse.testActivity;
    const initFeedbackValue =
      (studentTestActivity && studentTestActivity.feedback && studentTestActivity.feedback.text) || "";
    const feedbackButtonToolTip = (
      <div>
        <p>
          <b>Overall feedback</b>
        </p>
        <p>{initFeedbackValue}</p>
      </div>
    );

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
              <Button data-cy="cancel" key="back" onClick={() => this.handleShowFeedbackPopup(false)}>
                Cancel
              </Button>,
              <Button data-cy="submit" key="submit" type="primary" onClick={this.handleApply}>
                Apply
              </Button>
            ]}
          >
            <p>Leave a feedback!</p>
            <Input.TextArea
              data-cy="feedbackInput"
              rows={6}
              defaultValue={initFeedbackValue}
              ref={this.feedbackRef}
              maxlength="250"
              autoFocus
            />
          </Modal>
        )}

        <StyledFlexContainer
          justifyContent="space-between"
          hasStickyHeader={hasStickyHeader}
          className="lcb-student-sticky-bar"
        >
          <StudentButtonWrapper>
            <StudentButtonDiv>
              <AllButton active={filter === null} onClick={() => setFilter(null)}>
                ALL ({totalNumber})
              </AllButton>
              <CorrectButton active={filter === "correct"} onClick={() => setFilter("correct")}>
                CORRECT ({correctNumber})
              </CorrectButton>
              <WrongButton active={filter === "wrong"} onClick={() => setFilter("wrong")}>
                WRONG ({wrongNumber})
              </WrongButton>
              <WrongButton active={filter === "partial"} onClick={() => setFilter("partial")}>
                PARTIALLY CORRECT ({partiallyCorrectNumber})
              </WrongButton>
              <WrongButton active={filter === "skipped"} onClick={() => setFilter("skipped")}>
                SKIPPED ({skippedNumber})
              </WrongButton>
              <PartiallyCorrectButton active={filter === "notGraded"} onClick={() => setFilter("notGraded")}>
                NOT GRADED ({notGradedNumber})
              </PartiallyCorrectButton>
            </StudentButtonDiv>
            {showStudentWorkButton && (
              <StyledStudentTabButton onClick={() => this.setState({ showTestletPlayer: true })}>
                SHOW STUDENT WORK
              </StyledStudentTabButton>
            )}
          </StudentButtonWrapper>
          <GiveOverallFeedBackButton
            data-cy="overallFeedback"
            onClick={() => this.handleShowFeedbackPopup(true)}
            active
            style={{ width: "25%" }}
          >
            <IconFeedback color={white} />
            {initFeedbackValue.length ? (
              <Tooltip title={feedbackButtonToolTip} placement={hasStickyHeader ? "bottom" : "top"}>
                <span>{`${initFeedbackValue.slice(0, 30)}${initFeedbackValue.length > 30 ? "....." : ""}`}</span>
              </Tooltip>
            ) : (
              "GIVE OVERALL FEEDBACK"
            )}
          </GiveOverallFeedBackButton>
        </StyledFlexContainer>

        <div ref={this.questionsContainerRef}>
          {!loading && (
            <AnswerContext.Provider value={{ isAnswerModifiable: false, currentScreen: "live_class_board" }}>
              <ThemeProvider
                theme={{ twoColLayout: { first: "calc(100% - 265px) !important", second: "250px !important" } }}
              >
                <ClassQuestions
                  currentStudent={currentStudent || {}}
                  questionActivities={studentResponse.questionActivities || []}
                  testActivity={studentResponse.testActivity || {}}
                  classResponse={classResponse}
                  testItemsOrder={testItemsOrder}
                  studentViewFilter={filter}
                  labels={_getquestionLabels(classResponse.testItems)}
                  isPresentationMode={isPresentationMode}
                  showTestletPlayer={showTestletPlayer}
                  closeTestletPlayer={() => this.setState({ showTestletPlayer: false })}
                />
              </ThemeProvider>
            </AnswerContext.Provider>
          )}
        </div>
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
      currentTestActivityId: getCurrentTestActivityIdSelector(state),
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false),
      testItemIds: get(state, "author_classboard_testActivity.data.test.testItems", []),
      entities: get(state, "author_classboard_testActivity.entities", []),
      filter: state?.author_classboard_testActivity?.studentViewFilter
    }),
    {
      loadStudentResponses: receiveStudentResponseAction,
      saveOverallFeedback: saveOverallFeedbackAction,
      updateOverallFeedback: updateOverallFeedbackAction,
      setFilter: setStudentViewFilterAction
    }
  )
);
export default enhance(StudentViewContainer);

StudentViewContainer.propTypes = {
  classResponse: PropTypes.object.isRequired,
  studentItems: PropTypes.array.isRequired,
  studentResponse: PropTypes.object.isRequired,
  selectedStudent: PropTypes.string,
  isPresentationMode: PropTypes.bool,
  saveOverallFeedback: PropTypes.func.isRequired,
  updateOverallFeedback: PropTypes.func.isRequired,
  assignmentIdClassId: PropTypes.array.isRequired,
  variableSetIds: PropTypes.array.isRequired,
  testItemsOrder: PropTypes.any.isRequired
};
StudentViewContainer.defaultProps = {
  selectedStudent: "",
  isPresentationMode: false
};
