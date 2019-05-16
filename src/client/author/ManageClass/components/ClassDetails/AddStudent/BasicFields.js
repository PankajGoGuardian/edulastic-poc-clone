import React from "react";
import { Input } from "antd";
import Field from "./CustomField";

const BasicFields = ({ ...restProps }) => (
  <>
    <Field label="Username/Email" {...restProps} fiedlName="email">
      <Input placeholder="Enter Username" />
    </Field>
    <Field label="Name of User" {...restProps} fiedlName="fullName">
      <Input placeholder="Enter the name of the user" />
    </Field>
    <Field label="Password" {...restProps} fiedlName="password">
      <Input type="password" placeholder="Enter Password" />
    </Field>
    <Field label="Confirm Password" {...restProps} fiedlName="confirmPwd">
      <Input type="password" placeholder="Confirm Password" />
    </Field>
  </>
);

export default BasicFields;
