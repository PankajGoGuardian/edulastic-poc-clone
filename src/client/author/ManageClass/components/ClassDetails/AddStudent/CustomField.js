import { userApi } from "@edulastic/api";
import { FieldLabel } from "@edulastic/common";
import { Form } from "antd";
import { get, includes } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Field } from "./styled";

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateEmailCommaSeparated(rule, value, callback) {
  const emails = value.split(",").map(x => x.trim());
  const invalidEmail = emails.find(email => !validateEmail(email));
  if (invalidEmail) {
    callback(rule.message);
  } else {
    callback();
  }
}

// eslint-disable-next-line max-len
const CustomField = ({
  label,
  children,
  getFieldDecorator,
  fiedlName,
  initialValue,
  getFieldValue,
  isEdit,
  students,
  districtId,
  setFields
}) => {
  const confirmPwdCheck = (rule, value, callback) => {
    const pwd = getFieldValue("password");

    if (pwd !== value) {
      callback(rule.message);
    } else {
      callback();
    }
  };

  const checkEmail = async (rule, value, callback) => {
    setFields({
      fullName: {
        value: ""
      }
    });
    const result = await userApi.checkUser({
      districtId,
      username: value,
      role: "student"
    });
    let errorMsg = "";
    let isSameClass = false;
    if (result.length > 0) {
      const foundUser = result[0];
      students.forEach(student => {
        if (student._id == foundUser._id) {
          isSameClass = true;
        }
      });
      if (isSameClass) {
        errorMsg = "User already part of this class section";
      } else {
        const isSameDistrict = includes(foundUser.districtIds || [], districtId);
        if (isSameDistrict) {
          if (foundUser.role == "teacher")
            errorMsg = "User exists in the current district as an Instructor and can't be added to this class";
          else {
            errorMsg = "User exists and will be enrolled";
            setFields({
              fullName: {
                value: foundUser.firstName
              }
            });
          }
        } else {
          errorMsg = "Username already exists";
        }
      }
      if (errorMsg !== "") {
        callback(errorMsg);
      }
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

  const emailValidations = isEdit
    ? [...commonEmailValidations]
    : [{ validator: checkEmail }, ...commonEmailValidations];

  const validations = {
    email: emailValidations,
    fullName: [
      { required: true, message: "Please provide user full name" },
      { max: 128, message: "Must less than 128 characters!" }
    ],
    password: [
      { required: !isEdit, message: "Please provide a valid password" },
      { min: 6, message: "Must larger than 6 characters!" }
    ],
    confirmPwd: [{ validator: confirmPwdCheck, message: "Retyped password do not match." }],
    sisId: [{ max: 40, message: "Must less than 40 characters!" }],
    studentNumber: [{ max: 40, message: "Must less than 40 characters!" }],
    frlStatus: [],
    enlStatus: [],
    sedStatus: [],
    race: [{ max: 40, message: "Must less than 40 characters!" }],
    iepStatus: [],
    dob: [],
    gender: [],
    contactEmails: [
      { validator: validateEmailCommaSeparated, message: "Please provide a valid Email Id in comma separated form" },
      { max: 256, message: "Must less than 256 characters!" }
    ]
  };

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Form.Item>
        {getFieldDecorator(fiedlName, {
          rules: validations[fiedlName],
          // validateTrigger: fiedlName === "email" ? "onBlur" : "onChange",
          initialValue
        })(children)}
      </Form.Item>
    </Field>
  );
};

CustomField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  fiedlName: PropTypes.string,
  initialValue: PropTypes.any,
  label: PropTypes.string,
  children: PropTypes.node,
  isEdit: PropTypes.bool,
  students: PropTypes.array.isRequired
};

CustomField.defaultProps = {
  fiedlName: "unknown",
  label: "",
  initialValue: null,
  children: null,
  isEdit: false
};

// This component for author account so get first Id from districtIds
export default connect(state => ({
  students: get(state, "manageClass.studentsList", []),
  districtId: get(state, "user.user.orgData.districtIds[0]", "")
}))(CustomField);
