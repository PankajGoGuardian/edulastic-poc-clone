import React, { useEffect } from "react";
import { Modal, Form, Input, Table, Spin } from "antd";

function AddStudentsToOtherClass({
  showModal,
  onCloseModal,
  successData,
  form: { getFieldDecorator, validateFields, setFieldsValue },
  handleSubmit,
  fetchClassDetailsUsingCode,
  destinationClassData,
  loading
}) {
  useEffect(() => {
    const { groupInfo: { name, institutionName, primaryTeacherId, owners = [] } = {} } = destinationClassData || {};
    let teacherName = "";
    if (primaryTeacherId) {
      const teacherInfo = owners.filter(info => info.id === primaryTeacherId);
      teacherName = teacherInfo.length > 0 ? teacherInfo[0].name : "";
    } else if (owners.length > 0) {
      teacherName = owners[0].name || "";
    }
    setFieldsValue({
      name,
      institutionName,
      teacherName
    });
  }, [destinationClassData]);

  const handleOkClick = () => {
    validateFields((err, { destClassCode }) => {
      if (!err) {
        handleSubmit(destClassCode);
      }
    });
  };
  return successData ? (
    <Modal visible={showModal} title="Student enrollment status" width="800px" onOk={onCloseModal}>
      <Table
        rowKey={record => record.username}
        columns={[
          {
            title: "Username",
            dataIndex: "username",
            key: "username"
          },
          {
            title: "First Name",
            dataIndex: "firstName",
            key: "firstName"
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status"
          }
        ]}
        dataSource={successData}
      />
    </Modal>
  ) : (
    <Modal
      visible={showModal}
      title="Add Student(s) to Another Class"
      onOk={handleOkClick}
      onCancel={onCloseModal}
      width="800px"
      okText="Add Student(s) >"
      okButtonProps={{ disabled: !destinationClassData }}
      cancelText="No, Cancel"
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <Form>
          <Form.Item label="Destination Class Code">
            {getFieldDecorator("destClassCode", {
              rules: [{ required: true, message: "Please input the destination class" }]
            })(<Input onBlur={evt => fetchClassDetailsUsingCode(evt.target.value)} />)}
          </Form.Item>
          <Form.Item label="Class Name">{getFieldDecorator("name")(<Input disabled />)}</Form.Item>
          <Form.Item label="School Name">{getFieldDecorator("institutionName")(<Input disabled />)}</Form.Item>
          <Form.Item label="Teacher Name">{getFieldDecorator("teacherName")(<Input disabled />)}</Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default Form.create()(AddStudentsToOtherClass);
