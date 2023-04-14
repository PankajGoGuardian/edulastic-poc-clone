import React from 'react'
import styled from 'styled-components'
import { Col, Row } from 'antd'
import { lightRed2, greyThemeDark4 } from '@edulastic/colors'
import { EduIf, FieldLabel } from '@edulastic/common'
import { PERFORMANCE_BAND, BAND, METRIC, DROPDOWN } from './constants'
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
              <StlyedFilterLabel>
                {label}
                <EduIf condition={isRequired}>
                  <span style={{ color: lightRed2, marginLeft: 3 }}>*</span>
                </EduIf>
              </StlyedFilterLabel>
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

const StlyedFilterLabel = styled(FieldLabel)`
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 14px;
  color: ${greyThemeDark4};
`

export default FormSection
