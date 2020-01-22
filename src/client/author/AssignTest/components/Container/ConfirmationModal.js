import React, { useState } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { CSVLink } from "react-csv";
import { IconDownload } from "@edulastic/icons";
import {
  getHasCommonStudensSelector,
  toggleHasCommonAssignmentsPopupAction,
  saveAssignmentAction,
  getCommonStudentsSelector
} from "../../../TestPage/components/Assign/ducks";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";
import { Paragraph } from "./styled";

const ProceedConfirmation = ({
  hasCommonStudents,
  toggleCommonAssignmentsConfirmation,
  saveAssignment,
  assignment,
  commonStudents
}) => {
  const [saving, setSavingState] = useState(false);

  const onProceed = () => {
    setSavingState(true);
    saveAssignment({ ...assignment, allowCommonStudents: true });
  };

  const onCancel = () => {
    if (saving) return;
    toggleCommonAssignmentsConfirmation(false);
  };

  const Footer = [
    <Button ghost disabled={saving} data-cy="noDuplicate" onClick={onCancel}>
      CANCEL
    </Button>,
    <Button data-cy="duplicate" onClick={onProceed} loading={saving}>
      PROCEED
    </Button>
  ];

  const structuredCommonStudents = commonStudents.flatMap(student => {
    return student.classes.map(clazz => {
      return {
        studentUserName: student.username,
        studentName: student.name,
        classId: clazz._id,
        clasName: clazz.name,
        ...clazz
      };
    });
  });

  const headers = [
    { label: "Student Name", key: "studentName" },
    { label: "User Name", key: "studentUserName" },
    { label: "Class Code", key: "code" },
    { label: "Class Name", key: "clasName" },
    { label: "Teacher Name", key: "teacherName" }
  ];

  return (
    <ConfirmationModal
      maskClosable={false}
      textAlign={"left"}
      title="Assign Assessment"
      centered
      visible={hasCommonStudents}
      footer={Footer}
      onCancel={() => toggleCommonAssignmentsConfirmation(false)}
    >
      <Paragraph>This assessment will be assigned to {commonStudents.length} student(s) multiple times.</Paragraph>
      <Paragraph>
        <b>Do you want to continue?</b>
      </Paragraph>
      <Paragraph alignItems="right">
        <CSVLink
          data={structuredCommonStudents}
          filename={`name_match_result_.csv`}
          seperator=","
          headers={headers}
          target="_blank"
        >
          <Button>
            <IconDownload />
            &nbsp; Download list
          </Button>
        </CSVLink>
      </Paragraph>
    </ConfirmationModal>
  );
};

export default connect(
  state => ({
    hasCommonStudents: getHasCommonStudensSelector(state),
    commonStudents: getCommonStudentsSelector(state)
  }),
  {
    toggleCommonAssignmentsConfirmation: toggleHasCommonAssignmentsPopupAction,
    saveAssignment: saveAssignmentAction
  }
)(ProceedConfirmation);
