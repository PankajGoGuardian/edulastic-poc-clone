import React from "react";
import moment from "moment";
import { get, split, unset, pickBy, identity, isEmpty } from "lodash";
import { Icon, Collapse, Spin, Input, Select, DatePicker, message } from "antd";
import { IconUser } from "@edulastic/icons";
import { userApi, schoolApi } from "@edulastic/api";
import { isEmailValid } from "../../../../common/utils/helpers";

import { StyledModal, Title, ActionButton, PanelHeader, Field, Form, FooterDiv } from "./styled";

import keyIcon from "../../../../student/assets/key-icon.svg";
import hashIcon from "../../../../student/assets/hashtag-icon.svg";
import userIcon from "../../../../student/assets/user-icon.svg";
import mailIcon from "../../../../student/assets/mail-icon.svg";
import { selectColor } from "@edulastic/colors";

const { Option } = Select;

const { Panel } = Collapse;
class AddNewUserForm extends React.Component {
  state = {
    keys: ["basic"],
    usernameFieldValue: "",
    role: "student",
    schoolsState: {
      list: [],
      value: [],
      fetching: false
    }
  };

  setUsername = val => {
    this.setState({
      ...this.state,
      usernameFieldValue: val
    });
  };

  confirmPwdCheck = (rule, value, callback) => {
    const pwd = this.props.form.getFieldValue("password");
    if (pwd !== value) {
      callback(rule.message);
    } else {
      callback();
    }
  };

