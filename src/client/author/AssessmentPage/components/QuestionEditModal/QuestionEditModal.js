import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Row, Select } from "antd";
import Modal from "react-responsive-modal";

import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  ESSAY_PLAIN_TEXT,
  TRUE_OR_FALSE
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
import { FormLabel } from "./common/QuestionForm";
import { selectsData } from "../../../TestPage/components/common";
import { StandardSelectWrapper } from "./common/StandardSet/styled";

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
    padding: "19px 10px 40px 10px"
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
      case TRUE_OR_FALSE:
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

    const { id, type, qIndex, title, authorDifficulty = "", depthOfKnowledge = "" } = question;

    return (
      <Modal open={visible} onClose={onClose} styles={modalStyles} overlayId="docBasedModalOverlay" center>
        <ModalWrapper>
          <ModalHeader>
            <QuestionNumber>{index}</QuestionNumber>
            <ModalTitle>{title === "True or false" ? title : questionTypeTitles[type]}</ModalTitle>
          </ModalHeader>

          <div style={{ maxHeight: "50vh", overflow: "hidden auto", paddingBottom: "10px" }}>
            <PerfectScrollbar>
              {this.renderForm(type)}
              <StandardSelectWrapper>
                <StandardSet qId={id} alignment={question.alignment} onUpdate={onUpdate} isDocBased />
                <Row style={{ marginTop: "10px" }}>
                  <Col md={12}>
                    <FormLabel>DOK</FormLabel>
                    <Select
                      style={{ width: "95%" }}
                      placeholder={"Select DOK"}
                      onSelect={val => onUpdate({ depthOfKnowledge: val })}
                      value={depthOfKnowledge}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      <Select.Option key={"Select DOK"} value={""}>
                        {"Select DOK"}
                      </Select.Option>
                      {selectsData.allDepthOfKnowledge.map(
                        el =>
                          el.value && (
                            <Select.Option key={el.value} value={el.value}>
                              {el.text}
                            </Select.Option>
                          )
                      )}
                    </Select>
                  </Col>
                  <Col md={12} style={{ paddingLeft: "5%" }}>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      style={{ width: "100%" }}
                      placeholder={"Select Difficulty Level"}
                      onSelect={val => onUpdate({ authorDifficulty: val })}
                      value={authorDifficulty}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      <Select.Option key={"Select Difficulty Level"} value={""}>
                        {"Select Difficulty Level"}
                      </Select.Option>
                      {selectsData.allAuthorDifficulty.map(
                        el =>
                          el.value && (
                            <Select.Option key={el.value} value={el.value}>
                              {el.text}
                            </Select.Option>
                          )
                      )}
                    </Select>
                  </Col>
                </Row>
              </StandardSelectWrapper>
            </PerfectScrollbar>
          </div>
          <ModalFooter marginTop="20px">
            <Button onClick={onCurrentChange(index - 1)} disabled={index === 0}>
              Previous
            </Button>
            <Button onClick={index === totalQuestions - 1 ? onClose : onCurrentChange(index + 1)}>
              {index === totalQuestions - 1 ? "DONE" : "NEXT"}
            </Button>
          </ModalFooter>
        </ModalWrapper>
      </Modal>
    );
  }
}
