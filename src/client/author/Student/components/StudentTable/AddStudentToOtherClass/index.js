import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Table, Spin, Icon } from "antd";
import { StyledModal, Title, ActionButton, Field, FooterDiv } from "./styled";
import { IconUser } from "@edulastic/icons";
import ConfirmationModal from "../../../../../common/components/ConfirmationModal";
import { get } from "lodash";
import { ThemeButton } from "../../../../src/components/common/ThemeButton";

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
  selectedUsersInfo = [],
  askUserConfirmation
}) {
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [cofirmationText, setConfimationText] = useState("");
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

  const formSubmitConfirmed = () => {
    validateFields((err, { destClassCode }) => {
      if (!err) {
        handleSubmit(destClassCode);
      }
    });
  };
  const handleOkClick = () => {
    if (askUserConfirmation) {
      setIsConfirmationModalVisible(true);
    } else {
      formSubmitConfirmed();
    }
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
    <Modal
      visible={showModal}
      title="Student Details"
      width="800px"
      footer={[
        <ThemeButton type="primary" onClick={onCloseModal}>
          Done
        </ThemeButton>
      ]}
      onCancel={onCloseModal}
    >
      <Table
        rowKey={record => record.username}
        pagination={false}
        columns={[
          {
            title: "Name",
            dataIndex: "firstName",
            key: "firstName",
            render: (_, record) => {
              const firstName = get(record, "firstName", "");
              const lastName = get(record, "lastName", "");
              return `${firstName} ${lastName}`;
            }
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
        ]}
        dataSource={successData}
      />
    </Modal>
  ) : (
    <>
      <ConfirmationModal
        title="Move User(s)"
        show={isConfirmationModalVisible}
        onOk={() => {
          formSubmitConfirmed();
          setIsConfirmationModalVisible(false);
        }}
        onCancel={() => {
          setConfimationText("");
          setIsConfirmationModalVisible(false);
        }}
        inputVal={cofirmationText}
        onInputChange={e => setConfimationText(e.target.value)}
        expectedVal="MOVE"
        bodyText={
          "Are you sure you want to move the selected user(s) ? Once moved, existing assessment data will no longer be available for the selected users."
        }
        okText="Yes, Move"
        canUndone
      />

      <StyledModal
        visible={showModal}
        title={title}
        footer={footer}
        onCancel={onCloseModal}
        width="600px"
        height="400px"
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
    </>
  );
}

export const AddStudentsToOtherClassModal = Form.create()(AddStudentsToOtherClass);
