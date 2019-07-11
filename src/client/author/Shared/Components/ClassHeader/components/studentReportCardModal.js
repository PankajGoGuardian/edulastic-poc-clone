import React from "react";
import styled from "styled-components";
import { Modal, Button } from "antd";
import qs from "qs";
import { white, themeColor } from "@edulastic/colors";
import { StudentReportCardPrintPreview } from "./StudentReportCardPrintPreview";

const StudentReportCardModal = props => {
  const {
    className,
    title,
    onOk,
    onCancel,
    visible,
    columnsFlags,
    groupId,
    selectedStudentsKeys = [],
    assignmentId
  } = props;

  const query = qs.stringify({ selectedStudentsKeys, columnsFlags });

  const onSaveAsPdf = () => {
    onOk();
  };

  const onPrintReport = event => {
    onOk();
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onPrintReport}
      onCancel={onCancel}
      footer={null}
      className={className}
      width={"85%"}
    >
      <div className="model-buttons">
        <Button key="saveAsPdf" type="primary" onClick={onSaveAsPdf}>
          SAVE AS PDF
        </Button>
        <a
          href={`${
            window.location.origin
          }/author/classboard-student-report-card-print-preview/printpreview/${assignmentId}/${groupId}?${query}`}
          target="_blank"
        >
          <Button key="printReport" onClick={onPrintReport}>
            PRINT REPORT
          </Button>
        </a>
      </div>
      <StudentReportCardPrintPreview
        visible={visible}
        columnsFlags={columnsFlags}
        groupId={groupId}
        selectedStudentsKeys={selectedStudentsKeys}
        mode="web"
      />
    </Modal>
  );
};

const StyledStudentReportCardModal = styled(StudentReportCardModal)`
  .ant-modal-content {
    background-color: transparent;
    .ant-modal-close {
      display: none;
    }
    .model-buttons {
      display: flex;
      justify-content: space-between;
      margin: 8px;
      button {
        height: 40px;
        background-color: ${white};
        color: ${themeColor};
        border: none;
        border-radius: 5px;
        font-weight: 600;
      }
    }
  }
`;

export { StyledStudentReportCardModal as StudentReportCardModal };
