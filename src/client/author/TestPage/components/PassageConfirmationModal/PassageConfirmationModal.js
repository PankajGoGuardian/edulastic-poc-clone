import React from "react";
import { Button } from "antd";
import { ConfirmationModal } from "../../../../author/src/components/common/ConfirmationModal";

const PassageConfirmationModal = ({ visible, togglePassageConfirmationModal, itemsCount, handleResponse }) => {
  const Footer = [
    <Button ghost onClick={() => handleResponse(false)}>
      No, I’ll select
    </Button>,
    <Button onClick={() => handleResponse(true)}>Yes, Add all</Button>
  ];

  return (
    <ConfirmationModal
      centered
      textAlign="left"
      visible={visible}
      footer={Footer}
      textAlign={"center"}
      onCancel={() => togglePassageConfirmationModal(false)}
    >
      <p>
        <b>{`There are ${itemsCount} items in this passage. Would you like to add them to your test`}</b>
      </p>
    </ConfirmationModal>
  );
};

export default PassageConfirmationModal;
