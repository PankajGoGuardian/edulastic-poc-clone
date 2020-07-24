import { CheckboxLabel, CustomModalStyled, EduButton, SelectInputStyled, TextInputStyled } from "@edulastic/common";
import { Col, Select } from "antd";
import { keyBy } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FlexContainer } from "../../../../assessment/themes/common";
import { getUserRole } from "../../../src/selectors/user";
import { selectsData } from "../../../TestPage/components/common";
import { StyledRow, SubjectContainer } from "./styled";

const Option = Select.Option;

class StandardSetsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selSubject: "",
      searchStr: "",
      updatedPrevStandards: false,
      selectedStandards: []
    };
  }

  // setting the previous standards first time
  static getDerivedStateFromProps(props, prevState) {
    const { interestedStaData } = props;
    const { updatedPrevStandards } = prevState;
    let selectedStandards = [];
    if (
      interestedStaData != null &&
      interestedStaData.hasOwnProperty("curriculums") &&
      interestedStaData.curriculums.length > 0 &&
      !updatedPrevStandards
    ) {
      selectedStandards = interestedStaData.curriculums.map(row => row.name);
      return { selectedStandards, updatedPrevStandards: true };
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
    const { standardList, interestedStaData, modalVisible, role } = this.props;
    const { selSubject, searchStr, selectedStandards } = this.state;

    const filteredStandardList = standardList.filter(
      item =>
        (item.subject === selSubject || selSubject === "") &&
        item.curriculum.toLowerCase().indexOf(searchStr.toLowerCase()) != -1
    );
    const selectedStandardById = keyBy(interestedStaData.curriculums, "_id");

    const standardsSetNames = filteredStandardList.map(row => ({
      name: row.curriculum,
      _id: row._id
    }));

    return (
      <CustomModalStyled
        visible={modalVisible}
        title="My Standard Sets"
        onOk={this.onConfirm}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <EduButton type="primary" key="submit" onClick={this.onConfirm}>
            Confirm
          </EduButton>
        ]}
      >
        <StyledRow>
          <Col span={24}>
            <SelectInputStyled
              placeholder="Select Subject"
              onChange={this.changeSubject}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {selectsData.allSubjects.map(el => (
                <Option key={el.value} value={el.value}>
                  {el.text}
                </Option>
              ))}
            </SelectInputStyled>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col span={24}>
            <TextInputStyled onChange={this.changeSearch} placeholder="Search by name" />
          </Col>
        </StyledRow>
        <StyledRow>
          <Col span={24}>
            <SubjectContainer>
              {standardsSetNames.map(standard => (
                <FlexContainer>
                  <CheckboxLabel
                    onChange={() => this.changeStandards(standard.name)}
                    checked={selectedStandards.includes(standard.name)}
                    key={standard.name}
                    disabled={selectedStandardById[standard._id]?.orgType === "district" && role === "school-admin"}
                  >
                    {standard.name}
                  </CheckboxLabel>
                </FlexContainer>
              ))}
            </SubjectContainer>
          </Col>
        </StyledRow>
      </CustomModalStyled>
    );
  }
}

export default connect(state => ({
  role: getUserRole(state)
}))(StandardSetsModal);
