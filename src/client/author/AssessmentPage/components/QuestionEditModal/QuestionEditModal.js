import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import Modal from "react-responsive-modal";

import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  ESSAY_PLAIN_TEXT
} from "@edulastic/constants/const/questionType";

import { QuestionNumber } from "../QuestionItem/styled";
import { ModalWrapper, ModalTitle, ModalHeader, ModalFooter } from "../../common/Modal";
import QuestionChoice from "./components/QuestionChoice/QuestionChoice";
import QuestionText from "./components/QuestionText/QuestionText";
import QuestionDropdown from "./components/QuestionDropdown/QuestionDropdown";
import QuestionMath from "./components/QuestionMath/QuestionMath";
import QuestionEssay from "./components/QuestionEssay/QuestionEssay";
import StandardSet from "./common/StandardSet/StandardSet";
import PerfectScrollbar from "react-perfect-scrollbar";

const questionTypeTitles = {
  [MULTIPLE_CHOICE]: "Multiple Choice",
  [MATH]: "Math",
  [CLOZE_DROP_DOWN]: "Question Dropdown",
  [ESSAY_PLAIN_TEXT]: "Question Essay",
  [SHORT_TEXT]: "Text Entry"
};

const modalStyles = {
  modal: {
    background: "#f8f8f8",
    borderRadius: "4px 4px 0 0",
    height: "70vh",
    padding: "19px 28px 40px 28px"
  }
};

export default class QuestionEditModal extends React.Component {
  static propTypes = {
    totalQuestions: PropTypes.number,
    visible: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    question: PropTypes.object,
    index: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onCurrentChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    question: undefined
  };

  static defaultProps = {
    visible: false
  };

  renderForm = type => {
    const { question, onUpdate } = this.props;

    const props = {
      question,
      onUpdate
    };

    switch (type) {
      case MULTIPLE_CHOICE:
        return <QuestionChoice {...props} />;
      case SHORT_TEXT:
        return <QuestionText {...props} />;
      case CLOZE_DROP_DOWN:
        return <QuestionDropdown {...props} />;
      case MATH:
        return <QuestionMath {...props} />;
      case ESSAY_PLAIN_TEXT:
        return <QuestionEssay {...props} />;
      default:
        return null;
    }
  };

  render() {
    const { visible, onClose, question, index, onCurrentChange, onUpdate, totalQuestions = 1 } = this.props;

    if (!question) {
      return null;
    }

    const { type, qIndex, title } = question;

    return (
      <Modal open={visible} onClose={onClose} styles={modalStyles} overlayId="docBasedModalOverlay" center>
        <ModalWrapper>
          <ModalHeader>
            <QuestionNumber>{qIndex || index + 1}</QuestionNumber>
            <ModalTitle>{title === "True or false" ? title : questionTypeTitles[type]}</ModalTitle>
          </ModalHeader>
          <div style={{ height: "calc(70vh - 290px)", overflow: "auto" }}>
            <PerfectScrollbar>{this.renderForm(type)}</PerfectScrollbar>
          </div>
          <StandardSet alignment={question.alignment} onUpdate={onUpdate} />
          <ModalFooter>
            <Button onClick={onCurrentChange(index - 1)} disabled={index === 0}>
              Previous
            </Button>
            <Button onClick={onCurrentChange(index + 1)} disabled={totalQuestions - 1 === index}>
              Next
            </Button>
          </ModalFooter>
        </ModalWrapper>
      </Modal>
    );
  }
}
