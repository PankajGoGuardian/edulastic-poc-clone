import React, { Component } from "react";
import { Form, Input, Row, Col, Select, Button } from "antd";
const Option = Select.Option;

import { StyledModal, ModalFormItem } from "./styled";

class EditSchoolAdminModal extends React.Component {
  onSaveSchoolAdmin = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        row.key = this.props.schoolAdminData.key;
        this.props.saveSchoolAdmin(row);
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
    const { modalVisible, schoolAdminData } = this.props;
    return (
      <StyledModal
        visible={modalVisible}
        title="Edit School Admin"
        onOk={this.onCreateSchoolAdmin}
        onCancel={this.onCloseModal}
        width="800px"
        maskClosable={false}
        footer={[
          <Button key="back" onClick={this.onCloseModal}>
            No, Cancel
          </Button>,
          <Button type="primary" key="submit" onClick={this.onSaveSchoolAdmin}>
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
                initialValue: schoolAdminData.firstName
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
                initialValue: schoolAdminData.lastName
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
                initialValue: schoolAdminData.email
              })(<Input placeholder="Enter E-mail" />)}
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
                ],
                initialValue: schoolAdminData.institutionIds
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

const EditSchoolAdminModalForm = Form.create()(EditSchoolAdminModal);
export default EditSchoolAdminModalForm;
