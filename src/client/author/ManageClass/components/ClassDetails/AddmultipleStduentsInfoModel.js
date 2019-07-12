import React from "react";
import { Modal, Table } from "antd";
const AddMultipleStudentsInfoModal = ({ infoModelVisible, setinfoModelVisible, infoModalData, setInfoModalData }) => {
  const handleCancel = () => {
    setinfoModelVisible(false);
    setInfoModalData([]);
  };

  const newInfoModalData = infoModalData.map(user => ({
    ...user,
    msg: user.status == "FAILED_DOMAIN_RESTRICTED" ? " -" : "Student name will be auto-updated after first sign-in"
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
    <Modal title="Student details" visible={infoModelVisible} onCancel={handleCancel} width={700} onOk={handleCancel}>
      <Table dataSource={newInfoModalData} columns={columns} pagination={false} />
    </Modal>
  );
};
export default AddMultipleStudentsInfoModal;
