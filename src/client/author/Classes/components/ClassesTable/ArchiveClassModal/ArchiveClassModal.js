import { themeColor } from "@edulastic/colors";
import { EduButton, TextInputStyled } from "@edulastic/common";
import { Form } from "antd";
import React, { Component } from "react";
import styled from "styled-components";
import { ConfirmationModal } from "../../../../src/components/common/ConfirmationModal";

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
        centered
        footer={[
          <EduButton onClick={this.onCloseModal} isGhost type="primary">
            {t("class.components.archiveclass.nocancel")}
          </EduButton>,
          <EduButton onClick={this.onArchiveClass} disabled={textArchive.toLowerCase() !== "archive"}>
            {t("class.components.archiveclass.yesarchive")}
          </EduButton>
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
            <TextInputStyled
              align="center"
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

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FormItem = styled(Form.Item)`
  width: 80%;
  display: inline-block;
  margin: 10px 0px 0px;
`;
