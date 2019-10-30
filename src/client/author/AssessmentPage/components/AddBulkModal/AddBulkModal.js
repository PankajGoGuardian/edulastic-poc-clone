import React from "react";
import Modal from "react-responsive-modal";
import PropTypes from "prop-types";
import { Button, Select } from "antd";

import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  ESSAY_PLAIN_TEXT,
  TRUE_OR_FALSE
} from "@edulastic/constants/const/questionType";

import { ModalWrapper, ModalHeader, ModalFooter } from "../../common/Modal";
import { FormGroup, FormLabel, FormInline, QuestionFormWrapper } from "../QuestionEditModal/common/QuestionForm";
import { BulkTitle, NumberInput, TypeOfQuestion, StartingIndexInput, TypeOfQuestionSelect } from "./styled";

const modalStyles = {
  modal: {
    background: "#f8f8f8",
    borderRadius: "4px 4px 0 0",
    padding: "19px 28px 40px 28px"
  }
};

export default class AddBulkModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    minAvailableQuestionIndex: PropTypes.number.isRequired,
    onApply: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  state = {
    number: 2,
    type: MULTIPLE_CHOICE,
    startingIndex: 1
  };

  handleChange = field => value =>
    this.setState({
      [field]: value
    });

  handleApply = () => {
    const { number, type, startingIndex } = this.state;
    const { onApply, minAvailableQuestionIndex } = this.props;

    const firstQuestionIndex = Math.max(startingIndex, minAvailableQuestionIndex);

    onApply({ number, type, startingIndex: firstQuestionIndex });
  };

  render() {
    const { number, type, startingIndex } = this.state;
    const { onCancel, visible, minAvailableQuestionIndex } = this.props;

    return (
      <Modal open={visible} onClose={onCancel} styles={modalStyles} center>
        <ModalWrapper>
          <ModalHeader>
            <BulkTitle>Add Bulk</BulkTitle>
          </ModalHeader>
          <QuestionFormWrapper>
            <FormInline>
              <FormGroup>
                <FormLabel>Number</FormLabel>
                <NumberInput min={1} value={number} onChange={this.handleChange("number")} />
              </FormGroup>
              <TypeOfQuestion>
                <FormLabel>Type of Question</FormLabel>
                <TypeOfQuestionSelect value={type} onChange={this.handleChange("type")}>
                  <Select.Option value={MULTIPLE_CHOICE}>Multiple Choice</Select.Option>
                  <Select.Option value={SHORT_TEXT}>Text</Select.Option>
                  <Select.Option value={CLOZE_DROP_DOWN}>Drop down</Select.Option>
                  <Select.Option value={MATH}>Math</Select.Option>
                  <Select.Option value={ESSAY_PLAIN_TEXT}>Essay</Select.Option>
                  <Select.Option value={TRUE_OR_FALSE}>True or False</Select.Option>
                </TypeOfQuestionSelect>
              </TypeOfQuestion>
            </FormInline>
            <FormGroup>
              <FormLabel>Starting Index</FormLabel>
              <StartingIndexInput
                value={startingIndex}
                min={minAvailableQuestionIndex}
                onChange={this.handleChange("startingIndex")}
              />
            </FormGroup>
          </QuestionFormWrapper>
          <ModalFooter marginTop="35px">
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={this.handleApply}>Apply</Button>
          </ModalFooter>
        </ModalWrapper>
      </Modal>
    );
  }
}
