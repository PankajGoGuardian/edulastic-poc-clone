import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Table, Spin, Icon } from "antd";
import { IconUser } from "@edulastic/icons";
import { get } from "lodash";
import { EduButton } from "@edulastic/common";
import { StyledModal, Title, Field, FooterDiv } from "./styled";
import ConfirmationModal from "../../../../../common/components/ConfirmationModal";
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
  askUserConfirmation,
  t
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
      <EduButton height="32px" isGhost onClick={() => onCloseModal()}>
        No, Cancel
      </EduButton>
      <EduButton height="32px" onClick={() => handleOkClick()} disabled={!destinationClassData}>
        {buttonText}
        <Icon type="right" />
      </EduButton>
    </FooterDiv>
  );
  return successData ? (
    <Modal
      visible={showModal}
      title={t("users.student.addtoanotherclass.studentdetails")}
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
            title: t("users.student.addtoanotherclass.name"),
            dataIndex: "firstName",
            key: "firstName",
            render: (_, record) => {
              const firstName = get(record, "firstName", "");
              const lastName = get(record, "lastName", "");
              return `${firstName} ${lastName}`;
            }
          },
          {
            title: t("users.student.addtoanotherclass.username"),
            dataIndex: "username",
            key: "username"
          },
          {
            title: t("users.student.addtoanotherclass.status"),
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
        bodyTextStyle={{textAlign:"center"}}
        title={t("users.student.addtoanotherclass.title")}
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
        bodyText={<div style={{textAlign:"center"}}>{t("users.student.addtoanotherclass.confirmtext")}</div>}
        okText={t("users.student.addtoanotherclass.oktext")}
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
              <legend>{t("users.student.addtoanotherclass.classcode")}</legend>
              <Form.Item>
                {getFieldDecorator("destClassCode", {
                  rules: [{ required: true, message: "Please input the destination class" }]
                })(<Input onBlur={evt => fetchClassDetailsUsingCode(evt.target.value)} />)}
              </Form.Item>
            </Field>
            <Field name="name">
              <legend>{t("users.student.addtoanotherclass.classname")}</legend>
              <Form.Item>{getFieldDecorator("name")(<Input disabled />)}</Form.Item>
            </Field>
            <Field name="institutionName">
              <legend>{t("users.student.addtoanotherclass.schoolname")}</legend>
              <Form.Item>{getFieldDecorator("institutionName")(<Input disabled />)}</Form.Item>
            </Field>
            <Field name="teacherName">
              <legend>{t("users.student.addtoanotherclass.teachername")}</legend>
              <Form.Item>{getFieldDecorator("teacherName")(<Input disabled />)}</Form.Item>
            </Field>
          </Form>
        </Spin>
      </StyledModal>
    </>
  );
}

export const AddStudentsToOtherClassModal = Form.create()(AddStudentsToOtherClass);
