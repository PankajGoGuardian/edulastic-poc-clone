import React from "react";
import { Button } from "antd";
import { ConfirmationModal } from "./ConfirmationModal";
import { connect } from "react-redux";

const ConfirmRegradeModal = ({ visible, onCancel, onCancelRegrade, onOk, loading, creating }) => (
  <ConfirmationModal
    centered
    visible={visible}
    onCancel={onCancel}
    title="Regrade"
    footer={[
      <Button ghost loading={loading || creating} disabled={loading || creating} onClick={onCancelRegrade}>
        Skip Regrade
      </Button>,
      <Button color="primary" loading={loading || creating} disabled={loading || creating} onClick={onOk}>
        Regrade
      </Button>
    ]}
  >
    There are some ongoing assignments linked to the test, would you like to apply the changes?
  </ConfirmationModal>
);

export default connect(state => ({
  loading: state?.tests?.loading,
  creating: state?.tests?.creating
}))(ConfirmRegradeModal);
