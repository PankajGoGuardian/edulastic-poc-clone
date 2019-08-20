import React, { useEffect } from "react";
import { Modal, Form, Input, Table, Spin, Icon } from "antd";
import { StyledModal, Title, ActionButton, Field, FooterDiv } from "./styled";
import { IconUser } from "@edulastic/icons";

function AddStudentsToOtherClass({
  titleText,
  buttonText,
  showModal,
  onCloseModal,
  successData,
  form: { getFieldDecorator, validateFields, setFieldsValue },
  handleSubmit,
  fetchClassDetailsUsingCode,
  destinationClassData,
  loading,
  selectedUsersInfo = []
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
  const title = (
    <Title>
      <IconUser />
      <label>{titleText}</label>
    </Title>
  );

  const footer = (
    <FooterDiv>
      <ActionButton ghost type="primary" onClick={() => onCloseModal()}>
        No, Cancel
      </ActionButton>

      <ActionButton type="primary" onClick={() => handleOkClick()} disabled={!destinationClassData}>
        {buttonText}
        <Icon type="right" />
      </ActionButton>
    </FooterDiv>
  );
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
    <StyledModal
      visible={showModal}
      title={title}
      footer={footer}
      onCancel={onCloseModal}
      width="800px"
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <Form>
          <Field name="destClassCode">
            <legend>Destination Class Code</legend>
            <Form.Item>
              {getFieldDecorator("destClassCode", {
                rules: [{ required: true, message: "Please input the destination class" }]
              })(<Input onBlur={evt => fetchClassDetailsUsingCode(evt.target.value)} />)}
            </Form.Item>
          </Field>
          <Field name="name">
            <legend>Class Name</legend>
            <Form.Item>{getFieldDecorator("name")(<Input disabled />)}</Form.Item>
          </Field>
          <Field name="institutionName">
            <legend>School Name</legend>
            <Form.Item>{getFieldDecorator("institutionName")(<Input disabled />)}</Form.Item>
          </Field>
          <Field name="teacherName">
            <legend>Teacher Name</legend>
            <Form.Item>{getFieldDecorator("teacherName")(<Input disabled />)}</Form.Item>
          </Field>
        </Form>
      </Spin>
    </StyledModal>
  );
}

export const AddStudentsToOtherClassModal = Form.create()(AddStudentsToOtherClass);
