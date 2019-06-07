import React, { Component } from "react";
import { Row, Col, Button, Modal } from "antd";
import {
  StyledCol,
  StyledP,
  StyledClassName,
  StyledInput,
  LightBlueSpan
} from "../../../../Classes/components/ClassesTable/ArchiveClassModal/styled";

class DeactivateSchoolModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textDeactivate: "" };
  }

  onCloseModal = () => {
    this.props.closeModal();
  };

  onChangeInput = e => {
    this.setState({ textDeactivate: e.target.value });
  };
  onDeactivateSchool = () => {
    this.props.deactivateSchool();
  };

  render() {
    const { modalVisible, schoolData } = this.props;
    const { textDeactivate } = this.state;
    const schoolName = schoolData.map(row => <StyledClassName>{row.name}</StyledClassName>);

    return (
      <Modal
        visible={modalVisible}
        title="Deactivate School(s)"
        onOk={this.onDeactivateSchool}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button onClick={this.onCloseModal} ghost type="primary">
            No, Cancel
          </Button>,
          <Button
            type="primary"
            onClick={this.onDeactivateSchool}
            disabled={textDeactivate.toLowerCase() !== "deactivate"}
          >
            Yes, Deactivate >
          </Button>
        ]}
      >
        <Row>
          <Col span={24}>
            <StyledP>Are you sure you want to deactivate the following school(s)?</StyledP>
            {schoolName}
            <StyledP>
              If Yes type <LightBlueSpan>DEACTIVATE</LightBlueSpan> in the space given below and proceed.
            </StyledP>
          </Col>
        </Row>
        <Row>
          <StyledCol span={24}>
            <StyledInput value={textDeactivate} onChange={this.onChangeInput} />
          </StyledCol>
        </Row>
      </Modal>
    );
  }
}

export default DeactivateSchoolModal;
