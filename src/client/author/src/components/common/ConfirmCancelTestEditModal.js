import React from 'react'
import Button from "antd/es/button";
import { connect } from 'react-redux'
import { EduButton } from '@edulastic/common'
import { ConfirmationModal } from './ConfirmationModal'

const ConfirmCancelTestEditModal = ({
  onClose,
  onCancel,
  onOk,
  showCancelPopup,
}) => (
  <ConfirmationModal
    centered
    visible={showCancelPopup}
    onCancel={onClose}
    title="Cancel"
    footer={[
      <EduButton height="40px" isGhost onClick={onCancel}>
        Cancel
      </EduButton>,
      <EduButton height="40px" onClick={onOk}>
        Yes, Proceed
      </EduButton>,
    ]}
  >
    All the changes done will be discarded. Are you sure you want to proceed?
  </ConfirmationModal>
)

export default connect(null)(ConfirmCancelTestEditModal)
