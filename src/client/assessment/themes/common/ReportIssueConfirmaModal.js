import React from "react";
import { Button } from "antd";
import styled from "styled-components";
import { ConfirmationModal } from "../../../author/src/components/common/ConfirmationModal";
import { themeColor, white } from "@edulastic/colors";
import { EduButton } from "@edulastic/common";

const ReportIssueConfirmaModal = ({ visible, toggleModal, handleResponse }) => {
  return (
    <ConfirmationModal
      centered
      textAlign="left"
      visible={visible}
      footer={null}
      textAlign={"center"}
      onCancel={() => toggleModal(false)}
    >
      <ModalBody>
        <Heading>Are you sure there is a problem with this question?</Heading>
        <span>
          Click{" "}
          <EduButton height="26px" onClick={() => handleResponse(true)}>
            Yes
          </EduButton>{" "}
          to report this issue, or{" "}
          <EduButton height="26px" onClick={() => handleResponse(false)}>
            Cancel
          </EduButton>{" "}
          to go back to the question.
        </span>
      </ModalBody>
    </ConfirmationModal>
  );
};

export default ReportIssueConfirmaModal;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-weight: 600;
`;

const Heading = styled.h3`
  font-weight: 600;
  margin-bottom: 1em;
`;

const StyledButton = styled(Button)`
  color: ${white};
  background-color: ${themeColor};
  border-color: ${themeColor};
  margin: 0px 5px;
  height: 26px;
  &:hover,
  &:focus {
    color: ${themeColor};
  }
`;
