import React from "react";
import moment from "moment";
import { get, split, unset, pickBy, identity, isEmpty } from "lodash";
import { Icon, Collapse, Spin, Input, Select, DatePicker, message } from "antd";
import { IconUser } from "@edulastic/icons";
import { userApi } from "@edulastic/api";
import { isEmailValid } from "../../utils/helpers";

import { StyledModal, Title, ActionButton, PanelHeader, Field, Form, FooterDiv } from "./styled";

const { Panel } = Collapse;
class UserForm extends React.Component {
  state = {
    keys: ["basic"]
  };

  onProceed = () => {
    const searchResult = this.props.userSearchResult;
    if (!isEmpty(searchResult)) {
      message.error("Email already exists");
      return;
    }
    this.props.form.validateFields((err, row) => {
      if (!err) {
        const { modalData, modalFunc, userOrgId: districtId } = this.props;
        if (row.dob) {
          row.dob = moment(row.dob).format("x");
        }
        const contactEmails = get(row, "contactEmails");
        if (contactEmails) {
          row.contactEmails = [contactEmails];
        }
        unset(row, ["confirmPassword"]);
        const nRow = pickBy(row, identity);
        modalFunc({
          userId: modalData._id,
          data: Object.assign(nRow, {
            districtId
          })
        });
      }
    });
    this.props.closeModal();
  };

  confirmPwdCheck = (rule, value, callback) => {
    const pwd = this.props.form.getFieldValue("password");
    if (pwd !== value) {
      callback(rule.message);
    } else {
      callback();
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      closeModal,
      userOrgId: districtId,
      showModal,
      formTitle,
      role,
      showAdditionalFields,
      modalData: { _source } = {},
      buttonText,
      isStudentEdit,
      searchUserRequest
    } = this.props;
    const dobValue = get(_source, "dob");
    const contactEmails = get(_source, "contactEmails");
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

        <ActionButton type="primary" onClick={() => this.onProceed()}>
          {buttonText || `Yes, Update`}
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
              {isStudentEdit && (
                <Field name="Username">
                  <legend>Username</legend>
                  <Form.Item>
                    {getFieldDecorator("username", {
                      initialValue: get(_source, "username", get(_source, "username", ""))
                    })(<Input placeholder="Enter Username/email" disabled={true} />)}
                  </Form.Item>
                </Field>
              )}
              {!isStudentEdit && (
                <Field name="email">
                  <legend>Username/Email</legend>
                  <Form.Item>
                    {getFieldDecorator("email", {
                      rules: [{ required: true, message: "Please enter valid username" }],
                      initialValue: get(_source, "username", get(_source, "email", ""))
                    })(<Input placeholder="Enter Username/email" disabled={true} />)}
                  </Form.Item>
                </Field>
              )}
              <Field name="firstName">
                <legend>First Name</legend>
                <Form.Item>
                  {getFieldDecorator("firstName", {
                    rules: [
                      { required: true, message: "Please provide user first name" },
                      { max: 128, message: "Must less than 128 characters!" }
                    ],
                    initialValue: get(_source, "firstName", "")
                  })(<Input placeholder="Enter the first name of the user" />)}
                </Form.Item>
              </Field>
              <Field name="lastName">
                <legend>Last name</legend>
                <Form.Item>
                  {getFieldDecorator("lastName", { initialValue: get(_source, "lastName", "") })(
                    <Input placeholder="Enter the last name of the user" />
                  )}
                </Form.Item>
              </Field>
              {isStudentEdit && (
                <Field name="email">
                  <legend>Email</legend>
                  <Form.Item>
                    {getFieldDecorator("email", {
                      validateTrigger: ["onBlur"],
                      rules: [
                        {
                          validator: (rule, value, callback) =>
                            isEmailValid(rule, value, callback, "email", "Please enter valid email")
                        }
                      ],
                      initialValue: get(_source, "email", get(_source, "email", ""))
                    })(
                      <Input
                        onBlur={evt => searchUserRequest({ username: evt.target.value, districtId })}
                        placeholder="Enter email"
                      />
                    )}
                  </Form.Item>
                </Field>
              )}
              <Field name="password">
                <legend>Password</legend>
                <Form.Item>
                  {getFieldDecorator("password")(<Input type="password" placeholder="Enter Password" />)}
                </Form.Item>
              </Field>
              <Field name="confirmPassword">
                <legend>Confirm Password</legend>
                <Form.Item>
                  {getFieldDecorator("confirmPassword", {
                    rules: [{ validator: this.confirmPwdCheck, message: "Retyped password do not match." }]
                  })(<Input type="password" placeholder="Confirm Password" />)}
                </Form.Item>
              </Field>
            </Panel>
            {showAdditionalFields && (
              <Panel header={AdditionalDetailsHeader} key="additional">
                <Field name="sisId">
                  <legend>SIS ID</legend>
                  <Form.Item>
                    {getFieldDecorator("sisId", { initialValue: get(_source, "sisId", "") })(
                      <Input placeholder="Enter SIS ID" />
                    )}
                  </Form.Item>
                </Field>
                <Field name="studentNumber">
                  <legend>Student Number</legend>
                  <Form.Item>
                    {getFieldDecorator("studentNumber", { initialValue: get(_source, "studentNumber", "") })(
                      <Input placeholder="Enter Student Number" />
                    )}
                  </Form.Item>
                </Field>
                <Field name="frlStatus">
                  <legend>Free Reduced Lunch</legend>
                  <Form.Item>
                    {getFieldDecorator("frlStatus", { initialValue: get(_source, "frlStatus", "") })(
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
                    {getFieldDecorator("iepStatus", { initialValue: get(_source, "iepStatus", "") })(
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
                    {getFieldDecorator("ellStatus", { initialValue: get(_source, "ellStatus", "") })(
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
                    {getFieldDecorator("sedStatus", { initialValue: get(_source, "sedStatus", "") })(
                      <Select>
                        <Option value="active">Yes</Option>
                        <Option value="deActive">No</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Field>
                <Field name="race">
                  <legend>Race</legend>
                  <Form.Item>
                    {getFieldDecorator("race", { initialValue: get(_source, "race", "") })(
                      <Input placeholder="Race" />
                    )}
                  </Form.Item>
                </Field>

                <Field name="dob" optional>
                  <legend>DOB</legend>
                  <Form.Item>
                    {getFieldDecorator("dob", { initialValue: dobValue ? moment(dobValue) : null })(
                      <DatePicker format="DD MMM, YYYY" />
                    )}
                  </Form.Item>
                </Field>
                <Field name="gender">
                  <legend>Gender</legend>
                  <Form.Item>
                    {getFieldDecorator("gender", { initialValue: get(_source, "gender", "") })(
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
                  <Form.Item>
                    {getFieldDecorator("contactEmails", { initialValue: contactEmails ? contactEmails.join(",") : "" })(
                      <Input placeholder="Enter Contact" />
                    )}
                  </Form.Item>
                </Field>
                <Field name="tts">
                  <legend>Enable Text To Speech</legend>
                  <Form.Item>
                    {getFieldDecorator("tts", { initialValue: get(_source, "tts", "") })(
                      <Select>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Field>
              </Panel>
            )}
          </Collapse>
        </Form>
      </StyledModal>
    );
  }
}
export const UserFormModal = Form.create({ name: "user_form_modal" })(UserForm);
