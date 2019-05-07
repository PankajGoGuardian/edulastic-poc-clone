import React, { Component } from "react";
import { Form, Input, Row, Col, Button, Select, Modal } from "antd";
const Option = Select.Option;
import { ModalFormItem } from "./styled";

import { authApi } from "@edulastic/api";

class CreateSchoolAdminModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValidateStatus: "success",
      emailValidateMsg: "",
      email: ""
    };
    this.onCreateSchoolAdmin = this.onCreateSchoolAdmin.bind(this);
  }

  async onCreateSchoolAdmin() {
    const { email, emailValidateStatus } = this.state;
    let checkUserResponse = { userExists: true };

    if (emailValidateStatus === "success" && email.length > 0) {
      checkUserResponse = await authApi.checkUserExist({ email: email });
      if (checkUserResponse.userExists) {
        this.setState({
          emailValidateStatus: "error",
          emailValidateMsg: "Username already exists"
        });
      }
    } else {
      if (email.length == 0) {
        this.setState({
          emailValidateStatus: "error",
          emailValidateMsg: "Please input Email"
        });
      } else {
        if (this.checkValidEmail(email)) {
          this.setState({
            emailValidateStatus: "error",
            emailValidateMsg: "Username already exists"
          });
        } else {
          this.setState({
            emailValidateStatus: "error",
            emailValidateMsg: "Please input valid Email"
          });
        }
      }
    }

    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (checkUserResponse.userExists) return;
        row.email = this.state.email;
        this.props.createSchoolAdmin(row);
      }
    });
  }

  onCloseModal = () => {
    this.props.closeModal();
  };

  checkValidEmail(strEmail) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(strEmail).toLowerCase());
  }

  changeEmail = e => {
    if (e.target.value.length === 0) {
      this.setState({
        emailValidateStatus: "error",
        emailValidateMsg: "Please input Email",
        email: e.target.value
      });
    } else {
      if (this.checkValidEmail(e.target.value)) {
        this.setState({
          emailValidateStatus: "success",
          emailValidateMsg: "",
          email: e.target.value
        });
      } else {
        this.setState({
          emailValidateStatus: "error",
          emailValidateMsg: "Please input valid Email",
          email: e.target.value
        });
      }
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, schoolsData } = this.props;
    const { emailValidateStatus, emailValidateMsg } = this.state;
    const schoolsOptions = [];
    if (schoolsData.length !== undefined) {
      schoolsData.map((row, index) => {
        schoolsOptions.push(
          <Option key={index} value={row._id}>
            {row.name}
          </Option>
        );
      });
    }

    return (
      <Modal
        visible={modalVisible}
        title="Create School Admin"
        onOk={this.onCreateSchoolAdmin}
        onCancel={this.onCloseModal}
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
          <Col span={11}>
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
          <Col span={11} offset={2}>
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
            <ModalFormItem
              label="Email"
              validateStatus={emailValidateStatus}
              help={emailValidateMsg}
              required={true}
              type="email"
            >
              <Input placeholder="Enter E-mail" autocomplete="new-password" onChange={this.changeEmail} />
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
              })(<Input placeholder="Password" type="password" autocomplete="new-password" />)}
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
      </Modal>
    );
  }
}

const CreateSchoolAdminModalForm = Form.create()(CreateSchoolAdminModal);
export default CreateSchoolAdminModalForm;
