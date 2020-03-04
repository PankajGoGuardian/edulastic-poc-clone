import React, { useState } from "react";
import { Form, Input, Row, Col } from "antd";

import { authApi } from "@edulastic/api";
import {
  ButtonsContainer,
  OkButton,
  CancelButton,
  StyledModal,
  ModalFormItem
} from "../../../common/styled";

const CreateContentAuthorModal = ({ modalVisible, t, form, createDistrictAdmin, closeModal }) => {
  const [emailValidateStatus, setEmailValidateStatus] = useState("success");
  const [emailValidateMsg, setEmailValidateMsg] = useState("");
  const [email, setEmail] = useState("");

  const onCreateContentAuthor = async () => {
    let checkUserResponse = { userExists: true };

    if (emailValidateStatus === "success" && email.length > 0) {
      checkUserResponse = await authApi.checkUserExist({ email });
      if (checkUserResponse.userExists) {
        setEmailValidateStatus("error");
        setEmailValidateMsg("Username already exists");
      }
    } else if (email.length == 0) {
      setEmailValidateStatus("error");
      setEmailValidateMsg("Please input Email");
    } else if (checkValidEmail(email)) {
      setEmailValidateStatus("error");
      setEmailValidateMsg("Username already exists");
    } else {
      setEmailValidateStatus("error");
      setEmailValidateMsg("Please input valid Email");
    }

    form.validateFields((err, row) => {
      if (!err) {
        if (checkUserResponse.userExists) return;

        const firstName = row.name.split(" ", 1);
        let lastName = "";
        if (firstName.length < row.name.length) {
          const lastNameIndex = firstName[0].length + 1;
          lastName = row.name.substr(lastNameIndex, row.name.length);
        }
        const newUser = {
          firstName: firstName[0],
          lastName,
          password: row.password,
          email
        };
        createDistrictAdmin(newUser);
      }
    });
  };

  const changeEmail = e => {
    if (e.target.value.length === 0) {
      setEmailValidateStatus("error");
      setEmailValidateMsg("Please input Email");
    } else if (checkValidEmail(e.target.value)) {
      setEmailValidateStatus("success");
      setEmailValidateMsg("");
    } else {
      setEmailValidateStatus("error");
      setEmailValidateMsg("Please input valid Email");
    }
    setEmail(e.target.value);
  };

  const checkValidEmail = strEmail => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(strEmail).toLowerCase());
  };

  const { getFieldDecorator } = form;

  return (
    <StyledModal
      visible={modalVisible}
      title={t("users.contentApprover.createCA.title")}
      onOk={onCreateContentAuthor}
      onCancel={closeModal}
      maskClosable={false}
      centered
      footer={[
        <ButtonsContainer>
          <CancelButton onClick={closeModal}>
            {t("users.contentApprover.createCA.nocancel")}
          </CancelButton>
          <OkButton onClick={onCreateContentAuthor}>
            {t("users.contentApprover.createCA.yescreate")}
          </OkButton>
        </ButtonsContainer>
      ]}
    >
      <Row>
        <Col span={24}>
          <ModalFormItem label={t("users.contentApprover.name")}>
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: t("users.contentApprover.createCA.validations.name")
                }
              ]
            })(<Input placeholder={t("users.contentApprover.createCA.entername")} />)}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem
            label={t("users.contentApprover.email")}
            validateStatus={emailValidateStatus}
            help={emailValidateMsg}
            required
            type="email"
          >
            <Input
              placeholder={t("users.contentAuthor.createCA.enteremail")}
              autocomplete="new-password"
              onChange={changeEmail}
            />
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem label={t("users.contentApprover.password")}>
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: t("users.contentApprover.createCA.validations.password")
                }
              ]
            })(
              <Input
                placeholder={t("users.contentApprover.createCA.enterpassword")}
                type="password"
                autocomplete="new-password"
              />
            )}
          </ModalFormItem>
        </Col>
      </Row>
    </StyledModal>
  );
};

const CreateContentAuthorModalForm = Form.create()(CreateContentAuthorModal);
export default CreateContentAuthorModalForm;
