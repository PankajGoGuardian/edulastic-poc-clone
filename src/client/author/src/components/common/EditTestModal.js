import React, { useEffect } from "react";
import { Modal } from "antd";

const EditTestModal = ({ visible, onCancel, onOk }) => (
  <Modal visible={visible} onCancel={onCancel} onOk={onOk} okText="Proceed" title="Edit">
    This test is already assigned to students. Edit will create a new version of this assessment and other users won’t
    be able to view this assessment until you publish it. Do you wish to proceed?
  </Modal>
);

export default EditTestModal;
