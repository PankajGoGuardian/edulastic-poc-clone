import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { findIndex, isUndefined, get } from "lodash";
import { setAutoFreeze } from "immer";
import memoizeOne from "memoize-one";
import { Input, Tooltip } from "antd";
import { AnswerContext, scrollTo, EduButton } from "@edulastic/common";
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
  StudentButtonDiv,
  ScrollToTopButton,
  StyledModal,
  StyledFooter
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

  handleScroll = () => {
    const { hasStickyHeader } = this.state;
    const elementTop = this.questionsContainerRef.current?.getBoundingClientRect().top || 0;
    if (elementTop < 100 && !hasStickyHeader) {
      this.setState({ hasStickyHeader: true });
    } else if (elementTop > 100 && hasStickyHeader) {
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

  onClickTab = filter => {
    const { setFilter } = this.props;
    setFilter(filter);
    scrollTo(document.querySelector("body"));
  };

  render() {
    const {
      classResponse,
      studentItems,
      studentResponse,
      selectedStudent,
      isPresentationMode,
      testItemsOrder,
      filter
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
          <StyledModal
            centered
            maskClosable={false}
            visible={showFeedbackPopup}
            title="Give Overall Feedback"
            onCancel={() => this.handleShowFeedbackPopup(false)}
            footer={
              <StyledFooter>
                <EduButton data-cy="cancel" key="back" isGhost onClick={() => this.handleShowFeedbackPopup(false)}>
                  Cancel
                </EduButton>
                <EduButton data-cy="submit" key="submit" type="primary" onClick={this.handleApply}>
                  Save
                </EduButton>
              </StyledFooter>
            }
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
          </StyledModal>
        )}

        <StyledFlexContainer
          justifyContent="space-between"
          hasStickyHeader={hasStickyHeader}
          className="lcb-student-sticky-bar"
        >
          <StudentButtonWrapper>
            <StudentButtonDiv>
              <AllButton active={filter === null} onClick={() => this.onClickTab(null)}>
                ALL ({totalNumber})
              </AllButton>
              <CorrectButton active={filter === "correct"} onClick={() => this.onClickTab("correct")}>
                CORRECT ({correctNumber})
              </CorrectButton>
              <WrongButton active={filter === "wrong"} onClick={() => this.onClickTab("wrong")}>
                WRONG ({wrongNumber})
              </WrongButton>
              <WrongButton active={filter === "partial"} onClick={() => this.onClickTab("partial")}>
                PARTIALLY CORRECT ({partiallyCorrectNumber})
              </WrongButton>
              <WrongButton active={filter === "skipped"} onClick={() => this.onClickTab("skipped")}>
                SKIPPED ({skippedNumber})
              </WrongButton>
              <PartiallyCorrectButton active={filter === "notGraded"} onClick={() => this.onClickTab("notGraded")}>
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
          >
            <IconFeedback color={white} />
            {initFeedbackValue.length ? (
              <Tooltip title={feedbackButtonToolTip} placement={hasStickyHeader ? "bottom" : "top"}>
                <span>
                  {`${initFeedbackValue.slice(0, 30)}
                    ${initFeedbackValue.length > 30 ? "....." : ""}`}
                </span>
              </Tooltip>
            ) : (
              "GIVE OVERALL FEEDBACK"
            )}
          </GiveOverallFeedBackButton>
        </StyledFlexContainer>

        <div ref={this.questionsContainerRef}>
          {!loading && (
            <AnswerContext.Provider value={{ isAnswerModifiable: false, currentScreen: "live_class_board" }}>
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
                isLCBView
              />
            </AnswerContext.Provider>
          )}
        </div>
        <ScrollToTopButton
          type="primary"
          icon="arrow-up"
          shape="circle"
          hasStickyHeader={hasStickyHeader}
          onClick={() => scrollTo(document.querySelector("body"))}
        />
      </React.Fragment>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
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
  testItemsOrder: PropTypes.any.isRequired
};
StudentViewContainer.defaultProps = {
  selectedStudent: "",
  isPresentationMode: false
};
