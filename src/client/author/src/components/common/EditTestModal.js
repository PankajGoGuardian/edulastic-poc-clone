import React, { useEffect } from "react";
import { Button } from "antd";
import { ConfirmationModal } from "./ConfirmationModal";

const EditTestModal = ({ visible, onCancel, onOk, isUsed = false }) => (
  <ConfirmationModal
    centered
    visible={visible}
    onCancel={onCancel}
    title="Edit"
    footer={[
      <Button ghost onClick={onCancel}>
        CANCEL
      </Button>,
      <Button color="primary" onClick={onOk}>
        PROCEED
      </Button>
    ]}
  >
    {isUsed
      ? `This test is already assigned to students. Edit will create a new version of this assessment and other users won’t
    be able to view this assessment until you publish it. Do you wish to proceed?`
      : `You are about to edit an assessment that has already been published. If you wish to edit this assessment,
     we will move this assessment to draft status. Do you want to proceed?`}
  </ConfirmationModal>
);

export default EditTestModal;
