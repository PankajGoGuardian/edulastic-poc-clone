import React from "react";
import { Modal, Table, Button } from "antd";
const AddMultipleStudentsInfoModal = ({ infoModelVisible, setinfoModelVisible, infoModalData, setInfoModalData }) => {
  const handleCancel = () => {
    setinfoModelVisible(false);
    setInfoModalData([]);
  };

  const newInfoModalData = infoModalData.map(user => ({
    ...user,
    msg:
      user.status == "FAILED_DOMAIN_RESTRICTED"
        ? " -"
        : user.firstName === ""
        ? "Student name will be auto-updated after first sign-in"
        : `${user.firstName} ${user.lastName || ""}`
  }));
  const columns = [
    {
      title: "Name",
      dataIndex: "msg",
      key: "msg"
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status"
    }
  ];
  return (
    <Modal
      title="Student details"
      visible={infoModelVisible}
      onCancel={handleCancel}
      width={700}
      footer={
        <Button type="primary" onClick={handleCancel}>
          Done
        </Button>
      }
    >
      <Table dataSource={newInfoModalData} columns={columns} pagination={false} />
    </Modal>
  );
};
export default AddMultipleStudentsInfoModal;
