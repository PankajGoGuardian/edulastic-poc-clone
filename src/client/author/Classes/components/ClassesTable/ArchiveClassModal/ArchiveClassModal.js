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
    const { modalVisible, classNames, t } = this.props;
    const { textArchive } = this.state;

    return (
      <ConfirmationModal
        visible={modalVisible}
        title={t("class.components.archiveclass.title")}
        onOk={this.onArchiveClass}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button onClick={this.onCloseModal} ghost type="primary">
            {t("class.components.archiveclass.nocancel")}
          </Button>,
          <YesButton onClick={this.onArchiveClass} disabled={textArchive.toLowerCase() !== "archive"}>
            {t("class.components.archiveclass.yesarchive")}
          </YesButton>
        ]}
      >
        <ModalBody>
          <span>
            {t("common.modalConfirmationText1")} {t("class.components.archiveclass.classes")}
          </span>
          {classNames}
          <span>
            {t("common.modalConfirmationText2")}{" "}
            <LightGreenspan>{t("class.components.archiveclass.archivetext")}</LightGreenspan>{" "}
            {t("common.modalConfirmationText2")}
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
