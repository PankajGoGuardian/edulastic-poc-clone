import React, { Component } from "react";
import { Form, Input, Row, Col, Select, Button } from "antd";
const Option = Select.Option;

import { StyledModal, ModalFormItem } from "./styled";

class CreateSchoolAdminModal extends React.Component {
  onCreateSchoolAdmin = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        this.props.createSchoolAdmin(row);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { schoolsData } = this.props;
    const schoolsOptions = [];
    schoolsData.map((row, index) => {
      schoolsOptions.push(
        <Option key={index} value={row._id}>
          {row.name}
        </Option>
      );
    });

    const { getFieldDecorator } = this.props.form;
    const { modalVisible } = this.props;
    return (
      <StyledModal
        visible={modalVisible}
        title="Create School Admin"
        onOk={this.onCreateSchoolAdmin}
        onCancel={this.onCloseModal}
        width="800px"
        footer={[
          <Button key="back" onClick={this.onCloseModal}>
            No, Cancel
          </Button>,
          <Button type="primary" key="submit" onClick={this.onCreateSchoolAdmin}>
            Yes, Create >
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
                ]
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
                ]
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
                ]
              })(<Input placeholder="Enter E-mail" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Password">
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "Please input password"
                  }
                ]
              })(<Input placeholder="Password" type="password" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label="Select School">
              {getFieldDecorator("institutionIds", {
                rules: [
                  {
                    required: true,
                    message: "Please select school"
                  }
                ]
              })(
                <Select mode="multiple" placeholder="Select school">
                  {schoolsOptions}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const CreateSchoolAdminModalForm = Form.create()(CreateSchoolAdminModal);
export default CreateSchoolAdminModalForm;
