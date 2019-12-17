import React from "react";
import { Button } from "antd";
import { ConfirmationModal } from "./ConfirmationModal";
import { connect } from "react-redux";

const ConfirmCancelTestEditModal = ({ onClose, onCancel, onOk, showCancelPopup }) => (
  <ConfirmationModal
    centered
    visible={showCancelPopup}
    onCancel={onClose}
    title="Cancel"
    footer={[
      <Button ghost onClick={onCancel}>
        Cancel
      </Button>,
      <Button color="primary" onClick={onOk}>
        Yes, Proceed
      </Button>
    ]}
  >
    All the changes done will be discarded. Are you sure you want to proceed?
  </ConfirmationModal>
);

export default connect(null)(ConfirmCancelTestEditModal);
