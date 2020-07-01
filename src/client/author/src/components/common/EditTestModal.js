import React, { useEffect } from "react";
import { ConfirmationModal } from "./ConfirmationModal";
import { EduButton } from "@edulastic/common";

const EditTestModal = ({ visible, onCancel, onOk, isUsed = false }) => (
  <ConfirmationModal
    centered
    visible={visible}
    onCancel={onCancel}
    title="Edit Test"
    footer={[
      <EduButton isGhost data-cy="CANCEL" height="40px" onClick={onCancel}>
        CANCEL
      </EduButton>,
      <EduButton height="40px" data-cy="PROCEED" onClick={onOk}>
        PROCEED
      </EduButton>
    ]}
  >
    {isUsed
      ? `This test is already assigned to students. Edit will create a new version of this test and other users won’t
    be able to view this test until you publish it. Do you wish to proceed?`
      : `You are about to edit a test that has already been published. If you wish to edit this test,
     we will move this test to draft status. Do you want to proceed?`}
  </ConfirmationModal>
);

export default EditTestModal;
