import React, { Component } from "react";
import { Form, Col, Select, Button, Modal, Input } from "antd";
const Option = Select.Option;

import { StyledRow, SubjectContainer, SubjectSelect } from "./styled";
import CheckboxGroup from "antd/lib/checkbox/Group";

class StandardSetsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selSubject: "",
      searchStr: "",
      selectedStandards: []
    };
  }

  onConfirm = () => {
    const { selectedStandards } = this.state;
    this.props.saveMyStandardsSet(selectedStandards);
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  changeStandards = e => {
    this.setState({
      selectedStandards: e
    });
  };

  changeSubject = e => {
    this.setState({ selSubject: e });
  };

  changeSearch = e => {
    this.setState({ searchStr: e.target.value });
  };

  render() {
    const { standardList, interestedStaData, modalVisible } = this.props;
    const { selSubject, searchStr } = this.state;

    let filteredStandardList = standardList.filter(item => item.subject === selSubject || selSubject === "");
    filteredStandardList = filteredStandardList.filter(item => item.curriculum.indexOf(searchStr) != -1);
    const standardsSetNames = filteredStandardList.map(row => {
      return row.curriculum;
    });

    let selectedStandards = [];
    if (interestedStaData != null) {
      if (interestedStaData.hasOwnProperty("curriculums")) {
        selectedStandards = interestedStaData.curriculums.map(row => {
          return row.name;
        });
      }
    }

    return (
      <Modal
        visible={modalVisible}
        title="My Standard Sets"
        onOk={this.onConfirm}
        onCancel={this.onCloseModal}
        footer={[
          <Button type="primary" key="submit" onClick={this.onConfirm}>
            Confirm
          </Button>
        ]}
      >
        <StyledRow>
          <Col span={24}>
            <SubjectSelect placeholder="Select Subject" onChange={this.changeSubject}>
              <Option value="Mathematics">Mathematics</Option>
              <Option value="ELA">ELA</Option>
              <Option value="Science">Science</Option>
              <Option value="Social Studies">Social Studies</Option>
              <Option value="Other Subjects">Other Subjects</Option>
            </SubjectSelect>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col span={24}>
            <Input onChange={this.changeSearch} placeholder="Search by name" />
          </Col>
        </StyledRow>
        <StyledRow>
          <Col span={24}>
            <SubjectContainer>
              <CheckboxGroup
                onChange={this.changeStandards}
                options={standardsSetNames}
                defaultValue={selectedStandards}
              />
            </SubjectContainer>
          </Col>
        </StyledRow>
      </Modal>
    );
  }
}

const StandardSetsModalForm = Form.create()(StandardSetsModal);
export default StandardSetsModal;
