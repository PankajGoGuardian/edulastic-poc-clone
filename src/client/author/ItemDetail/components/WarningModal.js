import { EduButton } from "@edulastic/common";
import React from "react";
import { ConfirmationModal } from "../../src/components/common/ConfirmationModal";

const WarningModal = ({ visible = false, proceedPublish }) => {
  const Footer = [
    <EduButton isGhost onClick={() => proceedPublish(false)}>
      CANCEL
    </EduButton>,
    <EduButton onClick={() => proceedPublish(true)}>PROCEED</EduButton>
  ];

  return (
    <ConfirmationModal
      centered
      visible={visible}
      footer={Footer}
      textAlign="center"
      onCancel={() => proceedPublish(false)}
    >
      <p>
        <b>Item is not associated with any standard. Would you like to continue?</b>
      </p>
    </ConfirmationModal>
  );
};

export default WarningModal;
