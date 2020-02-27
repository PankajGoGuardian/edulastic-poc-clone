import React from "react";
import PropTypes from "prop-types";
import * as moment from "moment";
import { Input, Select, DatePicker } from "antd";
import Field from "./CustomField";

const { Option } = Select;

const AdditionalFields = ({ std, stds, isEdit, showTtsField, ...restProps }) => {
  let { sisId, studentNumber, iepStatus, ellStatus, sedStatus, frlStatus, race, dob, gender, contactEmails } = std;
  if (isEdit && stds && stds.length) {
    const [studentDetails = {}] = stds;
    ({
      sisId,
      studentNumber,
      iepStatus,
      ellStatus,
      sedStatus,
      frlStatus,
      race,
      dob,
      gender,
      contactEmails
    } = studentDetails);
    contactEmails = contactEmails && contactEmails.join(",");
  }

  const dateProps = {};
  if (dob) {
    dateProps.initialValue = moment(dob);
  }
  return (
    <>
      <Field label="SIS ID" {...restProps} fiedlName="sisId" initialValue={sisId}>
        <Input placeholder="Enter SIS ID" />
      </Field>
      <Field label="Student Number" {...restProps} fiedlName="studentNumber" initialValue={studentNumber}>
        <Input placeholder="Enter Student Number" />
      </Field>
      <Field label="Free Reduced Lunch" {...restProps} fiedlName="frlStatus" initialValue={frlStatus}>
        <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
          <Option value="active">Yes</Option>
          <Option value="deActive">No</Option>
        </Select>
      </Field>
      <Field label="Individual Education Plan" {...restProps} fiedlName="iepStatus" initialValue={iepStatus}>
        <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
          <Option value="active">Yes</Option>
          <Option value="deActive">No</Option>
        </Select>
      </Field>
      <Field label="English Language Learner" {...restProps} fiedlName="ellStatus" initialValue={ellStatus}>
        <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
          <Option value="active">Yes</Option>
          <Option value="deActive">No</Option>
        </Select>
      </Field>
      <Field label="Special ED" {...restProps} fiedlName="sedStatus" initialValue={sedStatus}>
        <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
          <Option value="active">Yes</Option>
          <Option value="deActive">No</Option>
        </Select>
      </Field>
      <Field label="Race" {...restProps} fiedlName="race" initialValue={race}>
        <Input placeholder="Race" />
      </Field>
      <Field label="DOB" optional {...restProps} fiedlName="dob" {...dateProps}>
        <DatePicker format="DD MMM, YYYY" />
      </Field>
      <Field label="Gender" {...restProps} fiedlName="gender" initialValue={gender}>
        <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Field>
      <Field label="Parents/Guardians" {...restProps} fiedlName="contactEmails" initialValue={contactEmails}>
        <Input placeholder="Enter email comma separated..." />
      </Field>

      {showTtsField && (
        <Field label="Enable Text to Speech" {...restProps} fiedlName="tts">
          <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
            <Option value="yes">Yes</Option>
            <Option value="no">No</Option>
          </Select>
        </Field>
      )}
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
