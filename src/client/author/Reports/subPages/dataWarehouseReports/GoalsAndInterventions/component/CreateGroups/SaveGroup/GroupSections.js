import React from 'react'
import { Col, Row } from 'antd'
import { EduIf } from '@edulastic/common'
import { lightRed2 } from '@edulastic/colors'
import { StyledFilterLabel } from '../../DataForm/styled-components'
import { getOptionsData } from '../../../utils'
import FormField from '../../DataForm/FormField'

const GroupSection = ({
  formFields,
  groupData,
  handleFieldDataChange,
  courseData,
}) => {
  return (
    <Row gutter={[20]}>
      {Object.values(formFields).map(
        ({
          field,
          colSpan = 7,
          label,
          isRequired = false,
          placeholder = '',
          fieldType,
          optionsData,
        }) => {
          optionsData = getOptionsData({
            field,
            optionsData,
            courseData,
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
                formData={groupData}
                fieldType={fieldType} // string,dropdown
                placeholder={placeholder}
                handleFieldDataChange={handleFieldDataChange}
                field={field} // grades,subjects...
                optionsData={optionsData} // static value for dropdown
              />
            </Col>
          )
        }
      )}
    </Row>
  )
}

export default GroupSection
