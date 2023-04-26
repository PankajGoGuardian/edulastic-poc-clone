import { EduIf, NumberInputStyled, TextInputStyled } from '@edulastic/common'
import { Select } from 'antd'
import moment from 'moment'
import React from 'react'

import StandardsSelect from '../../../../../../../../assessment/containers/QuestionMetadata/StandardsSelect'
import Tags from '../../../../../../../ManageClass/components/ClassCreate/components/Tags'
import {
  DATEPICKER,
  DROPDOWN,
  MULTISELECT_DROPDOWN,
  NUMBER_INPUT,
  STANDARDS_POPUP,
  STRING_INPUT,
  formFieldNames,
  oneDayInMilliseconds,
} from '../../../constants/form'
import { TAGS } from '../../../constants/groupForm'
import {
  SelectWrapper,
  StyledDatePicker,
  StyledDropDown,
} from './styled-components'

const {
  goal: { START_DATE },
} = formFieldNames

const FormField = ({
  formData,
  handleFieldDataChange,
  fieldType,
  placeholder,
  field,
  optionsData = [],
  startDate: termStartDate,
  endDate: termEndDate,
  tagProps,
  disabled = false,
  allowClear = false,
}) => {
  const multiSelectExtraProps =
    fieldType === MULTISELECT_DROPDOWN
      ? { mode: 'multiple', maxTagTextLength: 10 }
      : {}

  const disableStartDates = (date) => {
    const now = Date.now().valueOf()
    const _startDate = termStartDate > now ? termStartDate : now
    date = +moment.utc(date.format())
    const selectedEndDate = formData.endDate

    const datesLessThanCurrentDate =
      _startDate && date <= _startDate - oneDayInMilliseconds

    const datesGreaterThanTermEndDate =
      termEndDate && date >= termEndDate + oneDayInMilliseconds

    const datesGreaterThanSelectedEndDate =
      selectedEndDate && date >= selectedEndDate

    if (
      datesLessThanCurrentDate ||
      datesGreaterThanTermEndDate ||
      datesGreaterThanSelectedEndDate
    ) {
      return true
    }
    return false
  }

  const disableEndDates = (date) => {
    date = +moment.utc(date.format())
    const now = Date.now().valueOf()
    const _startDate = termStartDate > now ? termStartDate : now
    const selectedStartDate = formData.startDate

    const datesLessThanTomorrowsDate =
      _startDate && date <= _startDate + oneDayInMilliseconds

    const datesGreaterThanTermEndDateNextDay =
      termEndDate && date >= termEndDate + oneDayInMilliseconds

    const datesLessThanSelectedStartDateNextDay =
      selectedStartDate && date <= selectedStartDate + oneDayInMilliseconds

    if (
      datesLessThanTomorrowsDate ||
      datesGreaterThanTermEndDateNextDay ||
      datesLessThanSelectedStartDateNextDay
    ) {
      return true
    }
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
          allowClear={allowClear}
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
            disabled={disabled}
            selectedSubject={formData.subjects}
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
          value={formData[field] ? moment(formData[field]) : undefined}
          disabledDate={
            field === START_DATE ? disableStartDates : disableEndDates
          }
          onChange={(date) => {
            if (date) {
              handleFieldDataChange(
                field,
                +moment.utc(date?.format('YYYY-MM-DD'))
              )
            }
          }}
          showToday={false}
          allowClear={false}
          // TODO check how much duration can user select (termid).
        />
      </EduIf>
      <EduIf condition={fieldType === TAGS}>
        <Tags
          {...tagProps}
          showLabel={false}
          fieldSetLineHeight="unset"
          selectorHeight="32px"
        />
      </EduIf>
    </>
  )
}

export default FormField
