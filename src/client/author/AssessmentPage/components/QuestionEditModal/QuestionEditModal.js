import { CustomModalStyled, EduButton, FieldLabel, SelectInputStyled } from "@edulastic/common";
import {
  CLOZE_DROP_DOWN,
  ESSAY_PLAIN_TEXT,
  MATH,
  MULTIPLE_CHOICE,
  SHORT_TEXT,
  TRUE_OR_FALSE
} from "@edulastic/constants/const/questionType";
import { Col, Row, Select } from "antd";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { selectsData } from "../../../TestPage/components/common";
import { ModalFooter, ModalTitle } from "../../common/Modal";
import { QuestionNumber } from "../QuestionItem/styled";
import StandardSet from "./common/StandardSet/StandardSet";
import { StandardSelectWrapper } from "./common/StandardSet/styled";
import QuestionChoice from "./components/QuestionChoice/QuestionChoice";
import QuestionDropdown from "./components/QuestionDropdown/QuestionDropdown";
import QuestionEssay from "./components/QuestionEssay/QuestionEssay";
import QuestionMath from "./components/QuestionMath/QuestionMath";
import QuestionText from "./components/QuestionText/QuestionText";

const questionTypeTitles = {
  [MULTIPLE_CHOICE]: "Multiple Choice",
  [MATH]: "Math",
  [CLOZE_DROP_DOWN]: "Question Dropdown",
  [ESSAY_PLAIN_TEXT]: "Question Essay",
  [SHORT_TEXT]: "Text Entry"
};

export default class QuestionEditModal extends React.Component {
  static propTypes = {
    totalQuestions: PropTypes.number.isRequired,
    visible: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    question: PropTypes.object,
    qNumber: PropTypes.number.isRequired,
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
        return <QuestionMath docBasedQType={type} {...props} />;
      case ESSAY_PLAIN_TEXT:
        return <QuestionEssay {...props} />;
      default:
        return null;
    }
  };

  render() {
    const { visible, onClose, question, onCurrentChange, onUpdate, totalQuestions = 1, qNumber } = this.props;

    if (!question) {
      return null;
    }

    const { id, type, qIndex, title, authorDifficulty = "", depthOfKnowledge = "" } = question;
    const index = qIndex - 1;

    const QuestionTitle = (
      <>
        <QuestionNumber>{qNumber}</QuestionNumber>
        <ModalTitle>{title === "True or false" ? title : questionTypeTitles[type]}</ModalTitle>
      </>
    );

    return (
      <CustomModalStyled
        centered
        visible={visible}
        title={QuestionTitle}
        onCancel={onClose}
        footer={[
          <ModalFooter>
            <EduButton isGhost onClick={() => onCurrentChange(index - 1)("back")} disabled={index === 0}>
              Previous
            </EduButton>
            <EduButton onClick={index === totalQuestions - 1 ? onClose : () => onCurrentChange(index + 1)("next")}>
              {index === totalQuestions - 1 ? "DONE" : "NEXT"}
            </EduButton>
          </ModalFooter>
        ]}
        overlayId="docBasedModalOverlay"
      >
        <StyledBodyContainer>
          {this.renderForm(type)}
          <StandardSelectWrapper>
            <StandardSet qId={id} alignment={question.alignment} onUpdate={onUpdate} isDocBased showIconBrowserBtn />
            <Row gutter={24} style={{ marginTop: "10px" }}>
              <Col md={12}>
                <FieldLabel>DOK</FieldLabel>
                <SelectInputStyled
                  placeholder="Select DOK"
                  onSelect={val => onUpdate({ depthOfKnowledge: val })}
                  value={depthOfKnowledge}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  <Select.Option key="Select DOK" value="">
                    Select DOK
                  </Select.Option>
                  {selectsData.allDepthOfKnowledge.map(
                    el =>
                      el.value && (
                        <Select.Option key={el.value} value={el.value}>
                          {el.text}
                        </Select.Option>
                      )
                  )}
                </SelectInputStyled>
              </Col>
              <Col md={12}>
                <FieldLabel>Difficulty</FieldLabel>
                <SelectInputStyled
                  placeholder="Select Difficulty Level"
                  onSelect={val => onUpdate({ authorDifficulty: val })}
                  value={authorDifficulty}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  <Select.Option key="Select Difficulty Level" value="">
                    Select Difficulty Level
                  </Select.Option>
                  {selectsData.allAuthorDifficulty.map(
                    el =>
                      el.value && (
                        <Select.Option key={el.value} value={el.value}>
                          {el.text}
                        </Select.Option>
                      )
                  )}
                </SelectInputStyled>
              </Col>
            </Row>
          </StandardSelectWrapper>
        </StyledBodyContainer>
      </CustomModalStyled>
    );
  }
}

const StyledBodyContainer = styled.div`
  height: 350px;
  padding: 0px 24px 10px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &:hover {
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
    }
  }
`;
