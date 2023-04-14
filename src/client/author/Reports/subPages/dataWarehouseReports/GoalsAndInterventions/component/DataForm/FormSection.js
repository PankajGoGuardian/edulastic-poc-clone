import React from 'react'
import { Col, Row } from 'antd'
import { lightRed2 } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import { PERFORMANCE_BAND, BAND, METRIC, DROPDOWN } from '../../constants/form'
import { StyledFilterLabel } from './styled-components'
import FormField from './FormField'

const FormSection = ({ formFields, formData, handleFieldDataChange }) => {
  const { measureType = '' } = formData
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
        }) => {
          if (field === BAND && hideBandField) {
            return null
          }
          if (field === METRIC && isMeasureTypePerformanceBand) {
            fieldType = DROPDOWN
          }
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
              />
            </Col>
          )
        }
      )}
    </Row>
  )
}

export default FormSection
