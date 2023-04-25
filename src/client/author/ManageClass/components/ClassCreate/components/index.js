import React from 'react'
import PropTypes from 'prop-types'
import * as moment from 'moment'
import { EduIf } from '@edulastic/common'
import { Form } from 'antd'
import { Field, Optional, Label } from './styled'

export const FieldLabel = ({
  label,
  optional,
  children,
  getFieldDecorator,
  fiedlName,
  initialValue,
  getFieldValue,
  style = {},
  fieldSetLineHeight,
  showLabel = true,
}) => {
  const checkStartDate = (rule, value, callback) => {
    const diff = moment().diff(value, 'days')
    if (diff > 0) {
      callback(rule.message)
    } else {
      callback()
    }
  }

  const checkEndDate = (rule, value, callback) => {
    const startDate = getFieldValue('startDate')
    const diff = moment(startDate).diff(value, 'days')
    if (diff > 0) {
      callback(rule.message)
    } else {
      callback()
    }
  }

  const validations = {
    name: [
      { required: true, message: 'Please enter a valid class name' },
      { max: 256, message: 'Must less than 256 characters!' },
    ],
    tags: [],
    startDate: [
      { validator: checkStartDate, message: 'Should be later than the today!' },
    ],
    endDate: [
      {
        validator: checkEndDate,
        message: 'Should be later than the Start date',
      },
    ],
    institutionId: [{ required: true, message: 'Please select a School.' }],
  }

  return (
    <Field style={style} fieldSetLineHeight={fieldSetLineHeight}>
      <EduIf condition={showLabel}>
        <Label>
          {label}
          <EduIf condition={optional}>
            <Optional>(Optional)</Optional>
          </EduIf>
        </Label>
      </EduIf>
      <Form.Item>
        {getFieldDecorator(fiedlName, {
          rules: validations[fiedlName],
          initialValue,
        })(children)}
      </Form.Item>
    </Field>
  )
}

FieldLabel.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  fiedlName: PropTypes.string,
  initialValue: PropTypes.any,
  label: PropTypes.string,
  optional: PropTypes.bool,
  children: PropTypes.node,
}

FieldLabel.defaultProps = {
  fiedlName: 'unknown',
  label: '',
  initialValue: null,
  optional: false,
  children: null,
}
