import React, { Component } from "react";
import { Button, Form } from "antd";
import { StyledInput } from "./styled";
import { ConfirmationModal } from "../../../../src/components/common/ConfirmationModal";
import { borders, backgrounds, themeColor, whiteSmoke, numBtnColors, white } from "@edulastic/colors";
import styled from "styled-components";

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
      <ConfirmationModal
        visible={modalVisible}
        title="Archive Class(es)"
        onOk={this.onArchiveClass}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button onClick={this.onCloseModal} ghost type="primary">
            No, Cancel
          </Button>,
          <YesButton onClick={this.onArchiveClass} disabled={textArchive.toLowerCase() !== "archive"}>
            Yes, Archive >
          </YesButton>
        ]}
      >
        <ModalBody>
          <span>Are you sure you want to archive the following class(es)?</span>
          {classNames}
          <span>
            If Yes, type <LightGreenspan>ARCHIVE</LightGreenspan> in the space given below and proceed.
          </span>
          <FormItem>
            <TextInput
              value={textArchive}
              onChange={this.onChangeInput}
              // here paste is not allowed, and user has to manually type in ARCHIVE
              onPaste={evt => evt.preventDefault()}
            />
          </FormItem>
        </ModalBody>
      </ConfirmationModal>
    );
  }
}

export default ArchiveClassModal;

const LightGreenspan = styled.span`
  color: ${themeColor};
`;

const YesButton = styled(Button)`
  color: ${props => (props.disabled ? "rgba(0, 0, 0, 0.25)" : white)} !important;
  background-color: ${props => (props.disabled ? whiteSmoke : themeColor)} !important;
  border-color: ${props => (props.disabled ? numBtnColors.borderColor : themeColor)} !important;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FormItem = styled(Form.Item)`
  width: 80%;
  display: inline-block;
  margin: 10px;
  .ant-input {
    height: 33px;
    background: ${backgrounds.primary};
    border: 1px solid ${borders.secondary};
    padding: 10px 24px;
  }
`;

const TextInput = styled(StyledInput)`
  text-align: center;
  width: 100% !important;
`;
