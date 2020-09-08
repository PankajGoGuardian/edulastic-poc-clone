import React from "react";
import { EduButton } from "@edulastic/common";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";

const PassageConfirmationModal = ({ visible, closeModal, itemsCount, handleResponse, removing }) => {
  const Footer = [
    <EduButton isGhost onClick={() => handleResponse(false)}>
      No, I’ll select
    </EduButton>,
    <EduButton onClick={() => handleResponse(true)}>Yes, {removing?`Remove`:`Add`} all</EduButton>
  ];

  return (
    <ConfirmationModal centered textAlign="left" visible={visible} footer={Footer} onCancel={closeModal}>
      <p>
        <b>{`There are ${itemsCount} items in this passage. Would you like to ${removing?`remove`:`add`} them ${removing?`from`:`to`} your test`}</b>
      </p>
    </ConfirmationModal>
  );
};

export default PassageConfirmationModal;
