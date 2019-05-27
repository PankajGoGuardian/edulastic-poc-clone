import React, { Component } from "react";
import { Form, Input, Row, Col, Button, Select, Modal, Spin } from "antd";
const Option = Select.Option;
import { ModalFormItem } from "./styled";

import { authApi, schoolApi } from "@edulastic/api";

class CreateSchoolAdminModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValidateStatus: "success",
      emailValidateMsg: "",
      email: "",
      schoolList: [],
      fetching: false
    };
  }

  onCreateSchoolAdmin = async () => {
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

        const firstName = row.name.split(" ", 1);
        let lastName = "";
        if (firstName.length < row.name.length) {
          const lastNameIndex = firstName[0].length + 1;
          lastName = row.name.substr(lastNameIndex, row.name.length);
        }

        const institutionIds = [];
        for (let i = 0; i < row.institutionIds.length; i++) {
          institutionIds.push(row.institutionIds[i].key);
        }

        const newUser = {
          firstName: firstName[0],
          lastName,
          password: row.password,
          email: this.state.email,
          institutionIds: institutionIds
        };
        this.props.createSchoolAdmin(newUser);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

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

  checkValidEmail(strEmail) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(strEmail).toLowerCase());
  }

  fetchSchool = async value => {
    this.setState({ schoolList: [], fetching: true });
    const schoolListData = await schoolApi.getSchools({
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      sortField: "name",
      order: "asc",
      search: { name: { type: "cont", value } }
    });
    this.setState({ schoolList: schoolListData.data, fetching: false });
  };

  handleChange = value => {
    this.props.form.setFieldsValue({ institutionIds: value });
    this.setState({
      schoolList: [],
      fetching: false
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible } = this.props;
    const { emailValidateStatus, emailValidateMsg, fetching, schoolList } = this.state;

    return (
      <Modal
        visible={modalVisible}
        title="Create School Admin"
        onOk={this.onCreateSchoolAdmin}
        onCancel={this.onCloseModal}
        maskClosable={false}
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
          <Col span={24}>
            <ModalFormItem label="Name">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input Name"
                  }
                ]
              })(<Input placeholder="Enter Name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label="Username"
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
                <Select
                  mode="multiple"
                  labelInValue
                  placeholder="Please Select schools"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchSchool}
                  onChange={this.handleChange}
                >
                  {schoolList.map(school => (
                    <Option key={school._id} value={school._id}>
                      {school._source.name}
                    </Option>
                  ))}
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
