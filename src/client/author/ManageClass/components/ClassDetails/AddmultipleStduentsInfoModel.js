import React from "react";
import { Modal, Table } from "antd";
const AddMultipleStudentsInfoModal = ({ info, setAddMultipleInfoModal }) => {
  const handleCancel = () => {
    setAddMultipleInfoModal(false);
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
    <Modal title="Student details" footer={null} visible={info.visible} onCancel={handleCancel}>
      <Table dataSource={info.data} columns={columns} pagination={false} />
    </Modal>
  );
};
export default AddMultipleStudentsInfoModal;
