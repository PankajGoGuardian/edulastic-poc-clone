import React from "react";
import { Table, Spin } from "antd";
import styled from "styled-components";
import { ConfirmationModal } from "../../../../src/components/common/ConfirmationModal";

const columns = [
  {
    title: "Assessment Name",
    key: "assessmentName",
    dataIndex: "assessmentName"
  },
  {
    title: "Questions",
    key: "questions",
    dataIndex: "questions"
  },
  {
    title: "Standard based score",
    key: "standardBasedScore",
    dataIndex: "standardBasedScore"
  },
  {
    title: "Raw score",
    key: "maxScore",
    dataIndex: "maxScore",
    render: (_, record) => (
      <span>
        {record.obtainedScore}/{record.maxScore}
      </span>
    )
  },
  {
    title: "Score (%)",
    key: "score",
    dataIndex: "score",
    render: data => <span>{data}%</span>
  }
];

const StudentAssignmentModal = ({
  showModal,
  closeModal,
  studentAssignmentsData,
  studentName,
  standardName,
  loadingStudentStandard
}) => {
  const Title = [<Heading>{studentName}</Heading>];

  return (
    <ConfirmationModal
      title={Title}
      centered
      textAlign="left"
      visible={showModal}
      textAlign={"center"}
      onCancel={closeModal}
      footer={null}
    >
      <ModalBody>
        {loadingStudentStandard === "failed" ? (
          <Error>Unable to fetch data.</Error>
        ) : loadingStudentStandard ? (
          <Spin />
        ) : (
          <StyledTable
            dataSource={studentAssignmentsData}
            columns={columns}
            title={() => <TableHeading>{standardName}</TableHeading>}
            pagination={false}
          />
        )}
      </ModalBody>
    </ConfirmationModal>
  );
};

export default StudentAssignmentModal;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Heading = styled.h4`
  font-weight: 600;
`;

const TableHeading = styled.h3`
  font-weight: 600;
`;

const StyledTable = styled(Table)``;

const Error = styled.div`
  color: red;
`;
