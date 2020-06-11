import React from "react";
import Modal from "react-responsive-modal";
import PropTypes from "prop-types";
import { Button, Select, Row, Col } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";

import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  ESSAY_PLAIN_TEXT,
  TRUE_OR_FALSE
} from "@edulastic/constants/const/questionType";
import { selectsData } from "../../../TestPage/components/common";
import { ModalWrapper, ModalHeader, ModalFooter } from "../../common/Modal";
import { FormGroup, FormLabel, FormInline, QuestionFormWrapper } from "../QuestionEditModal/common/QuestionForm";
import { BulkTitle, NumberInput, TypeOfQuestion, TypeOfQuestionSelect, StandardSelectWrapper } from "./styled";
import StandardSet from "../QuestionEditModal/common/StandardSet/StandardSet";

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
    startingIndex: this.props.minAvailableQuestionIndex || 1,
    authorDifficulty: "",
    depthOfKnowledge: "",
    alignment: [{
      curriculum: "",
      curriculumId: "",
      domains: [],
      grades: [],
      standards: [],
      subject: ""
    }]
  };

  handleChange = field => value =>
    this.setState({
      [field]: value
    });

  handleApply = () => {
    const { number, type, startingIndex, alignment, authorDifficulty, depthOfKnowledge } = this.state;
    const { onApply, minAvailableQuestionIndex } = this.props;

    const firstQuestionIndex = Math.max(startingIndex, minAvailableQuestionIndex);

    onApply({ number, type, startingIndex: firstQuestionIndex, alignment, authorDifficulty, depthOfKnowledge });
  };

  render() {
    const { number, type, alignment, authorDifficulty, depthOfKnowledge } = this.state;
    const { onCancel, visible } = this.props;

    return (
      <Modal open={visible} onClose={onCancel} styles={modalStyles} center>
        <ModalWrapper>
          <ModalHeader>
            <BulkTitle>Add Bulk</BulkTitle>
          </ModalHeader>
          <PerfectScrollbar>
            <QuestionFormWrapper>
              <FormInline>
                <FormGroup>
                  <FormLabel>Number</FormLabel>
                  <NumberInput min={1} value={number} onChange={this.handleChange("number")} />
                </FormGroup>
                <TypeOfQuestion>
                  <FormLabel>Type of Question</FormLabel>
                  <TypeOfQuestionSelect
                    value={type}
                    onChange={this.handleChange("type")}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    <Select.Option value={MULTIPLE_CHOICE}>Multiple Choice</Select.Option>
                    <Select.Option value={SHORT_TEXT}>Text</Select.Option>
                    <Select.Option value={CLOZE_DROP_DOWN}>Drop down</Select.Option>
                    <Select.Option value={MATH}>Math</Select.Option>
                    <Select.Option value={ESSAY_PLAIN_TEXT}>Essay</Select.Option>
                    <Select.Option value={TRUE_OR_FALSE}>True or False</Select.Option>
                  </TypeOfQuestionSelect>
                </TypeOfQuestion>
              </FormInline>
            </QuestionFormWrapper>

            <StandardSelectWrapper>
              <StandardSet alignment={alignment} onUpdate={data => this.setState({ alignment: data.alignment })} isDocBased showIconBrowserBtn />
              <Row style={{ marginTop: "10px" }}>
                <Col md={12}>
                  <FormLabel>DOK</FormLabel>
                  <Select
                    style={{ width: "95%" }}
                    placeholder="Select DOK"
                    onSelect={val => this.setState({ depthOfKnowledge: val })}
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
                  </Select>
                </Col>
                <Col md={12} style={{ paddingLeft: "5%" }}>
                  <FormLabel>Difficulty</FormLabel>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select Difficulty Level"
                    onSelect={val => this.setState({ authorDifficulty: val })}
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
                  </Select>
                </Col>
              </Row>
            </StandardSelectWrapper>
          </PerfectScrollbar>
          <ModalFooter marginTop="35px">
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={this.handleApply}>Apply</Button>
          </ModalFooter>
        </ModalWrapper>
      </Modal>
    );
  }
}
