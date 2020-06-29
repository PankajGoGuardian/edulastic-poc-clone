import React from "react";
import { get, isEmpty } from "lodash";

// components
import { Collapse, DatePicker, Icon, Input, Select, Spin } from "antd";
import { EduButton } from "@edulastic/common";
import { IconUser } from "@edulastic/icons";
import { schoolApi, userApi } from "@edulastic/api";
import { Field, FooterDiv, Form, PanelHeader, StyledModal, Title, InputMessage } from "./styled";
import { isEmailValid, nameValidator } from "../../../../common/utils/helpers";

import keyIcon from "../../../../student/assets/key-icon.svg";
import hashIcon from "../../../../student/assets/hashtag-icon.svg";
import userIcon from "../../../../student/assets/user-icon.svg";
import mailIcon from "../../../../student/assets/mail-icon.svg";

const { Option } = Select;

const { Panel } = Collapse;
class AddNewUserForm extends React.Component {
  state = {
    keys: ["basic"],
    role: "student",
    schoolsState: {
      list: [],
      value: [],
      fetching: false
    },
    isUserExists: false,
    userInfo: {},
    userExistsInClass: false
  };

  resetFormData = () => {
    const { resetClassDetails, form } = this.props;
    this.setState({
      isUserExists: false,
      userInfo: {},
      userExistsInClass: false
    });
    resetClassDetails();
    form.resetFields();
  };

