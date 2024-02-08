import {
  DatePickerStyled,
  SelectInputStyled,
  TextInputStyled,
  NumberInputStyled,
} from '@edulastic/common'
import { Select } from 'antd'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import Field from './CustomField'
import { fieldsMapping } from '../../../constants'

const { Option } = Select

const AdditionalFields = ({
  type = 'additional',
  std,
  stds,
  isEdit,
  foundUserContactEmails = [],
  ...restProps
}) => {
  const isEditMode = isEdit && stds && stds.length
  const [studentDetails = {}] = stds || []

  let data = (isEditMode ? studentDetails : std) || {}
  const contactEmails = data.contactEmails || foundUserContactEmails
  const _contactEmails = (contactEmails || []).join(',')

  if (type === 'accommodations') {
    data = data?.accommodations || {}
  }

  return fieldsMapping[type].map((item) => {
    if (item.isDate) {
      return (
        <Field
          label={item.label}
          optional
          {...restProps}
          fiedlName={item.fieldName}
          initialValue={
            data[item.fieldName] ? moment(data[item.fieldName]) : null
          }
        >
          <DatePickerStyled format={item.format} />
        </Field>
      )
    }
    if (item.options) {
      return (
        <Field
          {...restProps}
          label={item.label}
          fiedlName={item.fieldName}
          initialValue={data[item.fieldName]}
        >
          <SelectInputStyled
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            {item.options.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </SelectInputStyled>
        </Field>
      )
    }
    return (
      <Field
        label={item.label}
        {...restProps}
        fiedlName={item.fieldName}
        initialValue={
          item.fieldName === 'contactEmails'
            ? _contactEmails
            : data[item.fieldName]
        }
      >
        {item.isNumber ? (
          <NumberInputStyled min={-1} max={10} step={0.1} />
        ) : (
          <TextInputStyled placeholder={item.placeholder} />
        )}
      </Field>
    )
  })
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
