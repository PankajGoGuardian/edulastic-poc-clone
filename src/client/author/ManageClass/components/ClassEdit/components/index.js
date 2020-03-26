import React from "react";
import * as moment from "moment";
import PropTypes from "prop-types";
import { Form } from "antd";
import { Field, Optional, Label } from "./styled";

export const FieldLabel = ({
  label,
  optional,
  children,
  getFieldDecorator,
  getFieldValue,
  fiedlName,
  initialValue,
  disabled = false
}) => {
  const checkEndDate = (rule, value, callback) => {
    const startDate = getFieldValue("startDate");
    const diff = moment(startDate).diff(value, "days");
    if (diff > 0) {
      callback(rule.message);
    } else {
      callback();
    }
  };

  const validations = {
    name: [
      { required: true, message: "Please enter a valid class name" },
      { max: 256, message: "Must less than 256 characters!" }
    ],
    startDate: [],
    endDate: [{ validator: checkEndDate, message: "Should be later than the Start date" }],
    subject: [{ required: !disabled, message: "Please select a subject." }],
    grades: [{ required: !disabled, message: "Please select a Grade." }],
    institutionId: [{ required: !disabled, message: "Please select a School." }],
    tags: []
  };

  return (
    <Field>
      <Label>
        {label}
        {optional && <Optional>(Optional)</Optional>}
      </Label>
      <Form.Item>
        {getFieldDecorator(fiedlName, {
          rules: validations[fiedlName],
          initialValue
        })(children)}
      </Form.Item>
    </Field>
  );
};

FieldLabel.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  fiedlName: PropTypes.string,
  initialValue: PropTypes.any,
  label: PropTypes.string,
  optional: PropTypes.bool,
  children: PropTypes.node
};

FieldLabel.defaultProps = {
  fiedlName: "unknown",
  label: "",
  initialValue: null,
  optional: false,
  children: null
};
