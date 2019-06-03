import React from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
import Field from "./CustomField";

const BasicFields = ({ std, isEdit, ...restProps }) => {
  const { email, firstName, lastName } = std;
  const emailFieldValue = restProps.getFieldValue("email");
  return (
    <>
      <Field label="Username/Email" {...restProps} fiedlName="email" initialValue={email} isEdit={isEdit}>
        <Input placeholder="Enter Username" />
      </Field>
      {!isEdit && (
        <Field label="Name of User" {...restProps} fiedlName="fullName">
          <Input placeholder="Enter the name of the user" disabled={!emailFieldValue} />
        </Field>
      )}
      {isEdit && (
        <>
          <Field label="First Name" {...restProps} fiedlName="firstName" initialValue={firstName}>
            <Input placeholder="Enter the first name of the user" />
          </Field>
          <Field label="Last Name" {...restProps} fiedlName="lastName" initialValue={lastName}>
            <Input placeholder="Enter the last name of the user" />
          </Field>
        </>
      )}
      <Field label="Password" {...restProps} fiedlName="password" isEdit={isEdit} initialValue="">
        <Input type="password" placeholder="Enter Password" />
      </Field>
      <Field label="Confirm Password" {...restProps} fiedlName="confirmPwd" initialValue="">
        <Input type="password" placeholder="Confirm Password" />
      </Field>
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

export default BasicFields;
