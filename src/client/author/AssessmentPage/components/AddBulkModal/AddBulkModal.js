import { CustomModalStyled, EduButton, FieldLabel, NumberInputStyled, SelectInputStyled } from "@edulastic/common";
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
import { selectsData } from "../../../TestPage/components/common";
import { ModalFooter, ModalWrapper } from "../../common/Modal";
import { QuestionFormWrapper } from "../QuestionEditModal/common/QuestionForm";
import StandardSet from "../QuestionEditModal/common/StandardSet/StandardSet";
import { StandardSelectWrapper } from "./styled";

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
    alignment: [
      {
        curriculum: "",
        curriculumId: "",
        domains: [],
        grades: [],
        standards: [],
        subject: ""
      }
    ]
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
      <CustomModalStyled
        visible={visible}
        title="Add Bulk"
        onCancel={onCancel}
        footer={[
          <ModalFooter marginTop="35px">
            <EduButton isGhost onClick={onCancel}>
              Cancel
            </EduButton>
            <EduButton onClick={this.handleApply}>Apply</EduButton>
          </ModalFooter>
        ]}
      >
        <ModalWrapper width="100%">
          <QuestionFormWrapper>
            <Row gutter={20}>
              <Col span={6}>
                <FieldLabel>Number</FieldLabel>
                <NumberInputStyled min={1} value={number} onChange={this.handleChange("number")} />
              </Col>
              <Col span={18}>
                <FieldLabel>Type of Question</FieldLabel>
                <SelectInputStyled
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
                </SelectInputStyled>
              </Col>
            </Row>
          </QuestionFormWrapper>

          <StandardSelectWrapper>
            <StandardSet
              alignment={alignment}
              onUpdate={data => this.setState({ alignment: data.alignment })}
              isDocBased
              showIconBrowserBtn
            />
            <Row style={{ marginTop: "10px" }} gutter={20}>
              <Col md={12}>
                <FieldLabel>DOK</FieldLabel>
                <SelectInputStyled
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
                </SelectInputStyled>
              </Col>
              <Col md={12}>
                <FieldLabel>Difficulty</FieldLabel>
                <SelectInputStyled
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
                </SelectInputStyled>
              </Col>
            </Row>
          </StandardSelectWrapper>
        </ModalWrapper>
      </CustomModalStyled>
    );
  }
}
