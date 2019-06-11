import React, { Component } from "react";
import { Row, Col, Button, Modal } from "antd";
import PropTypes from "prop-types";
import { StyledCol, StyledP, StyledInput, LightBlueSpan } from "./styled";

class TypeToConfirmModal extends Component {
  state = {
    textValue: ""
  };

  onCloseModal = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  onChangeInput = e => {
    this.setState({ textValue: e.target.value });
  };

  render() {
    const { modalVisible, title, handleOnOkClick, wordToBeTyped, primaryLabel, secondaryLabel } = this.props;
    const { textValue } = this.state;

    return (
      <Modal
        visible={modalVisible}
        title={title}
        onOk={handleOnOkClick}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button onClick={this.onCloseModal} ghost type="primary">
            No, Cancel
          </Button>,
          <Button
            type="primary"
            onClick={handleOnOkClick}
            disabled={textValue.toLowerCase() !== wordToBeTyped.toLowerCase()}
          >
            {`Yes, ${title} >`}
          </Button>
        ]}
      >
        <Row>
          <Col span={24}>
            <StyledP>{primaryLabel}</StyledP>
            {secondaryLabel}
            <StyledP>
              If Yes type <LightBlueSpan>{wordToBeTyped}</LightBlueSpan> in the space given below and proceed.
            </StyledP>
          </Col>
        </Row>
        <Row>
          <StyledCol span={24}>
            <StyledInput
              value={textValue}
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

export default TypeToConfirmModal;

TypeToConfirmModal.defaultProps = {
  primaryLabel: "Are you sure you want to archive the following class(es)?",
  modalVisible: false,
  secondaryLabel: ""
};

TypeToConfirmModal.propTypes = {
  modalVisible: PropTypes.bool,
  title: PropTypes.string.isRequired,
  handleOnOkClick: PropTypes.func.isRequired,
  wordToBeTyped: PropTypes.string.isRequired,
  primaryLabel: PropTypes.string,
  secondaryLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  closeModal: PropTypes.func.isRequired
};
