import React from "react";
import * as moment from "moment";
import { Input, Select, DatePicker } from "antd";
import Field from "./CustomField";

const { Option } = Select;
const DOB = moment().add(-10, "years");

const AdditionalFields = ({ ...restProps }) => (
  <>
    <Field label="SIS ID" {...restProps} fiedlName="sisId">
      <Input placeholder="Enter SIS ID" />
    </Field>
    <Field label="Student Number" {...restProps} fiedlName="studentNumber">
      <Input placeholder="Enter Student Number" />
    </Field>
    <Field label="Free Reduced Lunch" {...restProps} fiedlName="frlStatus">
      <Select>
        <Option value="active">Yes</Option>
        <Option value="deActive">No</Option>
      </Select>
    </Field>
    <Field label="Individual Education Plan" {...restProps} fiedlName="iepStatus">
      <Select>
        <Option value="active">Yes</Option>
        <Option value="deActive">No</Option>
      </Select>
    </Field>
    <Field label="English Language Learner" {...restProps} fiedlName="ellStatus">
      <Select>
        <Option value="active">Yes</Option>
        <Option value="deActive">No</Option>
      </Select>
    </Field>
    <Field label="Special ED" {...restProps} fiedlName="sedStatus">
      <Select>
        <Option value="active">Yes</Option>
        <Option value="deActive">No</Option>
      </Select>
    </Field>
    <Field label="Race" {...restProps} fiedlName="race">
      <Input placeholder="Race" />
    </Field>
    <Field label="DOB" optional {...restProps} fiedlName="dob" initialValue={moment(DOB)}>
      <DatePicker data-cy="endDate" format="DD MMM, YYYY" placeholder="End Date" />
    </Field>
    <Field label="Gender" {...restProps} fiedlName="gender">
      <Select>
        <Option value="male">Male</Option>
        <Option value="female">Female</Option>
        <Option value="other">Other</Option>
      </Select>
    </Field>
    <Field label="Contact" {...restProps} fiedlName="contactEmails">
      <Input placeholder="Enter Contact" />
    </Field>
  </>
);

export default AdditionalFields;
