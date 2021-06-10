import {
  DatePickerStyled,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Select } from 'antd'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import Field from './CustomField'

const { Option } = Select

const AdditionalFields = ({
  std,
  stds,
  isEdit,
  showTtsField,
  foundUserContactEmails,
  ...restProps
}) => {
  const isEditMode = isEdit && stds && stds.length
  const [studentDetails = {}] = stds || []

  const {
    sisId,
    studentNumber,
    iepStatus,
    ellStatus,
    sedStatus,
    hispanicEthnicity,
    frlStatus,
    race,
    dob,
    gender,
    contactEmails = foundUserContactEmails,
  } = isEditMode ? studentDetails : std

  const _contactEmails = (contactEmails || []).join(',')

  const dateProps = {}
  if (dob) {
    dateProps.initialValue = moment(dob)
  }
  return (
    <>
      <Field
        label="SIS ID"
        {...restProps}
        fiedlName="sisId"
        initialValue={sisId}
      >
        <TextInputStyled placeholder="Enter SIS ID" />
      </Field>
      <Field
        label="Student Number"
        {...restProps}
        fiedlName="studentNumber"
        initialValue={studentNumber}
      >
        <TextInputStyled placeholder="Enter Student Number" />
      </Field>
      <Field
        label="Free Reduced Lunch"
        {...restProps}
        fiedlName="frlStatus"
        initialValue={frlStatus}
      >
        <SelectInputStyled
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </SelectInputStyled>
      </Field>
      <Field
        label="Individual Education Plan"
        {...restProps}
        fiedlName="iepStatus"
        initialValue={iepStatus}
      >
        <SelectInputStyled
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </SelectInputStyled>
      </Field>
      <Field
        label="English Language Learner"
        {...restProps}
        fiedlName="ellStatus"
        initialValue={ellStatus}
      >
        <SelectInputStyled
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </SelectInputStyled>
      </Field>
      <Field
        label="Special ED"
        {...restProps}
        fiedlName="sedStatus"
        initialValue={sedStatus}
      >
        <SelectInputStyled
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </SelectInputStyled>
      </Field>
      <Field
        label="Hispanic Ethnicity"
        {...restProps}
        fiedlName="hispanicEthnicity"
        initialValue={hispanicEthnicity}
      >
        <SelectInputStyled
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </SelectInputStyled>
      </Field>
      <Field label="Race" {...restProps} fiedlName="race" initialValue={race}>
        <TextInputStyled placeholder="Race" />
      </Field>
      <Field label="DOB" optional {...restProps} fiedlName="dob" {...dateProps}>
        <DatePickerStyled format="DD MMM, YYYY" />
      </Field>
      <Field
        label="Gender"
        {...restProps}
        fiedlName="gender"
        initialValue={gender}
      >
        <SelectInputStyled
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </SelectInputStyled>
      </Field>
      <Field
        label="Parents/Guardians"
        {...restProps}
        fiedlName="contactEmails"
        initialValue={_contactEmails}
      >
        <TextInputStyled placeholder="Enter email comma separated..." />
      </Field>

      {showTtsField && (
        <Field label="Enable Text to Speech" {...restProps} fiedlName="tts">
          <SelectInputStyled
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            <Option value="yes">Yes</Option>
            <Option value="no">No</Option>
          </SelectInputStyled>
        </Field>
      )}
    </>
  )
}

AdditionalFields.propTypes = {
  std: PropTypes.object,
  isEdit: PropTypes.bool,
}

AdditionalFields.defaultProps = {
  std: {},
  isEdit: false,
}

export default AdditionalFields
