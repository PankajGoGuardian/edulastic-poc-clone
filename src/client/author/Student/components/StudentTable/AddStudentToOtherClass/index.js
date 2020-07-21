import { CustomModalStyled, EduButton, FieldLabel, TextInputStyled } from "@edulastic/common";
import { IconUser } from "@edulastic/icons";
import { Form, Icon, Spin, Table } from "antd";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import ConfirmationModal from "../../../../../common/components/ConfirmationModal";
import { Field, FooterDiv, Title } from "./styled";

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
      <EduButton isGhost onClick={() => onCloseModal()}>
        No, Cancel
      </EduButton>
      <EduButton onClick={() => handleOkClick()} disabled={!destinationClassData}>
        {buttonText}
        <Icon type="right" />
      </EduButton>
    </FooterDiv>
  );
  return successData ? (
    <CustomModalStyled
      visible={showModal}
      title={t("users.student.addtoanotherclass.studentdetails")}
      width="800px"
      footer={[
        <EduButton type="primary" onClick={onCloseModal}>
          Done
        </EduButton>
      ]}
      onCancel={onCloseModal}
      centered
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
    </CustomModalStyled>
  ) : (
      <>
        <ConfirmationModal
          bodyTextStyle={{ textAlign: "center" }}
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
          bodyText={<div style={{ textAlign: "center" }}>{t("users.student.addtoanotherclass.confirmtext")}</div>}
          okText={t("users.student.addtoanotherclass.oktext")}
          canUndone
          centered
        />

        <CustomModalStyled
          visible={showModal}
          title={title}
          footer={footer}
          onCancel={onCloseModal}
          width="600px"
          maskClosable={false}
          centered
        >
          <Spin spinning={loading}>
            <Form>
              <Field name="destClassCode">
                <FieldLabel>{t("users.student.addtoanotherclass.classcode")}</FieldLabel>
                <Form.Item>
                  {getFieldDecorator("destClassCode", {
                    rules: [{ required: true, message: "Please input the destination class" }]
                  })(<TextInputStyled onBlur={evt => fetchClassDetailsUsingCode(evt.target.value)} />)}
                </Form.Item>
              </Field>
              <Field name="name">
                <FieldLabel>{t("users.student.addtoanotherclass.classname")}</FieldLabel>
                <Form.Item>{getFieldDecorator("name")(<TextInputStyled disabled />)}</Form.Item>
              </Field>
              <Field name="institutionName">
                <FieldLabel>{t("users.student.addtoanotherclass.schoolname")}</FieldLabel>
                <Form.Item>{getFieldDecorator("institutionName")(<TextInputStyled disabled />)}</Form.Item>
              </Field>
              <Field name="teacherName">
                <FieldLabel>{t("users.student.addtoanotherclass.teachername")}</FieldLabel>
                <Form.Item>{getFieldDecorator("teacherName")(<TextInputStyled disabled />)}</Form.Item>
              </Field>
            </Form>
          </Spin>
        </CustomModalStyled>
      </>
    );
}

export const AddStudentsToOtherClassModal = Form.create()(AddStudentsToOtherClass);
