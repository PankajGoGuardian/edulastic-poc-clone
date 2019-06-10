import React, { Component } from "react";
import { Row, Col, Button, Modal } from "antd";
import { StyledCol, StyledP, StyledInput, LightBlueSpan } from "./styled";

class ArchiveClassModal extends Component {
  constructor(props) {
    super(props);
    this.state = { textArchive: "" };
  }

  onCloseModal = () => {
    this.props.closeModal();
  };

  onChangeInput = e => {
    this.setState({ textArchive: e.target.value });
  };

  onArchiveClass = () => {
    this.props.archiveClass();
  };

  render() {
    const { modalVisible, classNames } = this.props;
    const { textArchive } = this.state;

    return (
      <Modal
        visible={modalVisible}
        title="Archive Class(es)"
        onOk={this.onArchiveClass}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button onClick={this.onCloseModal} ghost type="primary">
            No, Cancel
          </Button>,
          <Button type="primary" onClick={this.onArchiveClass} disabled={textArchive.toLowerCase() !== "archive"}>
            Yes, Archive >
          </Button>
        ]}
      >
        <Row>
          <Col span={24}>
            <StyledP>Are you sure you want to archive the following class(es)?</StyledP>
            {classNames}
            <StyledP>
              If Yes type <LightBlueSpan>ARCHIVE</LightBlueSpan> in the space given below and proceed.
            </StyledP>
          </Col>
        </Row>
        <Row>
          <StyledCol span={24}>
            <StyledInput
              value={textArchive}
              onChange={this.onChangeInput}
              // here paste is not allowed, and user has to manually type in ARCHIVE
              onPaste={evt => evt.preventDefault()}
            />
          </StyledCol>
        </Row>
      </Modal>
    );
  }
}

export default ArchiveClassModal;
