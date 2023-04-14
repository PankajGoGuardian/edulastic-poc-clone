import React from 'react'
import moment from 'moment'
import { Select } from 'antd'
import { EduIf, TextInputStyled, NumberInputStyled } from '@edulastic/common'
import {
  STRING_INPUT,
  DROPDOWN,
  MULTISELECT_DROPDOWN,
  STANDARDS_POPUP,
  NUMBER_INPUT,
  DATEPICKER,
  START_DATE,
} from '../../constants/form'
import {
  StyledDatePicker,
  StyledDropDown,
  SelectWrapper,
} from './styled-components'
import StandardsSelect from '../../../../../../../assessment/containers/QuestionMetadata/StandardsSelect'

const FormField = ({
  formData,
  handleFieldDataChange,
  fieldType,
  placeholder,
  field,
  optionsData = [],
}) => {
  const multiSelectExtraProps =
    fieldType === MULTISELECT_DROPDOWN
      ? { mode: 'multiple', maxTagTextLength: 10 }
      : {}

  const disableStartDates = (date) => {
    const endDate = formData.endDate
    if (endDate && endDate <= date) return true
    return false
  }

  const disableEndDates = (date) => {
    const startDate = formData.startDate
    if (startDate && startDate >= date) return true
    return false
  }

  return (
    <>
      <EduIf condition={fieldType === STRING_INPUT}>
        <TextInputStyled
          placeholder={placeholder}
          value={formData[field]}
          onChange={(e) => {
            handleFieldDataChange(field, e?.target?.value || '')
          }}
        />
      </EduIf>
      <EduIf
        condition={fieldType === DROPDOWN || fieldType === MULTISELECT_DROPDOWN}
      >
        <StyledDropDown
          size="small"
          value={formData[field]}
          onChange={(value) => handleFieldDataChange(field, value)}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          placeholder={placeholder}
          {...multiSelectExtraProps}
        >
          {optionsData.map(({ key, title }) => (
            <Select.Option data-cy={key} key={key} value={key}>
              {title}
            </Select.Option>
          ))}
        </StyledDropDown>
      </EduIf>
      <EduIf condition={fieldType === STANDARDS_POPUP}>
        <SelectWrapper>
          <StandardsSelect
            onChange={(standardsData) =>
              handleFieldDataChange(field, standardsData)
            }
            preventInput
            standardDetails={formData[field]}
            placeholder={placeholder}
            // TODO check how standards need to be saved and standards can be chosen for only 1 subject
          />
        </SelectWrapper>
      </EduIf>
      <EduIf condition={fieldType === NUMBER_INPUT}>
        <NumberInputStyled
          min={1}
          max={100}
          value={formData[field]}
          placeholder={placeholder}
          onChange={(value) => handleFieldDataChange(field, value)}
        />
      </EduIf>
      <EduIf condition={fieldType === DATEPICKER}>
        <StyledDatePicker
          placeholder={placeholder}
          value={moment(formData[field])}
          disabledDate={
            field === START_DATE ? disableStartDates : disableEndDates
          }
          onChange={(date) => {
            handleFieldDataChange(field, +moment.utc(date.format('YYYY-MM-DD')))
          }}
          // TODO check how much duration can user select
        />
      </EduIf>
    </>
  )
}

export default FormField
