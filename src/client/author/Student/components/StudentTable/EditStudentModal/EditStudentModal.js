import React, { Component } from "react";
import { Form, Input, Row, Col, Button, Modal } from "antd";

import { ModalFormItem } from "./styled";

class EditStudentModal extends React.Component {
  onSaveStudent = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        row.key = this.props.studentData.key;
        this.props.saveStudent(row);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, studentData } = this.props;
    return (
      <Modal
        visible={modalVisible}
        title="Edit School Admin"
        onOk={this.onSaveStudent}
        onCancel={this.onCloseModal}
        width="800px"
        maskClosable={false}
        footer={[
          <Button key="back" onClick={this.onCloseModal}>
            No, Cancel
          </Button>,
          <Button type="primary" key="submit" onClick={this.onSaveStudent}>
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
                initialValue: studentData.firstName
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
                initialValue: studentData.lastName
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
                initialValue: studentData.email
              })(<Input placeholder="Enter E-mail" />)}
            </ModalFormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

const EditStudentModalForm = Form.create()(EditStudentModal);
export default EditStudentModalForm;
