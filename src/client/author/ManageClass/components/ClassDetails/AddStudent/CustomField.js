import React from "react";
import PropTypes from "prop-types";
import { Form } from "antd";
import { Field } from "./styled";

// eslint-disable-next-line max-len
const CustomField = ({ label, children, getFieldDecorator, fiedlName, initialValue, getFieldValue, isEdit }) => {
  const confirmPwdCheck = (rule, value, callback) => {
    const pwd = getFieldValue("password");

    if (pwd !== value) {
      callback(rule.message);
    } else {
      callback();
    }
  };

  const validations = {
    email: [
      { required: true, message: "Please provide valid Username or Email id" },
      { max: 256, message: "Must less than 256 characters!" }
    ],
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
      { type: "email", message: "Please provide a valid Email Id" },
      { max: 256, message: "Must less than 256 characters!" }
    ]
  };

  return (
    <Field>
      <legend>{label}</legend>
      <Form.Item>
        {getFieldDecorator(fiedlName, {
          rules: validations[fiedlName],
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
  isEdit: PropTypes.bool
};

CustomField.defaultProps = {
  fiedlName: "unknown",
  label: "",
  initialValue: null,
  children: null,
  isEdit: false
};

export default CustomField;
