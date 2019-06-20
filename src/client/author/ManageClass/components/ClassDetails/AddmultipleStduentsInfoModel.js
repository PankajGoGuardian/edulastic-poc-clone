import React from "react";
import { Modal, Table } from "antd";
const AddMultipleStudentsInfoModal = ({ infoModelVisible, setinfoModelVisible, infoModalData, setInfoModalData }) => {
  const handleCancel = () => {
    setinfoModelVisible(false);
    setInfoModalData([]);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName"
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
    <Modal title="Student details" footer={null} visible={infoModelVisible} onCancel={handleCancel} width={700}>
      <Table dataSource={infoModalData} columns={columns} pagination={false} />
    </Modal>
  );
};
export default AddMultipleStudentsInfoModal;
