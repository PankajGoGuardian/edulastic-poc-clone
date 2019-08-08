import React, { useEffect } from "react";
import { Modal } from "antd";

const EditTestModal = ({ visible, onCancel, onOk, isUsed = false }) => (
  <Modal visible={visible} onCancel={onCancel} onOk={onOk} okText="Proceed" title="Edit">
    {isUsed
      ? `This test is already assigned to students. Edit will create a new version of this assessment and other users won’t
    be able to view this assessment until you publish it. Do you wish to proceed?`
      : `You are about to edit an assessment that has already been published. If you wish to edit this assessment,
     we will move this assessment to draft status. Do you want to proceed?`}
  </Modal>
);

export default EditTestModal;
