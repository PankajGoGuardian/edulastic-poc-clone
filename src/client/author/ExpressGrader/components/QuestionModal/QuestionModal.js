import React, { createRef } from "react";
import PropTypes from "prop-types";

import { ScrollContext } from "@edulastic/common";
import { message } from "antd";
import { get, isEmpty } from "lodash";
import { connect } from "react-redux";
import Question from "../Question/Question";
import { ModalWrapper, QuestionWrapperStyled, BottomNavigationWrapper } from "./styled";
import { submitResponseAction, getTeacherEditedScoreSelector, getIsScoringCompletedSelector } from "../../ducks";
import { stateExpressGraderAnswerSelector, getStudentQuestionSelector } from "../../../ClassBoard/ducks";
import BottomNavigation from "../BottomNavigation/BottomNavigation";

const QuestionWrapper = React.forwardRef((props, ref) => <QuestionWrapperStyled {...props} ref={ref} />);

class QuestionModal extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      // visible: false,
      // question: null,
      rowIndex: null,
      colIndex: null,
      maxQuestions: null,
      maxStudents: null,
      editResponse: false
    };
    this.containerRef = createRef();
  }

  componentDidMount() {
    const { record, tableData, scoreMode } = this.props;
    const loaded = true;
    let maxQuestions = null;
    let maxStudents = null;
    const colIndex = record ? record.colIndex : null;
    const rowIndex = record ? record.rowIndex : null;

    if (rowIndex !== null) {
      maxQuestions = tableData[rowIndex].questions;
      maxStudents = tableData.length;
    }
    this.setState({ rowIndex, colIndex, loaded, maxQuestions, maxStudents, editResponse: !scoreMode });
    document.addEventListener("keyup", this.keyListener, false);
  }

  componentWillReceiveProps(nextProps) {
    const { record, tableData } = nextProps;
    const loaded = true;
    const newcolIndex = record ? record.colIndex : null;
    const newrowIndex = record ? record.rowIndex : null;
    const { rowIndex, colIndex } = this.state;

    if (rowIndex === null && colIndex === null) {
      const maxQuestions = tableData[rowIndex].questions;
      const maxStudents = tableData.length;
      this.setState({
        loaded,
        rowIndex: newrowIndex,
        colIndex: newcolIndex,
        maxQuestions,
        maxStudents
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.keyListener, false);
  }

  keyListener = event => {
    if (event.keyCode === 37) {
      this.prevQuestion();
    }
    if (event.keyCode === 38) {
      this.prevStudent();
    }
    if (event.keyCode === 39) {
      this.nextQuestion();
    }
    if (event.keyCode === 40) {
      this.nextStudent();
    }
  };

  showModal = () => {
    const { showQuestionModal } = this.props;
    showQuestionModal();
  };

  hideModal = () => {
    this.submitResponse();
    const { hideQuestionModal } = this.props;
    hideQuestionModal();
  };

  nextStudent = () => {
    this.submitResponse();
    const { maxStudents } = this.state;
    const { rowIndex } = this.state;
    const nextIndex = rowIndex + 1;
    if (nextIndex !== maxStudents) {
      this.setState({ loaded: false }, () => {
        this.setState({ rowIndex: nextIndex, loaded: true });
      });
    } else {
      message.success("Congratulations. You have finished grading all students!");
    }
  };

  prevStudent = () => {
    this.submitResponse();
    const { rowIndex } = this.state;
    if (rowIndex !== 0) {
      const prevIndex = rowIndex - 1;
      this.setState({ loaded: false }, () => {
        this.setState({ rowIndex: prevIndex, loaded: true });
      });
    }
  };

  getQuestion = () => {
    const { rowIndex, colIndex, loaded } = this.state;
    const { tableData } = this.props;
    return get(tableData, [rowIndex, `Q${colIndex}`]);
  };

  submitResponse = () => {
    const question = this.getQuestion();
    /**
     *  testActivityId,
        itemId,
        groupId,
        userResponse
     */
    const {
      groupId,
      userResponse: _userResponse,
      allResponse,
      submitResponse,
      teacherEditedScore,
      studentResponseLoading
    } = this.props;
    if (studentResponseLoading) return;
    const { testActivityId, testItemId: itemId } = question;
    if (!isEmpty(_userResponse)) {
      /**
       * allResponse is empty when the questionActivity is empty.
       * In that case only send currenytly attempted _userResponse
       */

      const scores = isEmpty(teacherEditedScore) ? undefined : { ...teacherEditedScore };

      const userResponse =
        allResponse.length > 0
          ? allResponse.reduce((acc, cur) => {
              acc[cur.qid] = cur.userResponse;
              return acc;
            }, {})
          : _userResponse;
      submitResponse({ testActivityId, itemId, groupId, userResponse, scores });
    }
  };

  nextQuestion = () => {
    this.submitResponse();
    const { maxQuestions } = this.state;
    const { colIndex } = this.state;
    const nextIndex = colIndex + 1;
    if (nextIndex !== maxQuestions) {
      this.setState({ loaded: false }, () => {
        this.setState({ colIndex: nextIndex, loaded: true });
      });
    } else {
      message.success("Congratulations. You have finished grading all students!");
    }
  };

  prevQuestion = () => {
    this.submitResponse();
    const { colIndex } = this.state;
    if (colIndex !== 0) {
      const prevIndex = colIndex - 1;
      this.setState({ loaded: false }, () => {
        this.setState({ colIndex: prevIndex, loaded: true });
      });
    }
  };

  render() {
    let question = null;
    const {
      isVisibleModal,
      tableData,
      record,
      isPresentationMode,
      windowWidth,
      studentResponseLoading,
      isScoringInProgress
    } = this.props;
    const { rowIndex, colIndex, loaded, row, editResponse } = this.state;

    if (colIndex !== null && rowIndex !== null) {
      question = tableData[rowIndex][`Q${colIndex}`];
    }

    let student = {};
    if (rowIndex !== null) {
      student = tableData[rowIndex].students;
    }

    return (
      <ModalWrapper
        centered
        width="95%"
        height="95%"
        footer={null}
        closable={false}
        destroyOnClose
        onOk={this.hideModal}
        onCancel={this.hideModal}
        visible={isVisibleModal}
        bodyStyle={{ background: "#f0f2f5", height: "100%", overflowY: "auto" }}
      >
        {isVisibleModal && question && loaded && (
          <React.Fragment>
            <ScrollContext.Provider value={{ getScrollElement: () => this.containerRef?.current }}>
              <QuestionWrapper ref={this.containerRef} style={{ marginBottom: windowWidth > 1024 ? "66px" : "99px" }}>
                <Question
                  record={question}
                  key={question.id}
                  qIndex={colIndex}
                  student={student}
                  isPresentationMode={isPresentationMode}
                  editResponse={editResponse}
                  studentResponseLoading={studentResponseLoading || isScoringInProgress}
                />
              </QuestionWrapper>
            </ScrollContext.Provider>
            <BottomNavigationWrapper>
              <BottomNavigation
                hideModal={this.hideModal}
                prevStudent={this.prevStudent}
                nextStudent={this.nextStudent}
                prevQuestion={this.prevQuestion}
                nextQuestion={this.nextQuestion}
                style={{ padding: "20px 3%" }}
                editResponse={editResponse}
                toggleEditResponse={() => this.setState(({ editResponse }) => ({ editResponse: !editResponse }))}
              />
            </BottomNavigationWrapper>
          </React.Fragment>
        )}
      </ModalWrapper>
    );
  }
}

QuestionModal.propTypes = {
  record: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  isVisibleModal: PropTypes.bool.isRequired,
  showQuestionModal: PropTypes.func.isRequired,
  hideQuestionModal: PropTypes.func.isRequired,
  isPresentationMode: PropTypes.bool
};

QuestionModal.defaultProps = {
  isPresentationMode: false
};

export default connect(
  state => ({
    userResponse: stateExpressGraderAnswerSelector(state),
    allResponse: getStudentQuestionSelector(state),
    teacherEditedScore: getTeacherEditedScoreSelector(state),
    studentResponseLoading: state.studentQuestionResponse?.loading,
    isScoringInProgress: getIsScoringCompletedSelector(state)
  }),
  { submitResponse: submitResponseAction }
)(QuestionModal);
