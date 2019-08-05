import React, { createRef } from "react";
import PropTypes from "prop-types";

import Question from "../Question/Question";
import { ModalWrapper, QuestionWrapperStyled, BottomNavigationWrapper } from "./styled";
import { submitResponseAction } from "../../ducks";
import { stateExpressGraderAnswerSelector, getStudentQuestionSelector } from "../../../ClassBoard/ducks";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import { message } from "antd";
import { get, isEmpty } from "lodash";
import { connect } from "react-redux";
import ModalDragScrollContainer from "../../../../assessment/components/ModalDragScrollContainer";

const QuestionWrapper = React.forwardRef((props, ref) => <QuestionWrapperStyled {...props} innerRef={ref} />);

class QuestionModal extends React.Component {
  questionWrapperRef = createRef();

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
  }

  componentDidMount() {
    const { record, tableData } = this.props;
    const loaded = true;
    let maxQuestions = null;
    let maxStudents = null;
    const colIndex = record ? record.colIndex : null;
    const rowIndex = record ? record.rowIndex : null;

    if (rowIndex !== null) {
      maxQuestions = tableData[rowIndex].questions;
      maxStudents = tableData.length;
    }

    this.setState({ rowIndex, colIndex, loaded, maxQuestions, maxStudents });
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
    const { groupId, userResponse: _userResponse, allResponse, submitResponse } = this.props;
    const { testActivityId, testItemId: itemId } = question;
    if (!isEmpty(_userResponse)) {
      /**
       * allResponse is empty when the questionActivity is empty.
       * In that case only send currenytly attempted _userResponse
       */
      const userResponse =
        allResponse.length > 0
          ? allResponse.reduce((acc, cur) => {
              acc[cur.qid] = cur.userResponse;
              return acc;
            }, {})
          : _userResponse;
      submitResponse({ testActivityId, itemId, groupId, userResponse });
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
    const { isVisibleModal, tableData, record, isPresentationMode } = this.props;
    const { rowIndex, colIndex, loaded, row, editResponse } = this.state;

    const scrollContainer = this.questionWrapperRef && this.questionWrapperRef.current;

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
        onOk={this.hideModal}
        onCancel={this.hideModal}
        visible={isVisibleModal}
        bodyStyle={{ background: "#f0f2f5", height: "100%", overflowY: "auto" }}
      >
        <ModalDragScrollContainer scrollWrraper={scrollContainer} height={50} />
        {isVisibleModal && question && loaded && (
          <React.Fragment>
            <QuestionWrapper ref={this.questionWrapperRef} style={{ marginBottom: "5%" }}>
              <Question
                record={question}
                key={question.id}
                qIndex={colIndex}
                student={student}
                isPresentationMode={isPresentationMode}
                editResponse={editResponse}
              />
            </QuestionWrapper>
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
    allResponse: getStudentQuestionSelector(state)
  }),
  { submitResponse: submitResponseAction }
)(QuestionModal);
