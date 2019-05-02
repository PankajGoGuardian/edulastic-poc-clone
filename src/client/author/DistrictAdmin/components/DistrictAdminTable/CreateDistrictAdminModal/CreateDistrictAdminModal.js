import React, { Component } from "react";
import { Form, Input, Row, Col, Button, Select } from "antd";
const Option = Select.Option;

import { StyledModal, ModalFormItem } from "./styled";

class CreateDistrictAdminModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      firstNameValStatus: "success",
      firstNameValMsg: "",
      lastNameValStatus: "success",
      lastNameValMsg: ""
    };
  }

  onCreateDistrictAdmin = () => {
    const { firstName, lastName } = this.state;
    if (firstName.length == 0)
      this.setState({ firstNameValStatus: "error", firstNameValMsg: "Please input First name." });
    if (lastName.length == 0) this.setState({ lastNameValStatus: "error", lastNameValMsg: "Please input Last name." });

    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (firstName.length == 0 || lastName.length == 0) return;
        const dataSource = [...this.props.dataSource];
        const sameShortNameRow = dataSource.filter(item => item.firstName === firstName && item.lastName === lastName);
        if (sameShortNameRow.length > 0) {
          return;
        }
        row.firstName = firstName;
        row.lastName = lastName;
        this.props.createDistrictAdmin(row);
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  changeFirstName = e => {
    this.setState({ firstName: e.target.value });
    this.setNameValidateStatus(e.target.value, this.state.lastName);
  };

  changeLastName = e => {
    this.setState({ lastName: e.target.value });
    this.setNameValidateStatus(this.state.firstName, e.target.value);
  };

  setNameValidateStatus(firstName, lastName) {
    if (firstName.length == 0)
      this.setState({ firstNameValStatus: "error", firstNameValMsg: "Please input First Name." });
    else this.setState({ firstNameValStatus: "success", firstNameValMsg: "" });

    if (lastName.length == 0) this.setState({ lastNameValStatus: "error", lastNameValMsg: "Please input Last Name." });
    else this.setState({ lastNameValStatus: "success", lastNameValMsg: "" });

    const dataSource = [...this.props.dataSource];
    const sameShortNameRow = dataSource.filter(item => item.firstName === firstName && item.lastName === lastName);
    if (sameShortNameRow.length > 0) {
      this.setState({
        firstNameValStatus: "error",
        firstNameValMsg: "User already exists.",
        lastNameValStatus: "error",
        lastNameValMsg: ""
      });
      return;
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, schoolsData } = this.props;

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
      <StyledModal
        visible={modalVisible}
        title="Create District Admin"
        onOk={this.onCreateDistrictAdmin}
        onCancel={this.onCloseModal}
        width="800px"
        footer={[
          <Button key="back" onClick={this.onCloseModal}>
            No, Cancel
          </Button>,
          <Button type="primary" key="submit" onClick={this.onCreateDistrictAdmin}>
            Yes, Create >
          </Button>
        ]}
      >
        <Row>
          <Col span={12}>
            <ModalFormItem
              label="First Name"
              validateStatus={this.state.firstNameValStatus}
              help={this.state.firstNameValMsg}
            >
              <Input placeholder="Enter First Name" onChange={this.changeFirstName} />
            </ModalFormItem>
          </Col>
          <Col span={12}>
            <ModalFormItem
              label="Last Name"
              validateStatus={this.state.lastNameValStatus}
              help={this.state.lastNameValMsg}
            >
              <Input placeholder="Enter Last Name" onChange={this.changeLastName} />
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

const CreateDistrictAdminModalForm = Form.create()(CreateDistrictAdminModal);
export default CreateDistrictAdminModalForm;
