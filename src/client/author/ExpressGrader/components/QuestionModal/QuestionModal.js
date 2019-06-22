import React from "react";
import PropTypes from "prop-types";

import Question from "../Question/Question";
import { ModalWrapper, QuestionWrapper, BottomNavigationWrapper } from "./styled";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import { message } from "antd";

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
      maxStudents: null
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
    const { hideQuestionModal } = this.props;
    hideQuestionModal();
  };

  nextStudent = () => {
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
    const { rowIndex } = this.state;
    if (rowIndex !== 0) {
      const prevIndex = rowIndex - 1;
      this.setState({ loaded: false }, () => {
        this.setState({ rowIndex: prevIndex, loaded: true });
      });
    }
  };

  nextQuestion = () => {
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
    const { rowIndex, colIndex, loaded, row } = this.state;

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
        {isVisibleModal && question && loaded && (
          <React.Fragment>
            <QuestionWrapper>
              <Question
                record={question}
                key={question.id}
                qIndex={colIndex}
                student={student}
                isPresentationMode={isPresentationMode}
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

export default QuestionModal;
