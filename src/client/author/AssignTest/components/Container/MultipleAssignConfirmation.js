import React, { useState } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import {
  saveAssignmentAction,
  getHasDuplicateAssignmentsSelector,
  toggleHasDuplicateAssignmentPopupAction
} from "../../../TestPage/components/Assign/ducks";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";
import { Paragraph } from "./styled";
import { getTestSelector, getPlaylistSelector } from "../../../TestPage/ducks";

const MultipleAssignConfirmation = ({
  hasDuplicateAssignments,
  toggleHasDuplicateAssignmentPopup,
  entity,
  saveAssignment,
  assignment
}) => {
  const [saving, setSavingState] = useState(false);

  const onProceed = () => {
    setSavingState(true);
    //allowCommonStudents has to be true for the second time as we have to avoid
    saveAssignment({ ...assignment, allowCommonStudents: true, allowDuplicates: true });
  };

  const onRemoveDuplicates = () => {
    setSavingState(true);
    saveAssignment({ ...assignment, allowCommonStudents: true, removeDuplicates: true });
  };

  const onCancel = () => {
    toggleHasDuplicateAssignmentPopup(false);
  };

  const Footer = [
    <Button ghost data-cy="duplicate" onClick={onProceed} disabled={saving}>
      Proceed with duplicate
    </Button>,
    <Button disabled={saving} data-cy="noDuplicate" onClick={onRemoveDuplicates}>
      Remove duplicates
    </Button>
  ];

  return (
    <ConfirmationModal
      maskClosable={false}
      textAlign={"left"}
      title="Warning"
      centered
      visible={hasDuplicateAssignments}
      footer={Footer}
      onCancel={onCancel}
    >
      <Paragraph>
        {entity.title} is already assigned to some of the student(s) you have selected. Student(s) who were assigned
        earlier will receive a duplicate copy of this assessment.
      </Paragraph>
      <Paragraph>Please select if the student(s) should receive a duplicate assessment.</Paragraph>
    </ConfirmationModal>
  );
};

export default connect(
  (state, ownProps) => ({
    hasDuplicateAssignments: getHasDuplicateAssignmentsSelector(state),
    entity: ownProps.isPlaylist ? getPlaylistSelector(state) : getTestSelector(state)
  }),
  {
    saveAssignment: saveAssignmentAction,
    toggleHasDuplicateAssignmentPopup: toggleHasDuplicateAssignmentPopupAction
  }
)(MultipleAssignConfirmation);
