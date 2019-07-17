import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import { Input } from "antd";
import { Form } from "antd";
import { Field } from "./styled";
import { userApi } from "@edulastic/api";
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
  ...restProps
}) => {
  if (!isEmpty(stds[0])) {
    var { email, firstName, lastName } = stds[0];
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
      username: value
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

  return (
    <>
      {!isEdit ? (
        <Field name="email">
          <legend>Username/Email</legend>
          {enroll && "user exists and will be enrolled"}
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [{ validator: checkUser }, ...commonEmailValidations]
            })(<Input placeholder="Enter Username" />)}
          </Form.Item>
        </Field>
      ) : (
        <Field name="email">
          <legend>Username/Email</legend>
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [...commonEmailValidations],
              initialValue: email
            })(<Input placeholder="Enter Username" />)}
          </Form.Item>
        </Field>
      )}

      {!isEdit && (
        <Field name="fullName">
          <legend>Name of User</legend>
          <Form.Item>
            {getFieldDecorator("fullName", {
              rules: [
                { required: true, message: "Please provide user full name" },
                { max: 128, message: "Must less than 128 characters!" }
              ]
            })(<Input placeholder="Enter the name of the user" disabled={enroll} />)}
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
              })(<Input placeholder="Enter the first name of the user" />)}
            </Form.Item>
          </Field>
          <Field name="lastName">
            <legend>Last name</legend>
            <Form.Item>
              {getFieldDecorator("lastName", {
                initialValue: lastName || ""
              })(<Input placeholder="Enter the last name of the user" />)}
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
              })(<Input type="password" placeholder="Enter Password" disabled={enroll} />)}
            </Form.Item>
          </Field>
          <Field name="confirmPassword">
            <legend>Confirm Password</legend>
            <Form.Item>
              {getFieldDecorator("confirmPassword", {
                rules: [{ validator: confirmPwdCheck, message: "Retyped password do not match." }]
              })(<Input type="password" placeholder="Confirm Password" disabled={enroll} />)}
            </Form.Item>
          </Field>
        </>
      ) : (
        <>
          <Field name="password">
            <legend>Password</legend>
            <Form.Item>
              {getFieldDecorator("password", {})(<Input type="password" placeholder="Enter Password" />)}
            </Form.Item>
          </Field>
          <Field name="confirmPassword">
            <legend>Confirm Password</legend>
            <Form.Item>
              {getFieldDecorator("confirmPassword", {
                rules: [{ validator: confirmPwdCheck, message: "Retyped password do not match." }]
              })(<Input type="password" placeholder="Confirm Password" />)}
            </Form.Item>
          </Field>
        </>
      )}
    </>
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
