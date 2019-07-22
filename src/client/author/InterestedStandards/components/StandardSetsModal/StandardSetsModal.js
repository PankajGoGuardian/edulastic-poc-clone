import React, { Component } from "react";
import { Form, Col, Select, Button, Modal, Input, Checkbox } from "antd";
const Option = Select.Option;

import { StyledRow, SubjectContainer, SubjectSelect } from "./styled";
import { StyledCheckbox } from "../Container/styled";
import { FlexContainer } from "../../../../assessment/themes/common";

class StandardSetsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selSubject: "",
      searchStr: "",
      updatedPrevStandards: false,
      selectedStandards: []
    };
  }

  componentDidUpdate(p, s) {
    const { interestedStaData } = this.props;
    const { updatedPrevStandards } = this.state;
    let selectedStandards = [];
    if (interestedStaData != null) {
      if (
        interestedStaData.hasOwnProperty("curriculums") &&
        interestedStaData.curriculums.length > 0 &&
        !updatedPrevStandards
      ) {
        selectedStandards = interestedStaData.curriculums.map(row => {
          return row.name;
        });
        this.setState({ selectedStandards, updatedPrevStandards: true });
      }
    }
  }

  onConfirm = () => {
    const { selectedStandards } = this.state;
    this.props.saveMyStandardsSet(selectedStandards);
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  changeStandards = e => {
    const { selectedStandards } = this.state;
    if (selectedStandards.includes(e)) {
      this.setState(prevState => ({ selectedStandards: prevState.selectedStandards.filter(o => o !== e) }));
    } else {
      this.setState(prevState => ({ selectedStandards: [...prevState.selectedStandards, e] }));
    }
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
    filteredStandardList = filteredStandardList.filter(
      item => item.curriculum.toLowerCase().indexOf(searchStr.toLowerCase()) != -1
    );
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
        maskClosable={false}
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
              {standardsSetNames.map(standardSetName => (
                <FlexContainer>
                  <StyledCheckbox
                    onChange={() => this.changeStandards(standardSetName)}
                    checked={this.state.selectedStandards.includes(standardSetName)}
                    key={standardSetName}
                  >
                    {standardSetName}
                  </StyledCheckbox>
                </FlexContainer>
              ))}
            </SubjectContainer>
          </Col>
        </StyledRow>
      </Modal>
    );
  }
}

const StandardSetsModalForm = Form.create()(StandardSetsModal);
export default StandardSetsModal;
