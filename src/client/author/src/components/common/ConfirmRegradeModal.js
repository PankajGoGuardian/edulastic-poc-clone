import React from "react";
import { Button } from "antd";
import { ConfirmationModal } from "./ConfirmationModal";
import { connect } from "react-redux";
import { EduButton } from "@edulastic/common";

const ConfirmRegradeModal = ({ visible, onCancel, onCancelRegrade, onOk, loading, creating }) => (
  <ConfirmationModal
    centered
    visible={visible}
    onCancel={onCancel}
    title="Regrade"
    footer={[
      <EduButton
        height="40px"
        isGhost
        loading={loading || creating}
        disabled={loading || creating}
        onClick={onCancelRegrade}
      >
        Skip Regrade
      </EduButton>,
      <EduButton height="40px" loading={loading || creating} disabled={loading || creating} onClick={onOk}>
        Regrade
      </EduButton>
    ]}
  >
    There are some ongoing assignments linked to the test, would you like to apply the changes?
  </ConfirmationModal>
);

export default connect(state => ({
  loading: state?.tests?.loading,
  creating: state?.tests?.creating
}))(ConfirmRegradeModal);
