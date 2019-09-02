import React from "react";
import { Button } from "antd";
import { ConfirmationModal } from "./ConfirmationModal";

const ConfirmRegradeModal = ({ visible, onCancel, onCancelRegrade, onOk }) => (
  <ConfirmationModal
    centered
    visible={visible}
    onCancel={onCancel}
    title="Regrade"
    footer={[
      <Button ghost onClick={onCancelRegrade}>
        Skip Regrade
      </Button>,
      <Button color="primary" onClick={onOk}>
        Regrade
      </Button>
    ]}
  >
    There are some ongoing assignments linked to the test, would you like to apply the changes?
  </ConfirmationModal>
);

export default ConfirmRegradeModal;
