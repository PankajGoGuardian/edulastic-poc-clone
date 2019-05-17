import React from "react";
import PropTypes from "prop-types";
import * as moment from "moment";
import { Input, Select, DatePicker } from "antd";
import Field from "./CustomField";

const { Option } = Select;
const initDOB = moment().add(-10, "years");

const AdditionalFields = ({ std, ...restProps }) => {
  const { sisId, studentNumber, iepStatus, ellStatus, sedStatus, frlStatus, race, dob, gender, contactEmails } = std;
  return (
    <>
      <Field label="SIS ID" {...restProps} fiedlName="sisId" initialValue={sisId}>
        <Input placeholder="Enter SIS ID" />
      </Field>
      <Field label="Student Number" {...restProps} fiedlName="studentNumber" initialValue={studentNumber}>
        <Input placeholder="Enter Student Number" />
      </Field>
      <Field label="Free Reduced Lunch" {...restProps} fiedlName="frlStatus" initialValue={frlStatus}>
        <Select>
          <Option value="active">Yes</Option>
          <Option value="deActive">No</Option>
        </Select>
      </Field>
      <Field label="Individual Education Plan" {...restProps} fiedlName="iepStatus" initialValue={iepStatus}>
        <Select>
          <Option value="active">Yes</Option>
          <Option value="deActive">No</Option>
        </Select>
      </Field>
      <Field label="English Language Learner" {...restProps} fiedlName="ellStatus" initialValue={ellStatus}>
        <Select>
          <Option value="active">Yes</Option>
          <Option value="deActive">No</Option>
        </Select>
      </Field>
      <Field label="Special ED" {...restProps} fiedlName="sedStatus" initialValue={sedStatus}>
        <Select>
          <Option value="active">Yes</Option>
          <Option value="deActive">No</Option>
        </Select>
      </Field>
      <Field label="Race" {...restProps} fiedlName="race" initialValue={race}>
        <Input placeholder="Race" />
      </Field>
      <Field label="DOB" optional {...restProps} fiedlName="dob" initialValue={moment(dob || initDOB)}>
        <DatePicker data-cy="endDate" format="DD MMM, YYYY" placeholder="End Date" />
      </Field>
      <Field label="Gender" {...restProps} fiedlName="gender" initialValue={gender}>
        <Select>
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Field>
      <Field label="Contact" {...restProps} fiedlName="contactEmails" initialValue={contactEmails}>
        <Input placeholder="Enter Contact" />
      </Field>
    </>
  );
};

AdditionalFields.propTypes = {
  std: PropTypes.object,
  isEdit: PropTypes.bool
};

AdditionalFields.defaultProps = {
  std: {},
  isEdit: false
};

export default AdditionalFields;
