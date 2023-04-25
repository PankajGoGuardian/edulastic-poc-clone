import React from 'react'
import { Col, Row } from 'antd'
import { lightRed2 } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import {
  PERFORMANCE_BAND,
  DROPDOWN,
  formFieldNames,
} from '../../../constants/form'
import { getOptionsData } from '../../utils'
import { StyledFilterLabel } from './styled-components'
import FormField from './FormField'

const {
  goal: { PERFORMANCE_BAND_ID, METRIC },
} = formFieldNames

const FormSection = ({
  formFields,
  formData,
  handleFieldDataChange,
  groupOptions,
  performanceBandOptions,
  targetPerformanceBandOptions,
  goalsOptions,
  attendanceBandOptions,
  targetAttendanceBandOptions,
}) => {
  const { measureType = '', type = 'academic' } = formData
  const hideBandField = measureType !== PERFORMANCE_BAND
  const isMeasureTypePerformanceBand = measureType === PERFORMANCE_BAND

  return (
    <Row gutter={[20]}>
      {Object.values(formFields).map(
        ({
          field,
          label,
          fieldType,
          isRequired = false,
          placeholder,
          optionsData = [],
          colSpan = 7,
          startDate,
          endDate,
          allowClear,
        }) => {
          if (field === PERFORMANCE_BAND_ID && hideBandField) {
            return null
          }
          if (field === METRIC && isMeasureTypePerformanceBand) {
            fieldType = DROPDOWN
          }
          optionsData = getOptionsData({
            field,
            optionsData,
            groupOptions,
            performanceBandOptions:
              type === 'academic'
                ? performanceBandOptions
                : attendanceBandOptions,
            targetPerformanceBandOptions:
              type === 'academic'
                ? targetPerformanceBandOptions
                : targetAttendanceBandOptions,
            goalsOptions,
            attendanceBandOptions,
          })
          return (
            <Col span={colSpan} key={field}>
              <StyledFilterLabel>
                {label}
                <EduIf condition={isRequired}>
                  <span style={{ color: lightRed2, marginLeft: 3 }}>*</span>
                </EduIf>
              </StyledFilterLabel>
              <FormField
                formData={formData}
                handleFieldDataChange={handleFieldDataChange}
                fieldType={fieldType}
                placeholder={placeholder}
                field={field}
                optionsData={optionsData}
                startDate={startDate}
                endDate={endDate}
                disabled={field === 'standardDetails' && !formData.subjects}
                allowClear={allowClear}
              />
            </Col>
          )
        }
      )}
    </Row>
  )
}

export default FormSection
