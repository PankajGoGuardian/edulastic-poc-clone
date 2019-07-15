import React from "react";
import { Button } from "antd";
import { ConfirmationModal } from "../../src/components/common/ConfirmationModal";

const WarningModal = ({ visible = false, proceedPublish }) => {
  const Footer = [
    <Button ghost onClick={() => proceedPublish(false)}>
      CANCEL
    </Button>,
    <Button onClick={() => proceedPublish(true)}>PROCEED</Button>
  ];

  return (
    <ConfirmationModal
      centered
      textAlign="left"
      visible={visible}
      footer={Footer}
      textAlign={"center"}
      onCancel={() => proceedPublish(false)}
    >
      <p>
        <b>Item is not associated with any standard. Would you like to continue?</b>
      </p>
    </ConfirmationModal>
  );
};

export default WarningModal;