  confirmPwdCheck = (rule, value, callback) => {
    const { form } = this.props;
    const pwd = form.getFieldValue("password");
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
    const {
      userOrgId: districtId,
      form,
      location: { pathname }
    } = this.props;

    const classCode = form.getFieldValue("code") || "";
    // reset pre-populated state data
    this.resetPrePopulatedDataFromState();
    try {
      const res = await userApi.checkUser({
        username: value,
        districtId,
        classCode,
        role: "student"
      });

      const user = res[0] || {};

      // student exists in same class
      if (user.existInClass) {
        this.setState(prevState => ({ ...prevState, userExistsInClass: true, isUserExists: true }));

        form.setFields({
          email: {
            value,
            errors: [new Error("User already part of this class")]
          }
        });
        callback();
        return null;
      }

      this.setState(prevState => ({ ...prevState, userExistsInClass: false }));

      // student exists in other class
      if (user._id) {
        this.setState(prevState => ({
          ...prevState,
          isUserExists: true,
          userInfo: user,
          role: user.role === "teacher" ? "teacher" : "student"
        }));
        if (user.role === "teacher" && pathname.split("/").includes("class-enrollment")) {
          this.prePopulateDataToState();
        }
        const { lastName = "", firstName } = user;
        form.setFields({
          fullName: {
            value: lastName ? `${firstName.trim()} ${lastName.trim()}` : `${firstName.trim()}`
          },
          password: {
            value: ""
          },
          confirmPassword: {
            value: ""
          }
        });
        return callback();
      }
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isUserExists: false, userInfo: {} }));
      form.setFields({
        email: {
          value,
          errors: [new Error("invalid value")]
        }
      });
    }
    // if user doesn't exist setting user obj empty
    this.setState(prevState => ({ ...prevState, isUserExists: false, userInfo: {} }));
    callback();
  };

  resetPrePopulatedDataFromState = () => {
    const { form } = this.props;
    this.setState(prevState => ({
      ...prevState,
      schoolsState: {
        list: []
      },
      selectedSchoolId: "",
      disabledSchool: false,
      role: "student"
    }));
    form.setFields({
      fullName: {
        value: ""
      },
      password: {
        value: ""
      },
      confirmPassword: {
        value: ""
      }
    });
  };

  prePopulateDataToState = () => {
    const { validatedClassDetails } = this.props;
    // pre-populate and disable the school dropdown
    // populate using class institution
    const groupInfo = get(validatedClassDetails, "groupInfo", {});
    this.setState(prevState => ({
      ...prevState,
      schoolsState: {
        list: [
          {
            _id: groupInfo.institutionId,
            _source: {
              name: groupInfo.institutionName
            }
          }
        ]
      },
      selectedSchoolId: groupInfo.institutionId,
      disabledSchool: true
    }));
  };

  onRoleChange = role => {
    this.setState(prevState => ({
      ...prevState,
      role
    }));
  };

  fetchSchool = async value => {
    const { userOrgId: districtId } = this.props;
    const { schoolsState } = this.state;
    const schoolsData = { ...schoolsState };

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
    const { schoolsState } = this.state;
    this.setState(prevState => ({
      ...prevState,
      schoolsState: {
        ...schoolsState,
        fetching: false,
        value
      }
    }));
  };

  render() {
    const iconSize = {
      width: "12px",
      height: "12px"
    };
    const {
      form: { getFieldDecorator },
      closeModal,
      showModal,
      formTitle,
      fetchClassDetailsUsingCode,
      validatedClassDetails,
      addNewUser,
      resetClassDetails,
      location: { pathname }
    } = this.props;

    const { isUserExists, userInfo, userExistsInClass } = this.state;

    const { role, schoolsState, selectedSchoolId, disabledSchool } = this.state;
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
        <EduButton height="40px" isGhost data-cy="cancel" onClick={() => closeModal()}>
          No, Cancel
        </EduButton>
        <EduButton
          height="40px"
          data-cy="addUser"
          onClick={() => addNewUser(userInfo)}
          disabled={!isValidClassCode || userExistsInClass}
        >
          {role === "student" ? "Yes, Add Student" : "Yes, Add User"}
          <Icon type="right" />
        </EduButton>
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

    const validateName = (rule, value, callback) => {
      if (!nameValidator(value)) {
        callback("The input is not valid name");
      } else {
        callback();
      }
    };

    return (
      <StyledModal
        title={title}
        footer={footer}
        visible={showModal}
        onCancel={() => closeModal()}
        destroyOnClose
        afterClose={this.resetFormData}
      >
        <Form>
          <Collapse accordion defaultActiveKey={keys} expandIcon={expandIcon} expandIconPosition="right">
            <Panel header={BasicDetailsHeader} key="basic">
              <Field name="code">
                <legend>Class Code</legend>
                <Form.Item>
                  {getFieldDecorator("code", {
                    rules: [{ required: true, message: "Please enter valid class code" }],
                    initialValue: ""
                  })(
                    <Input
                      prefix={<img style={iconSize} src={hashIcon} alt="" />}
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
                    rules: [{ validator: this.validateEmailValue }],
                    initialValue: ""
                  })(
                    <Input
                      data-cy="username"
                      prefix={<img style={iconSize} src={mailIcon} alt="" />}
                      placeholder="Enter Username/email"
                      disabled={!isValidClassCode}
                    />
                  )}
                  {isUserExists && !userExistsInClass && <InputMessage>User exists and will be enrolled.</InputMessage>}
                </Form.Item>
              </Field>
              <Field name="role">
                <legend>Role</legend>
                <Form.Item>
                  {getFieldDecorator("role", { initialValue: role })(
                    <Select
                      disabled={pathname.split("/").includes("class-enrollment")}
                      onSelect={this.onRoleChange}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
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
                    validateTrigger: ["onBlur"],
                    rules: [{ validator: validateName }, { max: 128, message: "Must less than 128 characters!" }],
                    initialValue: ""
                  })(
                    <Input
                      prefix={<img style={iconSize} src={userIcon} alt="" />}
                      placeholder="Enter the name of user"
                      disabled={isUserExists || userExistsInClass || !isValidClassCode}
                    />
                  )}
                </Form.Item>
              </Field>
              <Field name="password">
                <legend>Password</legend>
                <Form.Item>
                  {getFieldDecorator("password")(
                    <Input
                      prefix={<img style={iconSize} src={keyIcon} alt="" />}
                      type="password"
                      placeholder="Enter Password"
                      autoComplete="new-password"
                      disabled={isUserExists || userExistsInClass || !isValidClassCode}
                    />
                  )}
                </Form.Item>
              </Field>
              <Field name="confirmPassword">
                <legend>Confirm Password</legend>
                <Form.Item>
                  {getFieldDecorator("confirmPassword", {
                    rules: [{ validator: this.confirmPwdCheck, message: "Retyped password do not match." }]
                  })(
                    <Input
                      prefix={<img style={iconSize} src={keyIcon} alt="" />}
                      type="password"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      disabled={isUserExists || userExistsInClass || !isValidClassCode}
                    />
                  )}
                </Form.Item>
              </Field>
              {role === "teacher" && (
                <Field name="institutionIds">
                  <legend>Select School</legend>
                  <Form.Item>
                    {getFieldDecorator("institutionIds", {
                      initialValue: selectedSchoolId,
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
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        disabled={disabledSchool || !isValidClassCode}
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
                <Form.Item>{getFieldDecorator("sisId")(<Input placeholder="Enter SIS ID" disabled />)}</Form.Item>
              </Field>
              <Field name="studentNumber">
                <legend>Student Number</legend>
                <Form.Item>
                  {getFieldDecorator("studentNumber")(<Input placeholder="Enter Student Number" disabled />)}
                </Form.Item>
              </Field>
              <Field name="frlStatus">
                <legend>Free Reduced Lunch</legend>
                <Form.Item>
                  {getFieldDecorator("frlStatus")(
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
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
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
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
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
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
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
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
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
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
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
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
