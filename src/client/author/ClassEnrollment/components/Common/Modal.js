import React from "react";
import { Form, Input, Icon } from "antd";
import { StyledModal, Title, ActionButton, Field, FooterDiv } from "./styled";
import { IconUser } from "@edulastic/icons";

const CommonModal = props => {
  const {
    showModal,
    formTitle,
    closeModal,
    buttonText,
    modalFunc,
    form: { getFieldDecorator },
    fetchClassDetailsUsingCode
  } = props;

  const title = (
    <Title>
      <IconUser />
      <label>{formTitle}</label>
    </Title>
  );

  const footer = (
    <FooterDiv>
      <ActionButton ghost type="primary" onClick={() => closeModal()}>
        No, Cancel
      </ActionButton>

      <ActionButton type="primary" onClick={() => modalFunc()}>
        {buttonText || `Yes, Proceed`}
        <Icon type="right" />
      </ActionButton>
    </FooterDiv>
  );

  return (
    <StyledModal title={title} footer={footer} visible={showModal} onCancel={() => closeModal()}>
      <Form>
        <Field name="classcode">
          <legend>Destination Class</legend>
          <Form.Item>
            {getFieldDecorator("classcode", {
              rules: [{ required: true, message: "Please input the destination class" }]
            })(<Input placeholder="Enter class code" />)}
          </Form.Item>
        </Field>
        <Field name="clasname">
          <legend>Class Name</legend>
          <Form.Item>
            {getFieldDecorator("classname", {
              initialValue: ""
            })(<Input />)}
          </Form.Item>
        </Field>
        <Field name="schoolname">
          <legend>School Name</legend>
          <Form.Item>
            {getFieldDecorator("schoolname", {
              initialValue: ""
            })(<Input />)}
          </Form.Item>
        </Field>
        <Field name="teachername">
          <legend>Teacher Name</legend>
          <Form.Item>
            {getFieldDecorator("teachername", {
              initialValue: ""
            })(<Input />)}
          </Form.Item>
        </Field>
      </Form>
    </StyledModal>
  );
};

export const CommonFormModal = Form.create({ name: "add_modal" })(CommonModal);
