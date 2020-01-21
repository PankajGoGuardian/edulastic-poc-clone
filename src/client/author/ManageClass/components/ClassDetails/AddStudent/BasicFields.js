import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import { Input } from "antd";
import { Form } from "antd";
import { Field } from "./styled";
import { userApi } from "@edulastic/api";
import styled from "styled-components";
import { IconLock, IconHash, IconUser, IconMail } from "@edulastic/icons";
import { themeColor, boxShadowDefault } from "@edulastic/colors";
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
  resetClassDetails = () => {},
  validatedClassDetails,
  ...restProps
}) => {
  const _className = get(validatedClassDetails, "groupInfo.name", "");

  if (!isEmpty(stds[0])) {
    var { email, firstName, lastName, username, googleId, canvasId, cliId, cleverId } = stds[0];
  }

  const [userExistsInClass, setUserExistsInClass] = useState(false);

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
    const { code = "" } = get(validatedClassDetails, "groupInfo", {});
    if (isUpdate) setIsUpdate(!isUpdate);
    if (enroll) {
      setFields({
        fullName: {
          value: ""
        }
      });
      setEnroll(false);
    }

    let result = [];

    try {
      result = await userApi.checkUser({
        username: value,
        districtId,
        classCode: code
      });
    } catch (error) {
      callback("Invalid input");
      console.log(error);
      if (error) return null;
    }

    const user = result[0] || {};

    if (user.existInClass) {
      setUserExistsInClass(true);
      setFields({
        email: {
          value,
          errors: [new Error("User already part of this class")]
        }
      });
      callback("User already part of this class");
      return null;
    }

    setUserExistsInClass(false);
    let errorMsg = "";
    if (result.length > 0) {
      let foundUser = user;
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

  useEffect(() => {
    resetClassDetails();
  }, []);

  return (
    <FormBody>
      {showClassCodeField && (
        <Field name="ClassCode">
          <legend>Class Code</legend>
          <Form.Item>
            {getFieldDecorator("code", {
              validateTrigger: ["onBlur"],
              rules: [{ required: true, message: "Please input the destination class" }]
            })(
              <Input
                data-cy="classCode"
                prefix={<IconHash color={themeColor} />}
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
          <legend>Username</legend>
          <Form.Item>
            {getFieldDecorator("email", {
              validateTrigger: ["onBlur"],
              rules: [{ validator: checkUser }, ...commonEmailValidations]
            })(<Input data-cy="username" prefix={<IconMail color={themeColor} />} placeholder="Enter Username" />)}
            {enroll && "user exists and will be enrolled"}
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
                prefix={<IconUser color={themeColor} />}
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
                prefix={<IconUser color={themeColor} />}
                placeholder="Enter the name of the user"
                disabled={enroll || userExistsInClass}
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
                validateTrigger: ["onBlur"],
                rules: [{ validator: checkFirstName }],
                initialValue: firstName || ""
              })(
                <Input
                  data-cy="fname"
                  prefix={<IconUser color={themeColor} />}
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
                  prefix={<IconUser color={themeColor} />}
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
                  prefix={<IconLock color={themeColor} />}
                  type="password"
                  placeholder="Enter Password"
                  autoComplete="new-password"
                  disabled={enroll || userExistsInClass}
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
                  prefix={<IconLock color={themeColor} />}
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  disabled={enroll || userExistsInClass}
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
                <Input
                  prefix={<IconLock color={themeColor} />}
                  type="password"
                  placeholder="Enter Password"
                  autoComplete="new-password"
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
                  prefix={<IconLock color={themeColor} />}
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                />
              )}
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
  background: white;
  padding: 2rem 2rem 1.2rem 2rem;
  margin-bottom: 20px;
  box-shadow: ${boxShadowDefault};
  border-radius: 2px;
  .ant-input-affix-wrapper {
    .ant-input-prefix {
      width: 15px;
    }
  }
`;
