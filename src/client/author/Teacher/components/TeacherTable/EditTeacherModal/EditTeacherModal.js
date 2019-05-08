import React, { Component } from "react";
import { Form, Input, Row, Col, Button } from "antd";

import { StyledEditTeacherModal, ModalFormItem } from "./styled";

class EditTeacherModal extends React.Component {
  onSaveTeacher = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        row.key = this.props.teacherData.key;
        this.props.saveTeacher(row);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, teacherData } = this.props;
    return (
      <StyledEditTeacherModal
        visible={modalVisible}
        title="Edit School Admin"
        onOk={this.onSaveTeacher}
        onCancel={this.onCloseModal}
        maskClosable={false}
        width="800px"
        footer={[
          <Button key="back" onClick={this.onCloseModal}>
            No, Cancel
          </Button>,
          <Button type="primary" key="submit" onClick={this.onSaveTeacher}>
            Yes, Update >
          </Button>
        ]}
      >
        <Row>
          <Col span={12}>
            <ModalFormItem label="First Name">
              {getFieldDecorator("firstName", {
                rules: [
                  {
                    required: true,
                    message: "Please input First Name"
                  }
                ],
                initialValue: teacherData.firstName
              })(<Input placeholder="Enter First Name" />)}
            </ModalFormItem>
          </Col>
          <Col span={12}>
            <ModalFormItem label="Last Name">
              {getFieldDecorator("lastName", {
                rules: [
                  {
                    required: true,
                    message: "Please input Last Name"
                  }
                ],
                initialValue: teacherData.lastName
              })(<Input placeholder="Enter Last Name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Email">
              {getFieldDecorator("email", {
                rules: [
                  {
                    required: true,
                    message: "Please input E-mail"
                  },
                  {
                    type: "email",
                    message: "The input is not valid E-mail"
                  }
                ],
                initialValue: teacherData.email
              })(<Input placeholder="Enter E-mail" />)}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledEditTeacherModal>
    );
  }
}

const EditTeacherModalForm = Form.create()(EditTeacherModal);
export default EditTeacherModalForm;
