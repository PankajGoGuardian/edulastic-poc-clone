import React from "react";
import PropTypes from "prop-types";
import { Form } from "antd";
import { Field, Optional } from "./styled";
import validations from "./validations";

export const FieldLabel = ({ label, optional, children, getFieldDecorator, fiedlName, initialValue }) => (
  <Field>
    <legend>
      {label}
      {optional && <Optional>(Optional)</Optional>}
    </legend>
    <Form.Item>
      {getFieldDecorator(fiedlName, {
        rules: validations[fiedlName],
        initialValue
      })(children)}
    </Form.Item>
  </Field>
);

FieldLabel.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
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