  validateEmailValue = async (rule, value, callback) => {
    if (!isEmailValid(rule, value, callback, "both", "Please enter valid username/email")) {
      return;
    }
    const { userOrgId: districtId } = this.props;
    try {
      const res = await userApi.checkUser({
        username: value,
        districtId
      });
      if (!isEmpty(res)) {
        callback("Email Already exists");
      }
    } catch (err) {
      console.log(error);
    }
    callback();
  };
  onRoleChange = role => {
    this.setState({
      ...this.state,
      role
    });
  };
  fetchSchool = async value => {
    const { userOrgId: districtId } = this.props;
    const schoolsData = { ...this.state.schoolsState };

    this.setState({
      schoolsState: {
        list: [],
        fetching: true,
        value: schoolsData.value
      }
    });
    const schoolListData = await schoolApi.getSchools({
      districtId,
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
      ...this.state,
      schoolsState: {
        ...this.state.schoolsState,
        fetching: false,
        value: value
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      closeModal,
      showModal,
      formTitle,
      modalData: { _source } = {},
      fetchClassDetailsUsingCode,
      validatedClassDetails,
      addNewUser,
      resetClassDetails
    } = this.props;

    const { usernameFieldValue, role, schoolsState } = this.state;
    const isValidClassCode = get(validatedClassDetails, "isValidClassCode", false);
    const _className = get(validatedClassDetails, "groupInfo.name", "");
    const { keys } = this.state;
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

        <ActionButton type="primary" onClick={() => addNewUser()} disabled={!isValidClassCode}>
          {role === "student" ? "Yes, Add Student" : "Yes, Add User"}
          <Icon type="right" />
        </ActionButton>
      </FooterDiv>
    );

    const expandIcon = panelProps => (panelProps.isActive ? <Icon type="caret-up" /> : <Icon type="caret-down" />);

    const BasicDetailsHeader = (
      <PanelHeader>
        <Icon type="bars" />
        <label>Basic Details</label>
      </PanelHeader>
    );

    const AdditionalDetailsHeader = (
      <PanelHeader>
        <Icon type="setting" theme="filled" />
        <label>Configure Additional Details</label>
      </PanelHeader>
    );
    return (
      <StyledModal title={title} footer={footer} visible={showModal} onCancel={() => closeModal()}>
        <Form>
          <Collapse accordion defaultActiveKey={keys} expandIcon={expandIcon} expandIconPosition="right">
            <Panel header={BasicDetailsHeader} key="basic">
              <Field name="code">
                <legend>Class Code</legend>
                <Form.Item>
                  {getFieldDecorator("code", {
                    rules: [{ required: true, message: "Please enter valid class code" }]
                  })(
                    <Input
                      prefix={<img src={hashIcon} alt="" />}
                      onBlur={evt => {
                        const classCodeValue = evt.target.value.trim();
                        if (classCodeValue.length) fetchClassDetailsUsingCode(classCodeValue);
                      }}
                      onChange={evt => {
                        const classCodeValue = evt.target.value.trim();
                        if (!classCodeValue.length) resetClassDetails();
                      }}
                      placeholder="Enter Class Code"
                    />
                  )}
                  {!isEmpty(_className) && `class name : ${_className}`}
                </Form.Item>
              </Field>
              <Field name="email">
                <legend>Username/Email</legend>
                <Form.Item>
                  {getFieldDecorator("email", {
                    validateTrigger: ["onBlur"],
                    rules: [{ validator: this.validateEmailValue }]
                  })(
                    <Input
                      prefix={<img src={mailIcon} alt="" />}
                      placeholder="Enter Username/email"
                      onChange={e => this.setUsername(e.target.value)}
                    />
                  )}
                </Form.Item>
              </Field>
              <Field name="role">
                <legend>Role</legend>
                <Form.Item>
                  {getFieldDecorator("role", { initialValue: "student" })(
                    <Select disabled={!usernameFieldValue.trim().length} onSelect={this.onRoleChange}>
                      <Option value="role" disabled>
                        Role
                      </Option>
                      <Option value="student">Student</Option>
                      <Option value="teacher">Teacher</Option>
                    </Select>
                  )}
                </Form.Item>
              </Field>
              <Field name="fullName">
                <legend>Name of user</legend>
                <Form.Item>
                  {getFieldDecorator("fullName", {
                    rules: [
                      { required: true, message: "Please provide user full name" },
                      { max: 128, message: "Must less than 128 characters!" }
                    ]
                  })(<Input prefix={<img src={userIcon} alt="" />} placeholder="Enter the name of user" />)}
                </Form.Item>
              </Field>
              <Field name="password">
                <legend>Password</legend>
                <Form.Item>
                  {getFieldDecorator("password")(
                    <Input prefix={<img src={keyIcon} alt="" />} type="password" placeholder="Enter Password" />
                  )}
                </Form.Item>
              </Field>
              <Field name="confirmPassword">
                <legend>Confirm Password</legend>
                <Form.Item>
                  {getFieldDecorator("confirmPassword", {
                    rules: [{ validator: this.confirmPwdCheck, message: "Retyped password do not match." }]
                  })(<Input prefix={<img src={keyIcon} alt="" />} type="password" placeholder="Confirm Password" />)}
                </Form.Item>
              </Field>
              {role === "teacher" && (
                <Field name="institutionIds">
                  <legend>Select School</legend>
                  <Form.Item>
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
                        placeholder="Please Select schools"
                        notFoundContent={schoolsState.fetching ? <Spin size="small" /> : null}
                        filterOption={false}
                        onSearch={this.fetchSchool}
                        onChange={this.handleChange}
                      >
                        {schoolsState.list.map(school => (
                          <Option key={school._id} value={school._id}>
                            {school._source.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Field>
              )}
            </Panel>
            <Panel header={AdditionalDetailsHeader} key="additional">
              <Field name="sisId">
                <legend>SIS ID</legend>
                <Form.Item>
                  {getFieldDecorator("sisId")(<Input placeholder="Enter SIS ID" disabled={true} />)}
                </Form.Item>
              </Field>
              <Field name="studentNumber">
                <legend>Student Number</legend>
                <Form.Item>
                  {getFieldDecorator("studentNumber")(<Input placeholder="Enter Student Number" disabled={true} />)}
                </Form.Item>
              </Field>
              <Field name="frlStatus">
                <legend>Free Reduced Lunch</legend>
                <Form.Item>
                  {getFieldDecorator("frlStatus")(
                    <Select>
                      <Option value="active">Yes</Option>
                      <Option value="deActive">No</Option>
                    </Select>
                  )}
                </Form.Item>
              </Field>
              <Field name="iepStatus">
                <legend>Individual Education Plan</legend>
                <Form.Item>
                  {getFieldDecorator("iepStatus")(
                    <Select>
                      <Option value="active">Yes</Option>
                      <Option value="deActive">No</Option>
                    </Select>
                  )}
                </Form.Item>
              </Field>
              <Field name="ellStatus">
                <legend>English Language Learner</legend>
                <Form.Item>
                  {getFieldDecorator("ellStatus")(
                    <Select>
                      <Option value="active">Yes</Option>
                      <Option value="deActive">No</Option>
                    </Select>
                  )}
                </Form.Item>
              </Field>
              <Field name="sedStatus">
                <legend>Special ED</legend>
                <Form.Item>
                  {getFieldDecorator("sedStatus")(
                    <Select>
                      <Option value="active">Yes</Option>
                      <Option value="deActive">No</Option>
                    </Select>
                  )}
                </Form.Item>
              </Field>
              <Field name="race">
                <legend>Race</legend>
                <Form.Item>{getFieldDecorator("race")(<Input placeholder="Race" />)}</Form.Item>
              </Field>

              <Field name="dob" optional>
                <legend>DOB</legend>
                <Form.Item>{getFieldDecorator("dob")(<DatePicker format="DD MMM, YYYY" />)}</Form.Item>
              </Field>
              <Field name="gender">
                <legend>Gender</legend>
                <Form.Item>
                  {getFieldDecorator("gender")(
                    <Select>
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  )}
                </Form.Item>
              </Field>
              <Field name="contactEmails">
                <legend>Contact</legend>
                <Form.Item>{getFieldDecorator("contactEmails")(<Input placeholder="Enter Contact" />)}</Form.Item>
              </Field>
              <Field name="tts">
                <legend>Enable Text To Speech</legend>
                <Form.Item>
                  {getFieldDecorator("tts")(
                    <Select>
                      <Option value="yes">Yes</Option>
                      <Option value="no">No</Option>
                    </Select>
                  )}
                </Form.Item>
              </Field>
            </Panel>
          </Collapse>
        </Form>
      </StyledModal>
    );
  }
}
export const AddNewUserModal = Form.create({ name: "user_form_modal" })(AddNewUserForm);
