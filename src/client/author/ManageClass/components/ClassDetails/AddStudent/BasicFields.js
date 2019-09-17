import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import { Input } from "antd";
import { Form } from "antd";
import { Field } from "./styled";
import { userApi } from "@edulastic/api";
import styled from "styled-components";
import hashIcon from "../../../../../student/assets/hashtag-icon.svg";
import userIcon from "../../../../../student/assets/user-icon.svg";
import mailIcon from "../../../../../student/assets/mail-icon.svg";
import keyIcon from "../../../../../student/assets/key-icon.svg";
const BasicFields = ({
  stds,
  isEdit,
  students,
  districtId,
  getFieldValue,
  setFields,
  getFieldDecorator,
  isUpdate,
  setIsUpdate,
  updateStudent,
  setFounduser,
  modalClose,
  showClassCodeField,
  fetchClassDetailsUsingCode,
  resetClassDetails,
  validatedClassDetails,
  ...restProps
}) => {
  const _className = get(validatedClassDetails, "groupInfo.name", "");

  if (!isEmpty(stds[0])) {
    var { email, firstName, lastName, username, googleId, canvasId, cliId, cleverId } = stds[0];
  }

  const [enroll, setEnroll] = useState(false);
  const confirmPwdCheck = (rule, value, callback) => {
    const pwd = getFieldValue("password");
    if (pwd !== value) {
      callback(rule.message);
    } else {
      callback();
    }
  };
  const commonEmailValidations = [
    { required: true, message: "Please provide valid Username or Email id" },
    {
      // validation so that no white spaces are allowed
      message: "Please provide valid Username or Email id",
      pattern: /^\S*$/
    },
    { max: 256, message: "Must less than 256 characters!" }
  ];

  const checkUser = async (rule, value, callback) => {
    if (isUpdate) setIsUpdate(!isUpdate);
    if (enroll) {
      setFields({
        fullName: {
          value: ""
        }
      });
      setEnroll(false);
    }
    const result = await userApi.checkUser({
      username: value,
      districtId
    });

    let errorMsg = "";
    if (result.length > 0) {
      let foundUser = result[0];
      const isExistingStudent = students.find(
        student => student._id == foundUser._id && student.enrollmentStatus === "1"
      );
      if (isExistingStudent) {
        errorMsg = "User already part of this class section";
      } else {
        let isSameDistrict = foundUser.districtId == districtId;
        if (isSameDistrict) {
          if (foundUser.role === "teacher")
            errorMsg = "User exists in the current district as an Instructor and can't be added to this class";
          else {
            errorMsg = "";
            setEnroll(true);
            setIsUpdate(!isUpdate);
            setFounduser(foundUser._id);
            const firstName = foundUser.firstName ? foundUser.firstName : "";
            const lastName = foundUser.lastName ? foundUser.lastName : "";
            if (foundUser.firstName)
              setFields({
                fullName: {
                  value: firstName + " " + lastName
                }
              });
          }
        }
      }
      if (errorMsg !== "" && !enroll) {
        callback(errorMsg);
      }
    }
  };

  const checkFirstName = (rule, value, callback) => {
    const firstName = value.split(" ")[0];
    if (firstName.length < 3) {
      callback("Name must contains atleast 3 characters");
    } else {
      callback();
    }
  };

  return (
    <FormBody>
      {showClassCodeField && (
        <Field name="ClassCode">
          <legend>Class Code</legend>
          <Form.Item>
            {getFieldDecorator("code", {
              rules: [{ required: true, message: "Please input the destination class" }]
            })(
              <Input
                data-cy="classCode"
                prefix={<img src={hashIcon} alt="" />}
                onBlur={evt => {
                  const classCode = evt.target.value.trim();
                  if (classCode.length) fetchClassDetailsUsingCode(classCode);
                }}
                onChange={evt => {
                  const classCode = evt.target.value.trim();
                  if (!classCode.length) resetClassDetails();
                }}
                placeholder="Enter Class Code"
              />
            )}
            {!isEmpty(_className) && `Class Name : ${_className}`}
          </Form.Item>
        </Field>
      )}
      {!isEdit ? (
        <Field name="email">
          <legend>Username/Email</legend>
          {enroll && "user exists and will be enrolled"}
          <Form.Item>
            {getFieldDecorator("email", {
              validateTrigger: ["onBlur"],
              rules: [{ validator: checkUser }, ...commonEmailValidations]
            })(<Input data-cy="username" prefix={<img src={mailIcon} alt="" />} placeholder="Enter Username" />)}
          </Form.Item>
        </Field>
      ) : (
        <Field name="email">
          <legend>Username/Email</legend>
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [...commonEmailValidations],
              initialValue: email || username
            })(
              <Input
                data-cy="username"
                prefix={<img src={mailIcon} alt="" />}
                placeholder="Enter Username"
                disabled={googleId || canvasId || cliId || cleverId}
              />
            )}
          </Form.Item>
        </Field>
      )}
      {showClassCodeField && (
        <Field name="role">
          <legend>Role</legend>
          <Form.Item>{getFieldDecorator("role", { initialValue: "student" })(<Input disabled={true} />)}</Form.Item>
        </Field>
      )}
      {!isEdit && (
        <Field name="fullName">
          <legend>Name of User</legend>
          <Form.Item>
            {getFieldDecorator("fullName", {
              validateTrigger: ["onBlur"],
              rules: [{ validator: checkFirstName }]
            })(
              <Input
                data-cy="fullName"
                prefix={<img src={userIcon} alt="" />}
                placeholder="Enter the name of the user"
                disabled={enroll}
              />
            )}
          </Form.Item>
        </Field>
      )}
      {isEdit && (
        <>
          <Field name="firstName">
            <legend>First Name</legend>
            <Form.Item>
              {getFieldDecorator("firstName", {
                rules: [
                  { required: true, message: "Please provide user first name" },
                  { max: 128, message: "Must less than 128 characters!" }
                ],
                initialValue: firstName || ""
              })(
                <Input
                  data-cy="fname"
                  prefix={<img src={userIcon} alt="" />}
                  placeholder="Enter the first name of the user"
                />
              )}
            </Form.Item>
          </Field>
          <Field name="lastName">
            <legend>Last name</legend>
            <Form.Item>
              {getFieldDecorator("lastName", {
                initialValue: lastName || ""
              })(
                <Input
                  data-cy="lname"
                  prefix={<img src={userIcon} alt="" />}
                  placeholder="Enter the last name of the user"
                />
              )}
            </Form.Item>
          </Field>
        </>
      )}

      {!isEdit ? (
        <>
          <Field name="password">
            <legend>Password</legend>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: "Please provide a valid password" },
                  { min: 6, message: "Must larger than 6 characters!" }
                ]
              })(
                <Input
                  data-cy="password"
                  prefix={<img src={keyIcon} alt="" />}
                  type="password"
                  placeholder="Enter Password"
                  disabled={enroll}
                />
              )}
            </Form.Item>
          </Field>
          <Field name="confirmPassword">
            <legend>Confirm Password</legend>
            <Form.Item>
              {getFieldDecorator("confirmPassword", {
                rules: [{ validator: confirmPwdCheck, message: "Retyped password do not match." }]
              })(
                <Input
                  data-cy="confirmPassword"
                  prefix={<img src={keyIcon} alt="" />}
                  type="password"
                  placeholder="Confirm Password"
                  disabled={enroll}
                />
              )}
            </Form.Item>
          </Field>
        </>
      ) : (
        <>
          <Field name="password">
            <legend>Password</legend>
            <Form.Item>
              {getFieldDecorator("password", {})(
                <Input prefix={<img src={keyIcon} alt="" />} type="password" placeholder="Enter Password" />
              )}
            </Form.Item>
          </Field>
          <Field name="confirmPassword">
            <legend>Confirm Password</legend>
            <Form.Item>
              {getFieldDecorator("confirmPassword", {
                rules: [{ validator: confirmPwdCheck, message: "Retyped password do not match." }]
              })(<Input prefix={<img src={keyIcon} alt="" />} type="password" placeholder="Confirm Password" />)}
            </Form.Item>
          </Field>
        </>
      )}
    </FormBody>
  );
};

BasicFields.propTypes = {
  std: PropTypes.object,
  isEdit: PropTypes.bool
};

// eslint-disable-next-line no-unused-expressions
BasicFields.defaultProps = {
  std: {},
  isEdit: false
};

export default connect(state => ({
  students: get(state, "manageClass.studentsList", []),
  districtId: get(state, "user.user.orgData.districtId", "")
}))(BasicFields);

const FormBody = styled.div`
  .ant-input-affix-wrapper {
    .ant-input-prefix {
      width: 15px;
    }
  }
`;
