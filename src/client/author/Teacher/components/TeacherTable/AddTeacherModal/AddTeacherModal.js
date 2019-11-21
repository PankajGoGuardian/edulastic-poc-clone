import React, { Component } from "react";
import { Form, Input, Row, Col, Button, Select, Spin, Icon } from "antd";
const Option = Select.Option;
import { ButtonsContainer, OkButton, CancelButton, StyledModal, ModalFormItem } from "../../../../../common/styled";
import { authApi, schoolApi } from "@edulastic/api";
import { IconLock, IconUser, IconMail } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";

class AddTeacherModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValidate: {
        validateStatus: "success",
        validateMsg: "",
        value: ""
      },
      schoolsState: {
        list: [],
        value: [],
        fetching: false
      },
      confirmPwdValidate: {
        value: "",
        validateStatus: "success",
        validateMsg: ""
      },
      passwordValue: ""
    };
  }

  onAddTeacher = async () => {
    const { emailValidate } = this.state;
    let checkUserResponse = { userExists: true };

    if (emailValidate.validateStatus === "success" && emailValidate.value.length > 0) {
      checkUserResponse = await authApi.checkUserExist({ email: emailValidate.value });
      if (checkUserResponse.userExists) {
        this.setState({
          emailValidate: {
            validateStatus: "error",
            validateMsg: "Username already exists",
            value: emailValidate.value
          }
        });
      }
    } else {
      if (emailValidate.value.length == 0) {
        this.setState({
          emailValidate: {
            validateStatus: "error",
            validateMsg: "Please input Email",
            value: emailValidate.value
          }
        });
      } else {
        if (this.checkValidEmail(emailValidate.value)) {
          this.setState({
            emailValidate: {
              validateStatus: "error",
              validateMsg: "Username already exists",
              value: emailValidate.value
            }
          });
        } else {
          this.setState({
            emailValidate: {
              validateStatus: "error",
              validateMsg: "Please input valid Email",
              value: emailValidate.value
            }
          });
        }
      }
    }

    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (checkUserResponse.userExists) return;
        let institutionIds = [];
        for (let i = 0; i < row.institutionIds.length; i++) {
          institutionIds.push(row.institutionIds[i].key);
        }

        const firstName = row.name.split(" ", 1);
        let lastName = "";
        if (firstName.length < row.name.length) {
          const lastNameIndex = firstName[0].length + 1;
          lastName = row.name.substr(lastNameIndex, row.name.length);
        }

        this.props.addTeacher({
          firstName: firstName[0],
          lastName,
          email: this.state.emailValidate.value,
          password: row.password,
          institutionIds
        });
      }
    });
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  changeEmail = e => {
    if (e.target.value.length === 0) {
      this.setState({
        emailValidate: {
          validateStatus: "error",
          validateMsg: "Please input Email",
          value: e.target.value
        }
      });
    } else {
      if (this.checkValidEmail(e.target.value)) {
        this.setState({
          emailValidate: {
            validateStatus: "success",
            validateMsg: "",
            value: e.target.value
          }
        });
      } else {
        this.setState({
          emailValidate: {
            validateStatus: "error",
            validateMsg: "Please input valid Email",
            value: e.target.value
          }
        });
      }
    }
  };

  checkValidEmail(strEmail) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(strEmail).toLowerCase());
  }

  fetchSchool = async value => {
    console.log("fetching...");
    const schoolsData = { ...this.state.schoolsState };

    this.setState({
      schoolsState: {
        list: [],
        fetching: true,
        value: schoolsData.value
      }
    });

    const schoolListData = await schoolApi.getSchools({
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      sortField: "name",
      order: "asc",
      search: { name: [{ type: "cont", value }] }
    });

    this.setState({
      schoolsState: {
        list: schoolListData.data,
        fetching: false,
        value: schoolsData.value
      }
    });
  };

  handleChange = value => {
    this.setState({
      schoolsState: {
        list: [],
        fetching: false,
        value: value
      }
    });
  };

  changePwd = e => {
    const confirmPwdValidate = { ...this.state.confirmPwdValidate };
    if (e.target.value === confirmPwdValidate.value) {
      confirmPwdValidate.validateStatus = "success";
      confirmPwdValidate.validateMsg = "";
    } else {
      confirmPwdValidate.validateStatus = "error";
      confirmPwdValidate.validateMsg = "Password does not match";
    }
    this.setState({
      passwordValue: e.target.value,
      confirmPwdValidate
    });
  };

  changeConfirmPwd = e => {
    const confirmPwdValidate = { ...this.state.confirmPwdValidate };
    confirmPwdValidate.value = e.target.value;
    if (e.target.value.length == 0) {
      confirmPwdValidate.validateStatus = "error";
      confirmPwdValidate.validateMsg = "Please input confirm password";
    } else if (e.target.value !== this.state.passwordValue) {
      confirmPwdValidate.validateStatus = "error";
      confirmPwdValidate.validateMsg = "Password does not match";
    } else {
      confirmPwdValidate.validateStatus = "success";
      confirmPwdValidate.validateMsg = "";
    }
    this.setState({
      confirmPwdValidate
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible } = this.props;
    const { emailValidate, confirmPwdValidate, schoolsState } = this.state;

    return (
      <StyledModal
        visible={modalVisible}
        title="Create Teacher"
        onOk={this.onAddTeacher}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <CancelButton onClick={this.onCloseModal}>No, Cancel</CancelButton>
            <OkButton onClick={this.onAddTeacher}>Yes, Create</OkButton>
          </ButtonsContainer>
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
              })(<Input placeholder="Enter Name" prefix={<IconUser color={themeColor} />} />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label="Email"
              validateStatus={emailValidate.validateStatus}
              help={emailValidate.validateMsg}
              required={true}
              type="email"
            >
              <Input
                placeholder="Enter E-mail"
                autocomplete="new-password"
                onChange={this.changeEmail}
                prefix={<IconMail color={themeColor} />}
              />
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
              })(
                <Input
                  placeholder="Password"
                  type="password"
                  autocomplete="new-password"
                  onChange={this.changePwd}
                  prefix={<IconLock color={themeColor} />}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label="Confirm Password"
              validateStatus={confirmPwdValidate.validateStatus}
              help={confirmPwdValidate.validateMsg}
            >
              {getFieldDecorator("confirm-password", {
                rules: [
                  {
                    required: true,
                    message: "Please input confirm password"
                  }
                ]
              })(
                <Input
                  placeholder="Password"
                  type="password"
                  autocomplete="new-password"
                  onChange={this.changeConfirmPwd}
                  prefix={<IconLock color={themeColor} />}
                />
              )}
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
                  notFoundContent={schoolsState.fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchSchool}
                  onChange={this.handleChange}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {schoolsState.list.map(school => (
                    <Option key={school._id} value={school._id}>
                      {school._source.name}
                    </Option>
                  ))}
                </Select>
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}

const AddTeacherModalForm = Form.create()(AddTeacherModal);
export default AddTeacherModalForm;
